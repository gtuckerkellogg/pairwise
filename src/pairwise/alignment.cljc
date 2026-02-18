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

(defn- pad-alignment
  "Pad an alignment with flanking gaps for semi-global/overlap display.
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
        alignments (if (#{:semiglobal :overlap} type)
                     (map #(pad-alignment %1 %2 s1 s2) raw-alns paths)
                     raw-alns)]
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
