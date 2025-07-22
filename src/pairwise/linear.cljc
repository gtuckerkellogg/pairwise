(ns pairwise.linear)

(defn initialise-D
  "Initialize a dynamic programming matrix, given two sequences s1 and s2"
  [s1 s2]
  (let [n (inc (count s1))
        m (inc (count s2))
        D (vec (repeat m (vec (repeat n {
                                         :score nil
                                         :from  nil
                                         }))))]
    (assoc-in D [0 0 :score] 0)))

(defn has-score? 
  "predicate for score"
  [s]
  (and (map? s) (number? (:score s))))


(defn substitution-type
  "return the type of substitution at positions i and j of strings s1 and s2"
  [s1 s2 i j]
  (assert (and (> i -1) (<= i (inc (count s1)))) (format "i is %d, (count s1) is %d, s1 is %s" i (count s1) s1))
  (assert (and (> j -1) (<= j (inc (count s2)))) (format "j is %d, (count s2) is %d, s2 is %s" j (count s2) s2))
  (cond
    (or (zero? i) (zero? j)) nil
    (= (get s1 (dec i)) (get s2 (dec j))) :match
    :else :mismatch))

(defn substitution-score
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

(defn score-vertical-gap
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


(defn score-horizontal-gap
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


(defn score-cell
  "score a cell"
  [D S gap-penalty s1 s2 row col & {:keys [type]}]
  (let [L1        (get (vec (seq s1)) (dec col)) 
        L2        (get (vec (seq s2)) (dec row))
        cols      (inc (count s1))
        step      (+ col (* row cols))
        s         (get S [L1 L2])
        score-vec (remove nil?
                          [(substitution-score D row col s)
                           (score-horizontal-gap D row col gap-penalty)
                           (score-vertical-gap D row col gap-penalty)
                           (when (= type :local) {:score 0 :from nil})])
        score-vec (filter has-score? score-vec)
        max-score (:score (apply max-key :score score-vec))
        score-vec (if (= type :local)
                    (map #(if (zero? (:score %1)) {:score 0 :from nil} %1) score-vec)
                    score-vec)
        score-vec (distinct (filter #(= (:score %1) max-score) score-vec))
        direction (map :direction score-vec)
        diag? (some #(= :diag %) direction)
        ]
    (assoc-in D [row col ] {:score max-score
                            :substitution-type (if diag? (substitution-type s1 s2 col row) nil)
                            :from  (map :from score-vec)
                            :direction direction
                            :step step
                            })))


(defn build-dp-matrix 
  "build the dynamic programming matrix for Needleman Wunsch or Smith-Waterman"
  [scoring-matrix gap-penalty s1 s2 & {:keys [type]}]
  (let [D  (initialise-D s1 s2)
        ij (for [cols (range (inc (count s1)))
                 rows (range (inc (count s2)))] 
             [rows cols])]
    (reduce #(score-cell %1 scoring-matrix gap-penalty s1 s2 (first %2) (second %2) :type type)
            D ij)))

(defn- graph-of 
  "transform a DP matrix into a graph with cells as keys"
  [D]
  (let [ij (for [rows (range (count D))
                 cols (range (count (first D)))] 
             [rows cols])]
    (into {} (map (fn [idx] {idx (get-in D idx)}) (reverse  ij)))))

(defn get-goalfn
  "return a function that returns true if reached the goal cell"
  [D type]
  (let [goal (set
              (cond (= type :global)
                    '([0 0])
                    (= type :local)
                    (keys (filter  #(zero? (:score (second %))) (graph-of D)))
                    (= type :semiglobal)
                    (filter #(or (zero? (first %)) (zero? (second %))) (keys (graph-of D)))))]
    #(contains? goal %1)))


(defn alignment-score 
  "doc-string"
  [D type]
  (cond (= type :global) (get-in D [(dec (count D))
                                    (dec (count (first D))) :score])
        (= type :local) (apply max (flatten (map #(map :score %1) D)))))


(defn get-starting [D type]
  (cond (= type :global) (list [(dec (count D))
                                (dec (count (first D)))])
        (= type :local)  (let [top-score (apply max (flatten (map #(map :score %1) D)))
                               starting  (for [r (range (count D))
                                               c (range (count (first D)))]
                                           (when (= top-score (get-in D [r c :score]))
                                             [r c]))]
                           (remove nil? starting))))

(defn dfs
  [graph met-goal?]
  (fn search
    [path visited]
    (let [current (peek path)]
      (if (met-goal? current)
        [path]
        (->> current graph :from
             (remove visited)
             (mapcat #(search (conj path %) (conj visited %))))))))

(defn findpaths
  "Returns a lazy sequence of all directed paths from starts to goals
  within graph."
  [D type]
  (let [met-goal?   (get-goalfn D type)
        start-cells (get-starting D type)
        graph       (graph-of D)
        search      (dfs graph met-goal?)
        start-cell (first start-cells)
        all-paths (mapcat  #(search [%1] #{%1}) start-cells)
        internal-cells (set (apply concat (map rest all-paths)))
        ]
    (filter #((complement contains?) internal-cells (first %)) all-paths)))


(defn path-to-alignment
  "Take as input a path of nodes and two input sequences. Generate an alignment"
  [path s1 s2]
  (let [res1   (seq s1)
        res2   (seq s2)
        to-aln (fn [idx1 idx2]
                 [(if (= (second idx1) (second idx2)) \- (get s1 (second idx2)))
                  (if (= (first idx1) (first idx2)) \- (get s2 (first idx2)))
                  
                  ])
        aln-chars (flatten (reverse (map to-aln path (rest path))))
        ]
    (apply hash-map (interleave [:top :bottom]
                                (map #(apply str %) (apply map list (partition 2 aln-chars)))
                                ))))


(defn pairwise-align
  "Return a pairwise alignment (including all the internals) for two sequences provided as strings. "
  [s1 s2 S gap-penalty & {:keys [type] :or {type :global}} ]
  (let [D            (initialise-D s1 s2)
        D            (build-dp-matrix S gap-penalty s1 s2 :type type)
        last-D-step  (* (inc (count s2)) (inc (count s1)))
        paths        (findpaths D type)
        when-visible (fn [path]
                       (->> path
                            count
                            dec
                            range
                            (map + (repeat (count path) (+ 1 last-D-step)))))
        path-steps (map when-visible paths)]
    {:score          (alignment-score D type)
     :rows (count (seq s2))
     :cols (count (seq s1))
     :optimal-paths  paths
     :optimal-path-steps path-steps
     :alignments     (map  #(path-to-alignment %1 s1 s2) paths)
     :dp-matrix      D
     :sequence-1     s1
     :sequence-2     s2
     :scoring-matrix S
     :gap-penalty    gap-penalty
     }))


