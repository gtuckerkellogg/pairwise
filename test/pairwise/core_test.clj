(ns pairwise.core-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [pairwise.substitution :as sub]))

(def dna-matrix (sub/simple-substitution-matrix :dna :same 1 :different -1))

(deftest initialise-D-test
  (testing "Initialises a DP matrix with correct dimensions"
    (let [D (initialise-D "AC" "AGC")]
      (is (= 4 (count D))         "rows = length(s2) + 1")
      (is (= 3 (count (first D))) "cols = length(s1) + 1")
      (is (zero? (get-in D [0 0 :score])) "origin cell score is 0")
      (is (nil? (get-in D [1 0 :score])) "other cells start nil")
      (is (nil? (get-in D [0 1 :score])) "other cells start nil"))))

(deftest substitution-type-test
  (testing "Identifies match and mismatch"
    (is (= :match (substitution-type "AC" "AC" 1 1)))
    (is (= :mismatch (substitution-type "AC" "GT" 1 1))))
  (testing "Returns nil when either index is zero"
    (is (nil? (substitution-type "AC" "AC" 0 0)))
    (is (nil? (substitution-type "AC" "AC" 1 0)))
    (is (nil? (substitution-type "AC" "AC" 0 1)))))

(deftest build-dp-matrix-test
  (testing "Builds a complete DP matrix with scores in every cell"
    (let [D (build-dp-matrix dna-matrix 1 "AC" "AC" :type :global)]
      (is (= 3 (count D)))
      (is (= 3 (count (first D))))
      (is (every? number?
                  (for [r (range 3) c (range 3)]
                    (get-in D [r c :score])))))))

(deftest global-alignment-identical-sequences
  (testing "Identical sequences produce a perfect alignment"
    (let [S (sub/simple-substitution-matrix :dna :same 1 :different -1)
          result (pairwise-align "ACGT" "ACGT" S 2 :type :global)]
      (is (= 4 (:score result)) "score = 4 matches * 1")
      (is (= 1 (count (:alignments result))))
      (let [aln (first (:alignments result))]
        (is (= "ACGT" (:top aln)))
        (is (= "ACGT" (:bottom aln)))))))

(deftest local-alignment-finds-subsequence
  (testing "Local alignment finds the best matching region"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -5)
          result (pairwise-align "SIMILAR" "SIMMARE" S 3 :type :local)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))
