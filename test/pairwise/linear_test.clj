(ns pairwise.linear-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [pairwise.substitution :as sub]))

(def blosum50 (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt")))

(deftest global-alignment-blosum50
  (testing "HEAGAWGHEE vs PAWHEAE with BLOSUM50 produces known result"
    (let [result (pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50 8 :type :global)]
      (is (= 1 (:score result)))
      (is (pos? (count (:alignments result))))
      (is (every? #(and (contains? % :top) (contains? % :bottom))
                  (:alignments result))))))

(deftest local-alignment-blosum50
  (testing "Local alignment returns positive score"
    (let [result (pairwise-align "HEAGAWGHEE" "PAWHEAE" blosum50 8 :type :local)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

(deftest alignment-result-structure
  (testing "pairwise-align returns all expected keys"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -3)
          result (pairwise-align "SIMILAR" "SIMMARE" S 3 :type :global)]
      (is (contains? result :score))
      (is (contains? result :alignments))
      (is (contains? result :dp-matrix))
      (is (contains? result :optimal-paths))
      (is (contains? result :sequence-1))
      (is (contains? result :sequence-2))
      (is (= "SIMILAR" (:sequence-1 result)))
      (is (= "SIMMARE" (:sequence-2 result))))))

(deftest path-to-alignment-test
  (testing "A simple path produces a valid alignment"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          result (pairwise-align "AC" "AC" S 1 :type :global)
          aln (first (:alignments result))]
      (is (= "AC" (:top aln)))
      (is (= "AC" (:bottom aln))))))

(deftest findpaths-returns-paths
  (testing "findpaths returns at least one path for a valid alignment"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          D (build-dp-matrix S 1 "AC" "AC" :type :global)
          paths (findpaths D :global)]
      (is (seq paths))
      (is (every? vector? paths)))))

;; ---------------------------------------------------------------------------
;; Semi-global alignment tests
;; ---------------------------------------------------------------------------

(deftest semiglobal-edge-cells-are-zero
  (testing "Semi-global: row 0 and col 0 are all zero (free leading gaps)"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -3)
          D (build-dp-matrix S 3 "HEAGAWGHEE" "AWG" :type :semiglobal)]
      ;; Row 0 should all be 0
      (doseq [c (range (inc (count "HEAGAWGHEE")))]
        (is (zero? (get-in D [0 c :score]))
            (str "Row 0, col " c " should be 0")))
      ;; Col 0 should all be 0
      (doseq [r (range (inc (count "AWG")))]
        (is (zero? (get-in D [r 0 :score]))
            (str "Row " r ", col 0 should be 0"))))))

(deftest semiglobal-fit-short-in-long
  (testing "Semi-global: fitting short sequence inside long gives positive score"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -3)
          result (pairwise-align "HEAGAWGHEE" "AWG" S 3 :type :semiglobal)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

(deftest semiglobal-alignment-shows-full-context
  (testing "Semi-global: alignment output is padded to show flanking gaps"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -3)
          result (pairwise-align "HEAGAWGHEE" "AWG" S 3 :type :semiglobal)
          aln (first (:alignments result))]
      ;; Top sequence should be fully shown, bottom padded with gaps
      (is (= (count (:top aln)) (count (:bottom aln)))
          "Aligned sequences should be the same length")
      ;; The alignment should be at least as long as the longer sequence
      (is (>= (count (:top aln)) (count "HEAGAWGHEE"))))))

(deftest semiglobal-traceback-starts-on-edge
  (testing "Semi-global: traceback starts on last row or last column"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -3)
          D (build-dp-matrix S 3 "HEAGAWGHEE" "AWG" :type :semiglobal)
          starting (get-starting D :semiglobal)
          nrows (count D)
          ncols (count (first D))
          last-row (dec nrows)
          last-col (dec ncols)]
      (is (every? (fn [[r c]] (or (= r last-row) (= c last-col))) starting)))))

;; ---------------------------------------------------------------------------
;; Overlap alignment tests
;; ---------------------------------------------------------------------------

(deftest overlap-row0-free-col0-penalised
  (testing "Overlap: row 0 is zero (s1 prefix free) but col 0 is penalised"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          D (build-dp-matrix S 2 "GATTACA" "TACAGAT" :type :overlap)]
      ;; Row 0 should all be 0
      (doseq [c (range (inc (count "GATTACA")))]
        (is (zero? (get-in D [0 c :score]))
            (str "Row 0, col " c " should be 0")))
      ;; Col 0 should be penalised (decreasing)
      (doseq [r (range 1 (inc (count "TACAGAT")))]
        (is (neg? (get-in D [r 0 :score]))
            (str "Row " r ", col 0 should be negative"))))))

(deftest overlap-finds-suffix-prefix
  (testing "Overlap: finds suffix of s1 matching prefix of s2"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          result (pairwise-align "GATTACA" "TACAGAT" S 2 :type :overlap)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))

(deftest overlap-alignment-shows-full-context
  (testing "Overlap: alignment output shows suffix/prefix with flanking gaps"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          result (pairwise-align "GATTACA" "TACAGAT" S 2 :type :overlap)
          aln (first (:alignments result))]
      (is (= (count (:top aln)) (count (:bottom aln)))
          "Aligned sequences should be the same length")
      ;; The alignment should be at least as long as the longer sequence
      (is (>= (count (:top aln)) (max (count "GATTACA") (count "TACAGAT")))))))

(deftest overlap-traceback-starts-on-last-col
  (testing "Overlap: traceback starts on last column only"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          D (build-dp-matrix S 2 "GATTACA" "TACAGAT" :type :overlap)
          starting (get-starting D :overlap)
          last-col (dec (count (first D)))]
      (is (every? (fn [[_r c]] (= c last-col)) starting)))))
