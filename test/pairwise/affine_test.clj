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

(deftest altschul-erickson-counterexample
  (testing "Finds the optimal alignment that Gotoh's original algorithm misses
           (Altschul & Erickson 1986, Fig. 7: AAAGGG vs TTAAAAGGGGTT, w_k = 5+k)"
    (let [S      (sub/simple-substitution-matrix :dna :same 0 :different -1)
          result (alignment/pairwise-align "AAAGGG" "TTAAAAGGGGTT" S {:d 6 :e 1}
                   :type :global :gap-model :affine)
          aln    (first (:alignments result))]
      ;; Cost 15 in the paper's minimization = score -15 in our maximization
      (is (== -15 (:score result)))
      ;; Exactly one optimal alignment
      (is (= 1 (count (:alignments result))))
      ;; The alignment has a single contiguous gap
      (is (= "AAA------GGG" (:top aln)))
      (is (= "TTAAAAGGGGTT" (:bottom aln))))))

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

(deftest local-affine-includes-first-match
  (testing "Local affine traceback includes residues at the free-restart cell (A/A)"
    (let [result (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50
                   {:d 12 :e 2}
                   :type :local :gap-model :affine)
          aln (first (:alignments result))]
      (is (= "AWGHE" (:top aln)))
      (is (= "AW-HE" (:bottom aln))))))

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

;; ---------------------------------------------------------------------------
;; Semi-global alignment tests (affine)
;; ---------------------------------------------------------------------------

(deftest semiglobal-affine-edge-cells-are-zero
  (testing "Semi-global affine: row 0 and col 0 display scores are all zero"
    (let [D (alignment/build-dp-matrix :affine simple-matrix {:d 8 :e 2}
              "HEAGAWGHEE" "AWG" :type :semiglobal)]
      ;; Row 0 should all be 0 (or nil at origin, which has vm=0)
      (doseq [c (range (inc (count "HEAGAWGHEE")))]
        (let [cell (get-in D [0 c])]
          (is (or (zero? (or (:score cell) 0))
                  (and (zero? c) (zero? (:vm cell))))
              (str "Row 0, col " c " should be 0"))))
      ;; Col 0 should all be 0
      (doseq [r (range (inc (count "AWG")))]
        (let [cell (get-in D [r 0])]
          (is (or (zero? (or (:score cell) 0))
                  (and (zero? r) (zero? (:vm cell))))
              (str "Row " r ", col 0 should be 0")))))))

(deftest semiglobal-affine-fit-short-in-long
  (testing "Semi-global affine: fitting short sequence inside long gives positive score"
    (let [result (alignment/pairwise-align "HEAGAWGHEE" "AWG" simple-matrix
                   {:d 8 :e 2}
                   :type :semiglobal :gap-model :affine)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

;; ---------------------------------------------------------------------------
;; Overlap alignment tests (affine)
;; ---------------------------------------------------------------------------

(deftest overlap-affine-row0-free
  (testing "Overlap affine: row 0 has vy scores of 0 (free leading horizontal gaps)"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          D (alignment/build-dp-matrix :affine S {:d 5 :e 1}
              "GATTACA" "TACAGAT" :type :overlap)]
      ;; Row 0: vy should be 0 for all cols > 0 (free leading gaps in s1)
      (doseq [c (range 1 (inc (count "GATTACA")))]
        (is (zero? (get-in D [0 c :vy]))
            (str "Row 0, col " c " vy should be 0"))))))

(deftest overlap-affine-col0-penalised
  (testing "Overlap affine: col 0 has no free vx (s2 start penalised)"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          D (alignment/build-dp-matrix :affine S {:d 5 :e 1}
              "GATTACA" "TACAGAT" :type :overlap)]
      ;; Col 0: vx should be nil or negative for rows > 0 (no free vertical gaps)
      ;; Actually vx on col 0 should be nil because there's no free edge for overlap there
      (doseq [r (range 1 (inc (count "TACAGAT")))]
        (let [vx (get-in D [r 0 :vx])]
          (is (or (nil? vx) (neg? vx))
              (str "Row " r ", col 0 vx should not be zero/positive")))))))

(deftest overlap-affine-finds-suffix-prefix
  (testing "Overlap affine: finds suffix of s1 matching prefix of s2"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          result (alignment/pairwise-align "GATTACA" "TACAGAT" S {:d 5 :e 1}
                   :type :overlap :gap-model :affine)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))
