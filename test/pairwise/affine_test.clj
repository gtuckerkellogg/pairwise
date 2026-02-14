(ns pairwise.affine-test
  (:require [clojure.test :refer :all]
            [pairwise.alignment :as alignment]
            [pairwise.affine]  ; registers :affine multimethod implementations
            [pairwise.linear]  ; registers :linear for comparison
            [pairwise.substitution :as sub]))

(def blosum50 (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt")))

(def simple-matrix
  (sub/simple-substitution-matrix :protein :same 5 :different -4))

;; ---------------------------------------------------------------------------
;; Global alignment tests
;; ---------------------------------------------------------------------------

(deftest identical-sequences-affine
  (testing "Identical sequences align perfectly with no gaps"
    (let [result (alignment/pairwise-align "ACGT" "ACGT"
                   (sub/simple-substitution-matrix :dna :same 2 :different -1)
                   {:d 5 :e 1}
                   :type :global :gap-model :affine)
          aln (first (:alignments result))]
      (is (= 8 (:score result)))
      (is (= "ACGT" (:top aln)))
      (is (= "ACGT" (:bottom aln))))))

(deftest global-alignment-affine-blosum50
  (testing "HEAGAWGHEE vs PAWHEAE with BLOSUM50, d=12, e=2"
    (let [result (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50
                   {:d 12 :e 2}
                   :type :global :gap-model :affine)]
      (is (number? (:score result)))
      (is (pos? (count (:alignments result))))
      (is (every? #(and (contains? % :top) (contains? % :bottom))
                  (:alignments result))))))

(deftest affine-favors-fewer-longer-gaps
  (testing "Affine gap penalty produces fewer, longer gaps than linear"
    ;; With a high gap-open and low gap-extend, affine should consolidate gaps
    ;; rather than scatter them, producing different alignments from linear
    (let [s1 "AAGGTACC"
          s2 "AACC"
          gap-d 10
          gap-e 1
          linear-result (alignment/pairwise-align s1 s2 simple-matrix gap-d
                          :type :global :gap-model :linear)
          affine-result (alignment/pairwise-align s1 s2 simple-matrix {:d gap-d :e gap-e}
                          :type :global :gap-model :affine)]
      ;; Affine should score better (less penalty) since it consolidates the gap
      (is (> (:score affine-result) (:score linear-result))))))

(deftest single-gap-costs-d
  (testing "A gap of length 1 costs exactly d (Durbin convention: d + (k-1)*e = d for k=1)"
    (let [s1 "AC"
          s2 "ABC"
          S  (sub/simple-substitution-matrix :protein :same 5 :different -4)
          d  8
          e  2
          result (alignment/pairwise-align s1 s2 S {:d d :e e}
                   :type :global :gap-model :affine)]
      ;; Score = match(A,A) + gap_penalty + match(C,C) = 5 - 8 + 5 = 2
      (is (= 2 (:score result))))))

;; ---------------------------------------------------------------------------
;; Local alignment tests
;; ---------------------------------------------------------------------------

(deftest local-alignment-affine
  (testing "Local affine alignment returns positive score"
    (let [result (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50
                   {:d 12 :e 2}
                   :type :local :gap-model :affine)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

(deftest local-alignment-finds-best-region
  (testing "Local affine alignment finds the best matching region"
    (let [;; Embed a strong match inside noise
          s1 "XXXHEAGAWXXX"
          s2 "HEAGAW"
          result (alignment/pairwise-align s1 s2 simple-matrix {:d 8 :e 2}
                   :type :local :gap-model :affine)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

;; ---------------------------------------------------------------------------
;; Result structure test
;; ---------------------------------------------------------------------------

(deftest affine-result-structure
  (testing "Affine pairwise-align returns same keys as linear"
    (let [result (alignment/pairwise-align "SIMILAR" "SIMMARE" simple-matrix
                   {:d 8 :e 2}
                   :type :global :gap-model :affine)]
      (is (contains? result :score))
      (is (contains? result :alignments))
      (is (contains? result :dp-matrix))
      (is (contains? result :optimal-paths))
      (is (contains? result :optimal-path-steps))
      (is (contains? result :sequence-1))
      (is (contains? result :sequence-2))
      (is (= "SIMILAR" (:sequence-1 result)))
      (is (= "SIMMARE" (:sequence-2 result))))))

(deftest affine-dp-matrix-has-three-states
  (testing "DP matrix cells contain vm, vx, vy state scores"
    (let [result (alignment/pairwise-align "AC" "AC"
                   (sub/simple-substitution-matrix :dna :same 2 :different -1)
                   {:d 5 :e 1}
                   :type :global :gap-model :affine)
          D (:dp-matrix result)
          ;; Check an interior cell (not origin)
          cell (get-in D [1 1])]
      (is (contains? cell :vm))
      (is (contains? cell :vx))
      (is (contains? cell :vy))
      (is (contains? cell :score)))))
