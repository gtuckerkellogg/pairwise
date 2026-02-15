(ns pairwise.viz-model
  (:require [pairwise.matrix :as matrix]))

(defn- cell-step
  "Compute Beamer overlay step number for a cell at [row col] in a matrix
   with the given number of columns."
  [num-cols [row col]]
  (inc (+ col (* row num-cols))))

(defn- seq-labels
  "Generate :seq-label instructions from the two input sequences."
  [s1 s2]
  (concat
   (map-indexed (fn [i ch] {:type :seq-label :axis :top :index i :char ch}) (seq s1))
   (map-indexed (fn [i ch] {:type :seq-label :axis :left :index i :char ch}) (seq s2))))

(defn- cell-scores
  "Generate :cell-score instructions from the DP matrix."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [score (get-in D [r c :score])]
        :when (some? score)]
    {:type :cell-score :row r :col c :score score
     :step (cell-step num-cols [r c])}))

(defn- dp-arrows
  "Generate :dp-arrow instructions from the DP matrix :from/:direction fields."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [cell (get-in D [r c])
              from-list (:from cell)
              dir-list (:direction cell)
              step (cell-step num-cols [r c])]
        ;; zip from and direction lists
        [from dir] (map vector (or from-list []) (or dir-list []))
        :when (and (some? from) (some? dir))]
    {:type :dp-arrow
     :from-row r :from-col c
     :to-row (first from) :to-col (second from)
     :direction dir
     :step step}))

(defn- path-arrows
  "Generate :path-arrow instructions from the optimal paths.
   Each path step [from to] becomes one arrow. Affine path nodes may be
   [row col :state] — we extract [row col] for coordinates."
  [result]
  (let [paths (:optimal-paths result)
        path-steps (mapcat (partial partition 2 1) paths)
        reveal-times (flatten (:optimal-path-steps result))
        D (:dp-matrix result)]
    (map (fn [step step-time]
           (let [from (first step)
                 to (second step)
                 ;; Handle both [r c] and [r c :state] nodes
                 from-r (first from) from-c (second from)
                 to-r (first to) to-c (second to)
                 sub-type (get-in D [from-r from-c :substitution-type])
                 direction (matrix/direction-between [from-r from-c] [to-r to-c])]
             {:type :path-arrow
              :from-row from-r :from-col from-c
              :to-row to-r :to-col to-c
              :direction direction
              :substitution-type sub-type
              :step step-time}))
         path-steps reveal-times)))

(defn alignment->instructions
  "Transform an alignment result into a renderer-agnostic sequence of
   drawing instructions."
  [result]
  (let [D (:dp-matrix result)
        s1 (:sequence-1 result)
        s2 (:sequence-2 result)
        [rows cols] (matrix/matrix-dimensions D)]
    {:dimensions {:rows rows :cols cols}
     :sequences {:top s1 :left s2}
     :instructions
     (vec (concat
           [{:type :grid :rows rows :cols cols}]
           (seq-labels s1 s2)
           (cell-scores D cols)
           (dp-arrows D cols)
           (path-arrows result)))}))
