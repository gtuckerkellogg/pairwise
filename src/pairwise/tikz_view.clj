(ns pairwise.tikz-view
  (:require [pairwise.linear :as pairwise]
            [pairwise.matrix :as matrix]
            [pairwise.substitution :refer :all]
            [clojure.string :as str]
            [clojure.java.io :as io]))


(defn load-header []
  (if-let [resource (io/resource "tikz/header.tex")]
    (slurp resource)
    (throw (Exception. "Could not find tikz/header.tex resource"))))

(def header (load-header))

(defn scale-tikz [s1 s2]
  (let [scale (+ 2 (max (count s1) (count s2)))]
    (format "\\pgftransformscale{%3.2f}\n" (/ 8. scale))))

(defn draw-grid [s1 s2]
  (let [M (inc (count s1))
        N (inc (count s2))]
    ["\\pgftransformrotate{-90}\n"
     (format "\\draw [xshift=-0.5cm,yshift=-0.5cm,color=lightgray] (0,0) grid (%d,%d);\n" N M)
     (map str (map-indexed #(format "\\draw (-1,%s) node [scale=1] {%s};\n" (inc %1) %2) (seq s1)))
     (map str (map-indexed #(format "\\draw (%s,-1) node [scale=1] {%s};\n" (inc %1) %2) (seq s2)))]
    ))


(defn latex-env [env s]
  (vector (format "\n\\begin{%s}\n" (name env))
          s
          (format "\n\\end{%s}\n" (name env))))


(defn latex-command [cmd args s]
  (vector (if args
            (format "\\%s%s{\n" (name cmd) args)
            (format "\\%s{\n" (name cmd)))
          s
          "}"))


(defn- cell-step
  "Compute Beamer overlay step number for a cell at [row col] in matrix D."
  [D [row col]]
  (inc (+ col (* row (count (first D))))))

(defn- draw-score [D ij]
  (let [score (:score (get-in D ij))
        step (cell-step D ij)
        i (first ij)
        j (second ij)]
    (format "\\visible<%d->{\\draw (%d,%d) node [fill=white,scale=0.5] {%s};}\n" step i j score)))

(defn- draw-dp-arrows [D ij]
  (let [from (:from (get-in D ij))
        step (cell-step D ij)
        direction (:direction (get-in D ij))
        direction-map {:horiz "drawleft"
                  :vert  "drawup"
                  :diag  "drawmatch"}
        i (first ij)
        j (second ij)]
    (when-not (nil? (first direction))
      (map-indexed #(format "\\visible<%d->{\\%s{%d}{%d}{%s}}\n" step (%2 direction-map) i j "align step" %1) direction )
      )))

(defn- draw-optimal-paths [a]
  (let [paths    (:optimal-paths a)
        path-steps  (mapcat (partial partition 2 1) paths)
        reveal-times (flatten (:optimal-path-steps a))
        direction-map {:horiz "drawleft" :vert "drawup" :diag "drawmatch"}
        draw-one (fn [step step-time]
                   (let [from (first step)
                         to (second step)
                         substitution-type (get-in a [:dp-matrix (first from) (second from) :substitution-type])
                         draw (direction-map (matrix/direction-between from to))]
                     (if (= substitution-type :match)
                       (format "\\visible<%d->{\\%s{%d}{%d}{optimal step}}\n" step-time draw (first from) (second from))                       
                       (format "\\visible<%d->{\\%s{%d}{%d}{optimal-but-non-identical step}}\n" step-time draw (first from) (second from))                       
                       )
))]
    (apply str (mapcat draw-one path-steps reveal-times))
    )
  )

(defn tikz-alignment
  "doc-string"
  [alignments]
  (let [ij      (matrix/cell-coordinates (:dp-matrix alignments))
        content (flatten  [(draw-grid (:sequence-1 alignments) (:sequence-2 alignments))
                           (map #(draw-score (:dp-matrix alignments) %1) ij)
                           (map #(draw-dp-arrows (:dp-matrix alignments) %1) ij)
                           (draw-optimal-paths alignments)
                           ])
        ]

    (str/join   (flatten (list header  (->> (flatten content)
                                            (latex-env :tikzpicture)
                                            (latex-env :standaloneframe)
                                            (latex-env :document))))
              )))



