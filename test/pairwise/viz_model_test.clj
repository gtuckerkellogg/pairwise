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
      (is (contains? types :cell-score))
      (is (contains? types :state-scores))
      (is (contains? types :state-arrow))
      ;; All cell-score instructions have numeric scores
      (is (every? number? (map :score (instructions-of-type model :cell-score)))))))

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
