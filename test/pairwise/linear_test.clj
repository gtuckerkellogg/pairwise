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
