(ns pairwise.core-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [pairwise.substitution :as sub]
            [pairwise.alignment :as alignment]
            [clojure.java.io]))

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

;; ---------------------------------------------------------------------------
;; Conservation line
;; ---------------------------------------------------------------------------

(def ^:private blosum50
  (sub/read-scoring-matrix (slurp (clojure.java.io/resource "data/BLOSUM50.txt"))))

(deftest match-line-symbols
  (testing "Identities are |"
    (is (= "|||" (alignment/match-line {:top "ACG" :bottom "ACG"} blosum50))))
  (testing "Gaps in either sequence are blank"
    (is (= " | " (alignment/match-line {:top "-C-" :bottom "ACG"} blosum50)))
    (is (= " | " (alignment/match-line {:top "ACG" :bottom "-C-"} blosum50))))
  (testing "A differing pair scoring below zero is ."
    ;; BLOSUM50 D/K is -1
    (is (neg? (get blosum50 [\D \K])))
    (is (= "." (alignment/match-line {:top "D" :bottom "K"} blosum50))))
  (testing "A differing pair scoring above zero is :"
    ;; BLOSUM50 K/R is +3, E/Q is +2
    (is (pos? (get blosum50 [\K \R])))
    (is (= "::" (alignment/match-line {:top "KE" :bottom "RQ"} blosum50))))
  (testing "A zero score counts as dissimilar — similarity needs a positive
            score, as in BLAST and EMBOSS, not merely an unpenalised one"
    (is (= "." (alignment/match-line {:top "A" :bottom "B"} {[\A \B] 0}))))
  (testing "and that holds for real zero-scoring BLOSUM50 pairs"
    ;; A/G, A/V, H/R and T/V are all exactly 0 in BLOSUM50
    (doseq [[a b] [[\A \G] [\A \V] [\H \R] [\T \V]]]
      (is (zero? (get blosum50 [a b])) (str a "/" b " should score 0"))
      (is (= "." (alignment/match-line {:top (str a) :bottom (str b)} blosum50))
          (str a "/" b " scores 0 and must not read as similar"))))
  (testing "A pair the matrix does not score counts as dissimilar"
    (is (= "." (alignment/match-line {:top "A" :bottom "B"} {}))))
  (testing "The matrix is consulted in either key order"
    (is (= ":" (alignment/match-line {:top "A" :bottom "B"} {[\B \A] 4})))))

(deftest match-line-is-attached-to-every-alignment
  (testing "Alignments carry :middle, one character per aligned column"
    (doseq [type [:global :local :semiglobal]
            :let [result (alignment/pairwise-align "HEAGAWGHEE" "PAWHEAE"
                                                   blosum50 8 :type type)]]
      (is (seq (:alignments result)))
      (doseq [aln (:alignments result)]
        (is (contains? aln :middle) (str type " alignment should carry :middle"))
        (is (= (count (:top aln)) (count (:middle aln)) (count (:bottom aln)))
            (str type " conservation line must line up with the residues"))
        (is (every? #{\| \: \. \space} (:middle aln)))))))

(deftest match-line-agrees-with-the-residues
  (testing "Every | is an identity and every non-blank non-| is a difference"
    (let [result (alignment/pairwise-align "KEWDAC" "RQWKAC" blosum50 8 :type :global)]
      (doseq [aln (:alignments result)
              [a m b] (map vector (:top aln) (:middle aln) (:bottom aln))]
        (cond
          (= m \|) (is (= a b))
          (= m \space) (is (or (= a \-) (= b \-)))
          :else (do (is (not= a b))
                    (is (not= a \-)) (is (not= b \-))))))))
