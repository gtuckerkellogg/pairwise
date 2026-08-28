(ns pairwise.viz-model-test
  (:require [clojure.test :refer :all]
            [pairwise.viz-model :as viz]
            [pairwise.alignment :as alignment]
            [pairwise.linear]
            [pairwise.affine]
            [pairwise.substitution :as sub]))

(def blosum50 (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt")))

(def ac-result
  (alignment/pairwise-align "AC" "AC" blosum50 8 :type :global))

(def heagawghee-result
  (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50 8 :type :global))

(def affine-result
  (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50 {:d 12 :e 2}
                            :type :global :gap-model :affine))

(defn instructions-of-type [model type]
  (filter #(= type (:type %)) (:instructions model)))

;; ---------------------------------------------------------------------------
;; Instruction types present
;; ---------------------------------------------------------------------------

(deftest all-instruction-types-present
  (testing "A simple alignment produces all expected instruction types"
    (let [model (viz/alignment->instructions ac-result)
          types (set (map :type (:instructions model)))]
      (is (contains? types :grid))
      (is (contains? types :seq-label))
      (is (contains? types :cell-score))
      (is (contains? types :dp-arrow))
      (is (contains? types :path-arrow)))))

;; ---------------------------------------------------------------------------
;; Correct counts
;; ---------------------------------------------------------------------------

(deftest correct-instruction-counts
  (testing "AC vs AC produces expected counts"
    (let [model (viz/alignment->instructions ac-result)]
      ;; 3x3 matrix = 9 cell scores
      (is (= 9 (count (instructions-of-type model :cell-score))))
      ;; 2 top labels + 2 left labels = 4
      (is (= 4 (count (instructions-of-type model :seq-label))))
      ;; Exactly 1 grid instruction
      (is (= 1 (count (instructions-of-type model :grid)))))))

;; ---------------------------------------------------------------------------
;; Score values
;; ---------------------------------------------------------------------------

(deftest score-values-match-dp-matrix
  (testing "Cell scores match the DP matrix values"
    (let [model (viz/alignment->instructions ac-result)
          scores (instructions-of-type model :cell-score)
          score-map (into {} (map (fn [inst] [[(:row inst) (:col inst)] (:score inst)]) scores))
          D (:dp-matrix ac-result)]
      (doseq [r (range 3) c (range 3)]
        (is (= (get-in D [r c :score]) (score-map [r c]))
            (str "Score mismatch at [" r "," c "]"))))))

;; ---------------------------------------------------------------------------
;; Dimensions
;; ---------------------------------------------------------------------------

(deftest dimensions-correct
  (testing "Dimensions reflect the DP matrix size"
    (let [model (viz/alignment->instructions ac-result)]
      (is (= {:rows 3 :cols 3} (:dimensions model))))))

;; ---------------------------------------------------------------------------
;; Sequences
;; ---------------------------------------------------------------------------

(deftest sequences-recorded
  (testing "Sequences are stored in the model"
    (let [model (viz/alignment->instructions ac-result)]
      (is (= {:top "AC" :left "AC"} (:sequences model))))))

;; ---------------------------------------------------------------------------
;; Seq labels
;; ---------------------------------------------------------------------------

(deftest seq-labels-correct
  (testing "Sequence labels have correct chars and indices"
    (let [model (viz/alignment->instructions ac-result)
          labels (instructions-of-type model :seq-label)
          top-labels (filter #(= :top (:axis %)) labels)
          left-labels (filter #(= :left (:axis %)) labels)]
      (is (= [\A \C] (map :char top-labels)))
      (is (= [0 1] (map :index top-labels)))
      (is (= [\A \C] (map :char left-labels)))
      (is (= [0 1] (map :index left-labels))))))

;; ---------------------------------------------------------------------------
;; Path arrows
;; ---------------------------------------------------------------------------

(deftest path-arrows-trace-optimal-path
  (testing "Path arrows follow the optimal path with correct directions"
    (let [model (viz/alignment->instructions ac-result)
          path-arrows (instructions-of-type model :path-arrow)]
      ;; AC vs AC: optimal path is [2,2] -> [1,1] -> [0,0], so 2 path arrows
      (is (= 2 (count path-arrows)))
      ;; Both should be diagonal (match)
      (is (every? #(= :diag (:direction %)) path-arrows)))))

;; ---------------------------------------------------------------------------
;; Step ordering
;; ---------------------------------------------------------------------------

(deftest step-numbers-are-unique-and-positive
  (testing "Cell score step numbers are unique, positive, and cover expected range"
    (let [model (viz/alignment->instructions ac-result)
          steps (map :step (instructions-of-type model :cell-score))]
      ;; All steps are positive
      (is (every? pos? steps))
      ;; All steps are unique
      (is (= (count steps) (count (set steps))))
      ;; Steps cover 1..N where N = rows * cols
      (is (= (set (range 1 10)) (set steps))))))

;; ---------------------------------------------------------------------------
;; DP arrows
;; ---------------------------------------------------------------------------

(deftest dp-arrows-present-for-non-origin-cells
  (testing "DP arrows exist for cells with valid :from entries"
    (let [model (viz/alignment->instructions ac-result)
          arrows (instructions-of-type model :dp-arrow)]
      ;; Origin cell [0,0] has no arrows; 8 other cells should have at least one each
      (is (pos? (count arrows)))
      ;; Each arrow should have valid direction
      (is (every? #{:diag :horiz :vert} (map :direction arrows))))))

;; ---------------------------------------------------------------------------
;; Affine state-scores
;; ---------------------------------------------------------------------------

(def small-affine-result
  (alignment/pairwise-align "ACG" "AG" blosum50 {:d 12 :e 2}
                            :type :global :gap-model :affine))

(deftest affine-produces-state-scores
  (testing "Affine alignment produces :state-scores instructions"
    (let [model (viz/alignment->instructions small-affine-result)
          state-scores (instructions-of-type model :state-scores)]
      ;; 3x4 matrix = 12 cells; origin has vm=0, others may have nil :score
      ;; but all cells with a non-nil :score should get a :state-scores instruction
      (is (pos? (count state-scores)))
      ;; Each state-scores has :vm, :vx, :vy keys (values may be nil)
      (is (every? #(and (contains? % :vm) (contains? % :vx) (contains? % :vy)) state-scores))
      ;; Check a specific cell: [1,1] should have vm=5, vx=nil, vy=nil
      (let [cell-1-1 (first (filter #(and (= 1 (:row %)) (= 1 (:col %))) state-scores))]
        (is (= 5 (:vm cell-1-1)))
        (is (nil? (:vx cell-1-1)))
        (is (nil? (:vy cell-1-1)))))))

(deftest linear-produces-no-state-scores
  (testing "Linear alignment does NOT produce :state-scores instructions"
    (let [model (viz/alignment->instructions ac-result)]
      (is (empty? (instructions-of-type model :state-scores))))))

;; ---------------------------------------------------------------------------
;; Affine state-arrows
;; ---------------------------------------------------------------------------

(deftest affine-produces-state-arrows
  (testing "Affine alignment produces :state-arrow instructions"
    (let [model (viz/alignment->instructions small-affine-result)
          state-arrows (instructions-of-type model :state-arrow)]
      (is (pos? (count state-arrows)))
      ;; Each state-arrow has :from-state and :to-state
      (is (every? #(and (contains? % :from-state) (contains? % :to-state)) state-arrows))
      ;; States are :M, :X, or :Y
      (is (every? #(#{:M :X :Y} (:from-state %)) state-arrows))
      (is (every? #(#{:M :X :Y} (:to-state %)) state-arrows))
      ;; Each has :arrow-type (:dp or :optimal)
      (is (every? #(#{:dp :optimal} (:arrow-type %)) state-arrows))
      ;; Directions are valid
      (is (every? #(#{:diag :horiz :vert} (:direction %)) state-arrows)))))

(deftest linear-produces-no-state-arrows
  (testing "Linear alignment does NOT produce :state-arrow instructions"
    (let [model (viz/alignment->instructions ac-result)]
      (is (empty? (instructions-of-type model :state-arrow))))))

;; ---------------------------------------------------------------------------
;; Affine compatibility
;; ---------------------------------------------------------------------------

(deftest affine-alignment-produces-valid-instructions
  (testing "Affine alignment results also produce valid IR"
    (let [model (viz/alignment->instructions affine-result)
          types (set (map :type (:instructions model)))]
      (is (contains? types :grid))
      (is (contains? types :state-scores))
      (is (contains? types :state-arrow))
      ;; Affine mode uses :state-scores instead of :cell-score
      (is (not (contains? types :cell-score))))))

;; ---------------------------------------------------------------------------
;; Larger alignment
;; ---------------------------------------------------------------------------

(deftest larger-alignment-produces-consistent-ir
  (testing "HEAGAWGHEE vs PAWHEAE alignment produces expected dimensions"
    (let [model (viz/alignment->instructions heagawghee-result)]
      ;; s1=HEAGAWGHEE (10 chars), s2=PAWHEAE (7 chars)
      ;; DP matrix: (7+1) rows x (10+1) cols = 8x11
      (is (= {:rows 8 :cols 11} (:dimensions model)))
      (is (= 88 (count (instructions-of-type model :cell-score)))))))

;; ---------------------------------------------------------------------------
;; Substitution type is a property of diagonal steps only
;; ---------------------------------------------------------------------------

(deftest substitution-type-only-on-diagonal-path-arrows
  (testing "Gap path arrows carry no :substitution-type"
    ;; HEAGAWGHEE vs PAWHEAE needs gaps, so the optimal path mixes directions.
    (let [model (viz/alignment->instructions heagawghee-result)
          path-arrows (instructions-of-type model :path-arrow)
          gaps (remove #(= :diag (:direction %)) path-arrows)]
      (is (seq gaps) "fixture should exercise gap moves")
      (is (every? #(nil? (:substitution-type %)) gaps)
          "a vertical or horizontal move aligns no residue pair")))
  (testing "Diagonal path arrows are classified as match or mismatch"
    (let [model (viz/alignment->instructions heagawghee-result)
          diags (filter #(= :diag (:direction %))
                        (instructions-of-type model :path-arrow))]
      (is (seq diags))
      (is (every? #(#{:match :mismatch} (:substitution-type %)) diags)))))

(deftest state-arrows-carry-substitution-type-only-for-m
  (testing "Only V'M optimal state arrows describe a residue pair"
    (let [model (viz/alignment->instructions affine-result)
          optimal (filter #(= :optimal (:arrow-type %))
                          (instructions-of-type model :state-arrow))
          {m :M} (group-by :from-state optimal)
          gap-states (remove #(= :M (:from-state %)) optimal)]
      (is (seq m))
      (is (every? #(#{:match :mismatch} (:substitution-type %)) m))
      (is (every? #(nil? (:substitution-type %)) gap-states)))))

(deftest direction-matches-from-state-in-affine
  (testing "Each affine state moves in exactly one grid direction"
    (let [model (viz/alignment->instructions affine-result)
          expected {:M :diag :X :vert :Y :horiz}]
      (doseq [{:keys [from-state direction]} (instructions-of-type model :state-arrow)]
        (is (= (expected from-state) direction)
            (str "state " from-state " should always move " (expected from-state)))))))

;; ---------------------------------------------------------------------------
;; :last-overlay truncation
;; ---------------------------------------------------------------------------

(defn- max-step-of [model]
  (reduce max 0 (keep :step (:instructions model))))

(deftest last-overlay-nil-changes-nothing
  (testing "Omitting the option leaves the model untouched"
    (doseq [result [heagawghee-result affine-result]]
      (is (= (viz/alignment->instructions result)
             (viz/alignment->instructions result {})
             (viz/alignment->instructions result {:last-overlay nil}))))))

(deftest last-overlay-caps-the-slides-not-the-content
  (testing "Nothing reaches a slide after the requested step"
    (doseq [result [heagawghee-result affine-result]
            n [1 5 12]]
      (let [insts (:instructions (viz/alignment->instructions result {:last-overlay n}))]
        (is (<= (reduce max 0 (keep :step (remove :past-cap insts))) n)))))
  (testing "but content past the cap is kept and marked, not discarded — the
            cap limits the presentation, not what a handout may print"
    (let [full (viz/alignment->instructions heagawghee-result)
          cut  (viz/alignment->instructions heagawghee-result {:last-overlay 12})]
      (is (= (count (filter :step (:instructions full)))
             (count (filter :step (:instructions cut)))))
      (is (seq (filter :past-cap (:instructions cut)))))))

(deftest last-overlay-yields-a-prefix
  (testing "The instructions that do reach a slide are exactly those the full
            model reveals by that step — step numbers are not reassigned"
    (doseq [result [heagawghee-result affine-result]
            n [3 12 40]]
      (let [full (:instructions (viz/alignment->instructions result))
            cut  (:instructions (viz/alignment->instructions result {:last-overlay n}))
            on-slides (remove :past-cap cut)
            keep-full (filter #(let [s (:step %)] (or (nil? s) (<= s n))) full)]
        ;; :decomposition-phase carries :start-step and is checked separately.
        (is (= (remove :start-step keep-full)
               (remove :start-step on-slides)))))))

(deftest last-overlay-keeps-unstepped-instructions
  (testing "Grid and sequence labels are always drawn, whatever the cap"
    (let [model (viz/alignment->instructions heagawghee-result {:last-overlay 1})
          types (set (map :type (:instructions model)))]
      (is (contains? types :grid))
      (is (contains? types :seq-label)))))

(deftest last-overlay-trims-the-decomposition-phase
  (testing "Decomposition states are dropped one slide at a time"
    (let [full (viz/alignment->instructions affine-result)
          decomp (first (filter #(= :decomposition-phase (:type %))
                                (:instructions full)))
          start (:start-step decomp)
          states-at (fn [n]
                      (-> (viz/alignment->instructions affine-result {:last-overlay n})
                          (:instructions)
                          (->> (filter #(= :decomposition-phase (:type %))))
                          first
                          :states))]
      (is (= [:M :X :Y] (:states decomp)))
      (is (nil? (states-at (dec start))) "phase gone entirely before it starts")
      (is (= [:M] (states-at start)))
      (is (= [:M :X] (states-at (inc start))))
      (is (= [:M :X :Y] (states-at (+ start 2)))))))

(deftest last-overlay-clamps-progressive-window
  (testing "The progressive fill stops being drawn within the deck that exists,
            so Beamer does not pad it with empty overlays"
    (let [full (viz/alignment->instructions affine-result)]
      (doseq [n [4 20]]
        (is (= n (:max-progressive-step
                  (viz/alignment->instructions affine-result {:last-overlay n})))))
      (is (= (:max-progressive-step full)
             (:max-progressive-step
              (viz/alignment->instructions affine-result {:last-overlay 10000})))))))

(deftest overflow-collapse-keeps-everything-on-one-extra-slide
  (testing "Steps past the cap move to n+1 instead of being discarded"
    (let [n 12
          full (viz/alignment->instructions heagawghee-result)
          coll (viz/alignment->instructions heagawghee-result
                                            {:last-overlay n :overflow :collapse})
          stepped (fn [m] (filter :step (:instructions m)))]
      ;; Nothing is lost — only re-timed.
      (is (= (count (stepped full)) (count (stepped coll))))
      (is (= (inc n) (reduce max 0 (keep :step (:instructions coll)))))
      (testing "the opening n slides are untouched"
        (is (= (filter #(<= (:step %) n) (stepped full))
               (filter #(<= (:step %) n) (stepped coll)))))
      (testing "and everything later lands on exactly one slide"
        (is (= (set [(inc n)])
               (set (map :step (filter #(> (:step %) n) (stepped coll))))))))))

(deftest overflow-drop-is-the-default
  (testing "Unspecified overflow discards rather than collapses"
    (is (= (viz/alignment->instructions heagawghee-result {:last-overlay 5})
           (viz/alignment->instructions heagawghee-result
                                        {:last-overlay 5 :overflow :drop})))))

(deftest collapse-extends-the-progressive-window
  (testing "The jump slide is inside the window, or its content would vanish"
    (let [n 6
          m (viz/alignment->instructions affine-result
                                         {:last-overlay n :overflow :collapse})]
      (is (= (inc n) (:max-progressive-step m))))))
