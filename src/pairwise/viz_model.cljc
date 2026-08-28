(ns pairwise.viz-model
  (:require [pairwise.matrix :as matrix]))

(defn- fmt-score
  "Round a numeric score to at most 1 decimal place.
   Integers display without a decimal point."
  [x]
  (when (some? x)
    (let [r (/ (Math/round (* (double x) 10)) 10.0)]
      (if (zero? (rem r 1)) (int r) r))))

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
    {:type :cell-score :row r :col c :score (fmt-score score)
     :step (cell-step num-cols [r c])}))

(defn- state-scores
  "Generate :state-scores instructions from an affine DP matrix.
   Only emitted when cells have :vm/:vx/:vy keys."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [cell (get-in D [r c])]
        :when (contains? cell :vm)]
    {:type :state-scores
     :row r :col c
     :vm (fmt-score (:vm cell))
     :vx (fmt-score (:vx cell))
     :vy (fmt-score (:vy cell))
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
                 direction (matrix/direction-between [from-r from-c] [to-r to-c])
                 ;; :substitution-type describes the residue pair aligned by a
                 ;; diagonal step. It is meaningless for gap moves, so only
                 ;; attach it to diagonal arrows.
                 sub-type (when (= direction :diag)
                            (get-in D [from-r from-c :substitution-type]))]
             {:type :path-arrow
              :from-row from-r :from-col from-c
              :to-row to-r :to-col to-c
              :direction direction
              :substitution-type sub-type
              :step step-time}))
         path-steps reveal-times)))

(defn- state-keyword->from-key
  "Map state keyword to the DP matrix key holding that state's traceback sources."
  [state]
  (case state :M :from-m :X :from-x :Y :from-y))

(defn- state-dp-arrows
  "Generate :state-arrow instructions with :arrow-type :dp from affine DP matrix.
   Reads :from-m, :from-x, :from-y per cell to produce state-aware arrows."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [cell (get-in D [r c])
              step (cell-step num-cols [r c])]
        from-state [:M :X :Y]
        :let [sources (filter some? (get cell (state-keyword->from-key from-state)))]
        :when (seq sources)
        [to-r to-c to-state] sources]
    {:type :state-arrow
     :from-row r :from-col c :from-state from-state
     :to-row to-r :to-col to-c :to-state to-state
     :direction (matrix/direction-between [r c] [to-r to-c])
     :arrow-type :dp
     :step step}))

(defn- state-path-arrows
  "Generate :state-arrow instructions with :arrow-type :optimal from affine optimal paths.
   Affine path nodes are [row col :state]."
  [result]
  (let [paths (:optimal-paths result)
        path-steps (mapcat (partial partition 2 1) paths)
        reveal-times (flatten (:optimal-path-steps result))
        D (:dp-matrix result)]
    (map (fn [step step-time]
           (let [from (first step)
                 to (second step)
                 from-r (first from) from-c (second from) from-state (nth from 2)
                 to-r (first to) to-c (second to) to-state (nth to 2)]
             {:type :state-arrow
              :from-row from-r :from-col from-c :from-state from-state
              :to-row to-r :to-col to-c :to-state to-state
              :direction (matrix/direction-between [from-r from-c] [to-r to-c])
              ;; Only V'M steps align a residue pair; gap states do not.
              :substitution-type (when (= from-state :M)
                                   (get-in D [from-r from-c :substitution-type]))
              :arrow-type :optimal
              :step step-time}))
         path-steps reveal-times)))

(defn- affine-mode?
  "Check if a DP matrix was produced by the affine algorithm."
  [D]
  (contains? (get-in D [0 0]) :vm))

(defn- max-step
  "Find the maximum :step value across a collection of instructions."
  [instructions]
  (reduce max 0 (keep :step instructions)))

(defn- truncate-instructions
  "Limit the build to `n` overlay steps.

   `overflow` decides what becomes of everything revealed later:
     :drop      mark it :past-cap, so it never appears on a slide. It is marked
                rather than removed because the cap limits the presentation,
                not the printed page — a handout that shows the finished
                picture must still show it. The renderer decides.
     :collapse  move it all onto step n+1, so the slides step through to n and
                then jump straight to the finished picture

   Step numbers are assigned before this runs, so the opening n slides are
   identical to the first n slides of the untruncated build either way.

   A decomposition phase is dropped when it starts after n under both policies:
   it is a separate exposition rather than part of the solution, and collapsing
   its three overlays onto one slide would draw all three states at once."
  [instructions n overflow]
  (vec
   (keep (fn [{:keys [step start-step states] :as inst}]
           (cond
             ;; A decomposition phase occupies one step per state.
             start-step (let [kept (take (inc (- n start-step)) states)]
                          (when (seq kept) (assoc inst :states (vec kept))))
             ;; :grid and :seq-label carry no step — they are always drawn.
             (nil? step) inst
             (<= step n) inst
             (= overflow :collapse) (assoc inst :step (inc n))
             :else (assoc inst :past-cap true)))
         instructions)))

(defn alignment->instructions
  "Transform an alignment result into a renderer-agnostic sequence of
   drawing instructions.

   Options:
     :last-overlay  keep only the first n overlay steps (nil = all)
     :overflow      what to do with later steps, :drop (default) or :collapse
                    (move them onto step n+1 as a single finished-picture slide)"
  ([result] (alignment->instructions result nil))
  ([result {:keys [last-overlay overflow] :or {overflow :drop}}]
  (let [D (:dp-matrix result)
        s1 (:sequence-1 result)
        s2 (:sequence-2 result)
        [rows cols] (matrix/matrix-dimensions D)
        affine? (affine-mode? D)]
    (if affine?
      (let [st-scores (state-scores D cols)
            st-dp (state-dp-arrows D cols)
            st-path (state-path-arrows result)
            all-insts (concat [{:type :grid :rows rows :cols cols}]
                              (seq-labels s1 s2)
                              st-dp st-path st-scores)
            decomp-start (inc (max-step all-insts))
            max-progressive (dec decomp-start)]
        (let [insts (cond-> (vec (concat all-insts
                                         [{:type :decomposition-phase
                                           :states [:M :X :Y]
                                           :start-step decomp-start
                                           :state-scores (vec st-scores)
                                           :state-arrows (vec (concat st-dp st-path))}]))
                      last-overlay (truncate-instructions last-overlay overflow))]
          {:dimensions {:rows rows :cols cols}
           :sequences {:top s1 :left s2}
           ;; The progressive fill must stop being drawn no later than the last
           ;; slide that exists, or Beamer pads the deck with empty overlays.
           ;; Derived from what survived, so :collapse keeps its extra slide.
           ;; :past-cap instructions never reach a slide, so they must not
           ;; stretch the window that bounds the ones that do.
           :max-progressive-step (min max-progressive
                                      (max-step (remove :past-cap insts)))
           :instructions insts}))
      {:dimensions {:rows rows :cols cols}
       :sequences {:top s1 :left s2}
       :instructions
       (cond-> (vec (concat
                     [{:type :grid :rows rows :cols cols}]
                     (seq-labels s1 s2)
                     (cell-scores D cols)
                     (state-scores D cols)
                     (dp-arrows D cols)
                     (path-arrows result)))
         last-overlay (truncate-instructions last-overlay overflow))}))))
