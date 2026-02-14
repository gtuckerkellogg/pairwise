(ns pairwise.linear
  (:require [pairwise.alignment :as alignment]))

;; ---------------------------------------------------------------------------
;; Helpers (linear-specific implementation details)
;; ---------------------------------------------------------------------------

(defn has-score?
  "predicate for score"
  [s]
  (and (map? s) (number? (:score s))))

(defn substitution-type
  "return the type of substitution at positions i and j of strings s1 and s2"
  [s1 s2 i j]
  (assert (and (> i -1) (<= i (inc (count s1)))) (str "i is " i ", (count s1) is " (count s1) ", s1 is " s1))
  (assert (and (> j -1) (<= j (inc (count s2)))) (str "j is " j ", (count s2) is " (count s2) ", s2 is " s2))
  (cond
    (or (zero? i) (zero? j)) nil
    (= (get s1 (dec i)) (get s2 (dec j))) :match
    :else :mismatch))

(defn- substitution-score
  "return the score for a substitution"
  [D i j s]
  (let [[i' j'] [(dec i) (dec j)]]
    (cond
      (and (zero? i) (zero? j)) {:score 0 :from nil}
      (or (zero? i) (zero? j))  {:score nil :from nil}
      :else {
             :score (+ (get-in D [i' j' :score]) s)
             :from  [i' j']
             :direction  :diag})))

(defn- score-vertical-gap
    "return the score for a vertical gap condition with gap penalty d"
  [D row col d]
  (cond
    (zero? row)                              {:score nil :from nil}
    (nil? (get-in D [(dec row) col :score])) {:score nil :from nil}
    :else
    {:score (-  (get-in D [(dec row) col :score] ) d)
     :from  [(dec row) col]
     :direction  :vert
     }))

(defn- score-horizontal-gap
  "return the score for a horizontal gap condition with gap penalty d"
  [D row col d]
  (cond
    (zero? col)                              {:score nil :from nil}
    (nil? (get-in D [row (dec col) :score])) {:score nil :from nil}
    :else
    {:score (-  (get-in D [row (dec col) :score] ) d)
     :from  [row (dec col)]
     :direction  :horiz
     }))

(defn- select-best-scores
  "Given candidate score maps, return the max score and all tied sources.
   For local alignment, normalizes zero-score candidates to {:score 0 :from nil}."
  [candidates type]
  (let [valid     (filter has-score? (remove nil? candidates))
        max-score (:score (apply max-key :score valid))
        with-zero (if (= type :local)
                    (map #(if (zero? (:score %)) {:score 0 :from nil} %) valid)
                    valid)
        sources   (distinct (filter #(= (:score %) max-score) with-zero))]
    {:max-score max-score
     :sources   sources}))

;; ---------------------------------------------------------------------------
;; Multimethod implementations for :linear gap model
;; ---------------------------------------------------------------------------

(defmethod alignment/initialise-matrix :linear
  [_gap-model s1 s2]
  (let [n (inc (count s1))
        m (inc (count s2))
        D (vec (repeat m (vec (repeat n {:score nil :from nil}))))]
    (assoc-in D [0 0 :score] 0)))

(defmethod alignment/score-cell :linear
  [_gap-model D S gap-penalty s1 s2 row col & {:keys [type]}]
  (let [s          (get S [(get s1 (dec col)) (get s2 (dec row))])
        candidates [(substitution-score D row col s)
                    (score-horizontal-gap D row col gap-penalty)
                    (score-vertical-gap D row col gap-penalty)
                    (when (= type :local) {:score 0 :from nil})]
        {:keys [max-score sources]} (select-best-scores candidates type)
        directions (map :direction sources)]
    (assoc-in D [row col]
              {:score             max-score
               :substitution-type (when (some #{:diag} directions)
                                    (substitution-type s1 s2 col row))
               :from              (map :from sources)
               :direction         directions})))

(defmethod alignment/build-dp-matrix :linear
  [gap-model S gap-penalty s1 s2 & {:keys [type]}]
  (let [D  (alignment/initialise-matrix gap-model s1 s2)
        ij (for [cols (range (inc (count s1)))
                 rows (range (inc (count s2)))]
             [rows cols])]
    (reduce #(alignment/score-cell gap-model %1 S gap-penalty s1 s2 (first %2) (second %2) :type type)
            D ij)))

(defmethod alignment/alignment-score :linear
  [_gap-model D type]
  (cond (= type :global) (get-in D [(dec (count D))
                                    (dec (count (first D))) :score])
        (= type :local) (apply max (flatten (map #(map :score %) D)))))

(defmethod alignment/get-starting :linear
  [_gap-model D type]
  (cond (= type :global) (list [(dec (count D))
                                (dec (count (first D)))])
        (= type :local)  (let [top-score (apply max (flatten (map #(map :score %) D)))
                               starting  (for [r (range (count D))
                                               c (range (count (first D)))]
                                           (when (= top-score (get-in D [r c :score]))
                                             [r c]))]
                           (remove nil? starting))))

(defmethod alignment/graph-of :linear
  [_gap-model D]
  (let [ij (for [rows (range (count D))
                 cols (range (count (first D)))]
             [rows cols])]
    (into {} (map (fn [idx] {idx (get-in D idx)}) (reverse ij)))))

(defmethod alignment/get-goalfn :linear
  [gap-model D type]
  (let [goal (set
              (cond (= type :global)
                    '([0 0])
                    (= type :local)
                    (keys (filter #(zero? (:score (second %))) (alignment/graph-of gap-model D)))
                    (= type :semiglobal)
                    (filter #(or (zero? (first %)) (zero? (second %))) (keys (alignment/graph-of gap-model D)))))]
    #(contains? goal %)))

;; ---------------------------------------------------------------------------
;; Backward-compatible wrappers
;; ---------------------------------------------------------------------------

(defn initialise-D
  "Initialize a dynamic programming matrix, given two sequences s1 and s2"
  [s1 s2]
  (alignment/initialise-matrix :linear s1 s2))

(defn score-cell
  "score a cell"
  [D S gap-penalty s1 s2 row col & {:keys [type]}]
  (alignment/score-cell :linear D S gap-penalty s1 s2 row col :type type))

(defn build-dp-matrix
  "build the dynamic programming matrix for Needleman Wunsch or Smith-Waterman"
  [scoring-matrix gap-penalty s1 s2 & {:keys [type]}]
  (alignment/build-dp-matrix :linear scoring-matrix gap-penalty s1 s2 :type type))

(defn alignment-score
  [D type]
  (alignment/alignment-score :linear D type))

(defn get-starting [D type]
  (alignment/get-starting :linear D type))

(defn graph-of [D]
  (alignment/graph-of :linear D))

(defn get-goalfn [D type]
  (alignment/get-goalfn :linear D type))

(defn dfs [graph met-goal?]
  (alignment/dfs graph met-goal?))

(defn findpaths [D type]
  (alignment/findpaths :linear D type))

(defn path-to-alignment [path s1 s2]
  (alignment/path-to-alignment path s1 s2))

(defn pairwise-align
  "Backward-compatible wrapper. Prefer pairwise.alignment/pairwise-align."
  [s1 s2 S gap-penalty & {:keys [type] :or {type :global}}]
  (alignment/pairwise-align s1 s2 S gap-penalty :type type :gap-model :linear))
