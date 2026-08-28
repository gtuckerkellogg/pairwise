(ns pairwise.alignment)

;; ---------------------------------------------------------------------------
;; Multimethods — dispatching on gap-model (:linear or :affine)
;; ---------------------------------------------------------------------------

(defmulti initialise-matrix
  "Initialize the DP matrix/matrices for the given gap model."
  (fn [gap-model _s1 _s2] gap-model))

(defmulti score-cell
  "Score a single cell in the DP matrix."
  (fn [gap-model _D _S _gap-penalty _s1 _s2 _row _col & _opts] gap-model))

(defmulti build-dp-matrix
  "Build the complete DP matrix."
  (fn [gap-model _S _gap-penalty _s1 _s2 & _opts] gap-model))

(defmulti alignment-score
  "Extract the alignment score from a completed DP matrix."
  (fn [gap-model _D _type] gap-model))

(defmulti get-starting
  "Get the starting cell(s) for path traceback."
  (fn [gap-model _D _type] gap-model))

(defmulti graph-of
  "Transform a DP matrix into a graph for path tracing."
  (fn [gap-model _D] gap-model))

;; ---------------------------------------------------------------------------
;; Shared functions — algorithm-independent
;; ---------------------------------------------------------------------------

(defmulti get-goalfn
  "Return a function that returns true if reached the goal cell."
  (fn [gap-model _D _type] gap-model))

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
  [gap-model D type]
  (let [met-goal?   (get-goalfn gap-model D type)
        start-cells (get-starting gap-model D type)
        graph       (graph-of gap-model D)
        search      (dfs graph met-goal?)
        all-paths (mapcat #(search [%1] #{%1}) start-cells)
        internal-cells (set (apply concat (map rest all-paths)))]
    (remove #(contains? internal-cells (first %)) all-paths)))

(defn path-to-alignment
  "Take as input a path of nodes and two input sequences. Generate an alignment."
  [path s1 s2]
  (let [to-aln (fn [idx1 idx2]
                 [(if (= (second idx1) (second idx2)) \- (get s1 (second idx2)))
                  (if (= (first idx1) (first idx2)) \- (get s2 (first idx2)))])
        aln-chars (flatten (reverse (map to-aln path (rest path))))]
    (apply hash-map (interleave [:top :bottom]
                                (map #(apply str %) (apply map list (partition 2 aln-chars)))))))

(defn classify-alignment
  "Classify the structural pattern of a padded semi-global alignment.
  Examines leading and trailing gap characters in each strand to determine
  how the two sequences relate to each other.
  Returns a map with :pattern (keyword) and :description (string)."
  [{:keys [top bottom]}]
  (let [leading-gaps  (fn [s] (count (take-while #(= % \-) s)))
        trailing-gaps (fn [s] (count (take-while #(= % \-) (reverse s))))
        lt (leading-gaps top)   tt (trailing-gaps top)
        lb (leading-gaps bottom) tb (trailing-gaps bottom)]
    (cond
      (and (zero? lt) (zero? tt) (zero? lb) (zero? tb))
      {:pattern :complete
       :description "Both sequences are fully aligned end-to-end."}

      (and (pos? lb) (pos? tt))
      {:pattern :overlap-s1-s2
       :description "Suffix of sequence 1 overlaps with prefix of sequence 2."}

      (and (pos? lt) (pos? tb))
      {:pattern :overlap-s2-s1
       :description "Suffix of sequence 2 overlaps with prefix of sequence 1."}

      (and (pos? lb) (pos? tb))
      {:pattern :s2-in-s1
       :description "Sequence 2 is contained within sequence 1."}

      (and (pos? lt) (pos? tt))
      {:pattern :s1-in-s2
       :description "Sequence 1 is contained within sequence 2."}

      (pos? lb)
      {:pattern :s2-flush-right
       :description "Sequence 2 is aligned against the right end of sequence 1."}

      (pos? lt)
      {:pattern :s1-flush-right
       :description "Sequence 1 is aligned against the right end of sequence 2."}

      (pos? tt)
      {:pattern :s2-extends-right
       :description "Sequence 1 is fully aligned; sequence 2 has an unmatched suffix."}

      (pos? tb)
      {:pattern :s1-extends-right
       :description "Sequence 2 is fully aligned; sequence 1 has an unmatched suffix."})))

(defn match-line
  "Conservation line for an alignment — one character per aligned column:

     |  identical residues
     :  a differing pair the scoring matrix favours (score > 0), i.e. a
        conservative substitution
     .  any other differing pair
     ' ' a gap in either sequence

   Strictly positive, following BLAST and EMBOSS. A log-odds matrix scores a
   pair zero when it is observed exactly as often as chance predicts, which is
   an absence of evidence for conservation rather than evidence for it. A pair
   the matrix has no entry for likewise counts as dissimilar: similarity is
   only claimed where the matrix actually vouches for it."
  [{:keys [top bottom]} S]
  (apply str
         (map (fn [a b]
                (cond
                  (or (= a \-) (= b \-)) \space
                  (= a b) \|
                  :else (if (pos? (or (get S [a b]) (get S [b a]) 0)) \: \.)))
              top bottom)))

(defn- pad-alignment
  "Pad an alignment with flanking gaps for semi-global display.
   path is [start, ..., goal]; start is the high-index (bottom-right) end,
   goal is the low-index (top-left) end. s1 is top (cols), s2 is bottom (rows)."
  [aln path s1 s2]
  (let [goal  (peek path)
        start (first path)
        ;; Extract row/col (works for both [r c] and [r c state] nodes)
        grow (first goal)   gcol (second goal)
        srow (first start)  scol (second start)
        n (count s1)  m (count s2)
        ;; Prefix: residues before the goal cell
        pre-top    (str (subs s1 0 gcol) (apply str (repeat grow \-)))
        pre-bottom (str (apply str (repeat gcol \-)) (subs s2 0 grow))
        ;; Suffix: residues after the start cell
        suf-top    (str (subs s1 scol n) (apply str (repeat (- m srow) \-)))
        suf-bottom (str (apply str (repeat (- n scol) \-)) (subs s2 srow m))]
    {:top    (str pre-top (:top aln) suf-top)
     :bottom (str pre-bottom (:bottom aln) suf-bottom)}))

(defn pairwise-align
  "Return a pairwise alignment (including all the internals) for two sequences
  provided as strings."
  [s1 s2 S gap-penalty & {:keys [type gap-model] :or {type :global gap-model :linear}}]
  (let [D            (build-dp-matrix gap-model S gap-penalty s1 s2 :type type)
        last-D-step  (* (inc (count s2)) (inc (count s1)))
        paths        (findpaths gap-model D type)
        when-visible (fn [path]
                       (->> path
                            count
                            dec
                            range
                            (map + (repeat (count path) (+ 1 last-D-step)))))
        path-steps (map when-visible paths)
        raw-alns   (map #(path-to-alignment %1 s1 s2) paths)
        padded?    (= type :semiglobal)
        padded     (if padded?
                     (map #(pad-alignment %1 %2 s1 s2) raw-alns paths)
                     raw-alns)
        annotated  (if padded?
                     (map #(merge % (classify-alignment %)) padded)
                     padded)
        alignments (map #(assoc % :middle (match-line % S)) annotated)]
    {:score          (alignment-score gap-model D type)
     :rows (count (seq s2))
     :cols (count (seq s1))
     :optimal-paths  paths
     :optimal-path-steps path-steps
     :alignments     alignments
     :dp-matrix      D
     :sequence-1     s1
     :sequence-2     s2
     :scoring-matrix S
     :gap-penalty    gap-penalty}))
