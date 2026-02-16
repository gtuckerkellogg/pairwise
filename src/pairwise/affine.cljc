(ns pairwise.affine
  (:require [pairwise.alignment :as alignment]))

;; ---------------------------------------------------------------------------
;; Helpers (affine-specific implementation details)
;; ---------------------------------------------------------------------------

(defn- substitution-type
  "Return the type of substitution at positions col and row of strings s1 and s2."
  [s1 s2 col row]
  (cond
    (or (zero? col) (zero? row)) nil
    (= (get s1 (dec col)) (get s2 (dec row))) :match
    :else :mismatch))

(defn- best-candidate
  "From a seq of [score source] pairs, return the best (max score) with all tied sources.
   Filters out nil scores. Returns {:score best :sources [source ...]} or nil if none."
  [candidates]
  (let [valid (filter (comp some? first) candidates)]
    (when (seq valid)
      (let [best (apply max (map first valid))
            sources (mapv second (filter #(= best (first %)) valid))]
        {:score best :sources sources}))))

(defn- score-vm
  "V'M recurrence: diagonal move with substitution score.
   V'M[i,j] = max(V'M[i-1,j-1], V'X[i-1,j-1], V'Y[i-1,j-1]) + S(s1[j], s2[i])
   For local alignment, includes a zero-floor (free restart)."
  [D S s1 s2 row col type]
  (if (or (zero? row) (zero? col))
    nil
    (let [prev-row (dec row)
          prev-col (dec col)
          prev     (get-in D [prev-row prev-col])
          s        (get S [(get s1 (dec col)) (get s2 (dec row))])
          candidates (cond-> []
                       (some? (:vm prev)) (conj [(+ (:vm prev) s) [prev-row prev-col :M]])
                       (some? (:vx prev)) (conj [(+ (:vx prev) s) [prev-row prev-col :X]])
                       (some? (:vy prev)) (conj [(+ (:vy prev) s) [prev-row prev-col :Y]])
                       (= type :local)    (conj [s nil]))  ;; free restart: 0 + s
          result   (best-candidate candidates)]
      (when result
        (if (and (= type :local) (neg? (:score result)))
          nil  ;; local: V'M can't go below 0 (but we use the substitution score from 0, not floor at 0)
          result)))))

(defn- score-vx
  "V'X recurrence: vertical gap (gap in s1).
   V'X[i,j] = max(V'M[i-1,j] - d, V'X[i-1,j] - e)"
  [D row col {:keys [d e]} type]
  (if (zero? row)
    nil
    (let [prev     (get-in D [(dec row) col])
          prev-row (dec row)
          candidates (cond-> []
                       (some? (:vm prev)) (conj [(- (:vm prev) d) [prev-row col :M]])
                       (some? (:vx prev)) (conj [(- (:vx prev) e) [prev-row col :X]]))]
      (when-let [result (best-candidate candidates)]
        (when-not (and (= type :local) (neg? (:score result)))
          result)))))

(defn- score-vy
  "V'Y recurrence: horizontal gap (gap in s2).
   V'Y[i,j] = max(V'M[i,j-1] - d, V'Y[i,j-1] - e)"
  [D row col {:keys [d e]} type]
  (if (zero? col)
    nil
    (let [prev     (get-in D [row (dec col)])
          prev-col (dec col)
          candidates (cond-> []
                       (some? (:vm prev)) (conj [(- (:vm prev) d) [row prev-col :M]])
                       (some? (:vy prev)) (conj [(- (:vy prev) e) [row prev-col :Y]]))]
      (when-let [result (best-candidate candidates)]
        (when-not (and (= type :local) (neg? (:score result)))
          result)))))

(defn- collect-display-info
  "Combine per-state results into display :from and :direction lists (coordinate-only)."
  [vm-result vx-result vy-result]
  (let [all-scores (filterv some? [(when vm-result (:score vm-result))
                                    (when vx-result (:score vx-result))
                                    (when vy-result (:score vy-result))])
        display-score (when (seq all-scores) (apply max all-scores))
        ;; Collect display arrows from all states
        vm-from (when vm-result
                  (map (fn [src] {:from (when src (vec (take 2 src))) :direction :diag})
                       (:sources vm-result)))
        vx-from (when vx-result
                  (map (fn [src] {:from (when src (vec (take 2 src))) :direction :vert})
                       (:sources vx-result)))
        vy-from (when vy-result
                  (map (fn [src] {:from (when src (vec (take 2 src))) :direction :horiz})
                       (:sources vy-result)))
        all-from (concat vm-from vx-from vy-from)
        ;; Remove nil :from entries (from local free restarts)
        display-from (distinct (keep :from all-from))
        display-dirs (distinct (map :direction all-from))]
    {:score display-score
     :from (when (seq display-from) (vec display-from))
     :direction (when (seq display-dirs) (vec display-dirs))}))

;; ---------------------------------------------------------------------------
;; Multimethod implementations for :affine gap model
;; ---------------------------------------------------------------------------

(defmethod alignment/initialise-matrix :affine
  [_gap-model s1 s2]
  (let [ncols (inc (count s1))
        nrows (inc (count s2))
        empty-cell {:score nil :vm nil :vx nil :vy nil
                    :from nil :direction nil :substitution-type nil
                    :from-m nil :from-x nil :from-y nil}
        D (vec (repeat nrows (vec (repeat ncols empty-cell))))]
    ;; [0,0]: V'M = 0
    (-> D
        (assoc-in [0 0] (assoc empty-cell :score 0 :vm 0)))))

(defmethod alignment/score-cell :affine
  [_gap-model D S gap-penalty s1 s2 row col & {:keys [type]}]
  (if (and (zero? row) (zero? col))
    D  ;; origin already initialized
    (let [;; V'M only valid for interior cells (needs diagonal predecessor)
          vm-result (score-vm D S s1 s2 row col type)
          ;; V'X: vertical gap — needs row > 0
          vx-result (score-vx D row col gap-penalty type)
          ;; V'Y: horizontal gap — needs col > 0
          vy-result (score-vy D row col gap-penalty type)

          {:keys [score from direction]} (collect-display-info vm-result vx-result vy-result)

          sub-type (when vm-result
                     (substitution-type s1 s2 col row))]
      (assoc-in D [row col]
                {:score score
                 :vm (when vm-result (:score vm-result))
                 :vx (when vx-result (:score vx-result))
                 :vy (when vy-result (:score vy-result))
                 :substitution-type sub-type
                 :from from
                 :direction direction
                 :from-m (when vm-result (vec (:sources vm-result)))
                 :from-x (when vx-result (vec (:sources vx-result)))
                 :from-y (when vy-result (vec (:sources vy-result)))}))))

(defmethod alignment/build-dp-matrix :affine
  [gap-model S gap-penalty s1 s2 & {:keys [type]}]
  (let [D  (alignment/initialise-matrix gap-model s1 s2)
        ij (for [cols (range (inc (count s1)))
                 rows (range (inc (count s2)))]
             [rows cols])]
    (reduce #(alignment/score-cell gap-model %1 S gap-penalty s1 s2 (first %2) (second %2) :type type)
            D ij)))

(defmethod alignment/alignment-score :affine
  [_gap-model D type]
  (cond
    (= type :global)
    (let [last-cell (get-in D [(dec (count D)) (dec (count (first D)))])]
      (apply max (filter some? [(:vm last-cell) (:vx last-cell) (:vy last-cell)])))

    (= type :local)
    (apply max (for [row D, cell row, :when (:score cell)] (:score cell)))))

(defn- best-state-at
  "Return the state keyword(s) with the highest score at a cell."
  [cell]
  (let [candidates (filter (comp some? second)
                           [[:M (:vm cell)] [:X (:vx cell)] [:Y (:vy cell)]])
        best (apply max (map second candidates))]
    (mapv first (filter #(= best (second %)) candidates))))

(defmethod alignment/get-starting :affine
  [_gap-model D type]
  (cond
    (= type :global)
    (let [last-cell (get-in D [(dec (count D)) (dec (count (first D)))])
          r (dec (count D))
          c (dec (count (first D)))]
      (mapv #(vector r c %) (best-state-at last-cell)))

    (= type :local)
    (let [top-score (alignment/alignment-score :affine D type)]
      (for [r (range (count D))
            c (range (count (first D)))
            :let [cell (get-in D [r c])]
            :when (= top-score (:score cell))
            state (best-state-at cell)]
        [r c state]))))

(defmethod alignment/get-goalfn :affine
  [gap-model D type]
  (cond
    (= type :global)
    (fn [node] (and (zero? (first node)) (zero? (second node))))

    (= type :local)
    (let [graph (alignment/graph-of gap-model D)]
      (fn [node]
        (let [entry (get graph node)]
          (or (nil? (:from entry))
              (empty? (:from entry))
              (<= (:score entry) 0)))))))

(defmethod alignment/graph-of :affine
  [_gap-model D]
  (into {}
    (for [r (range (count D))
          c (range (count (first D)))
          :let [cell (get-in D [r c])]
          [state score-key from-key] [[:M :vm :from-m]
                                       [:X :vx :from-x]
                                       [:Y :vy :from-y]]
          :when (some? (get cell score-key))]
      ;; Filter nil sources (local alignment free restarts have nil in :from-m)
      [[r c state] {:score (get cell score-key)
                    :from  (let [sources (get cell from-key)]
                             (when sources
                               (filterv some? sources)))}])))
