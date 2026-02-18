(ns pairwise.main-test
  (:require [clojure.test :refer :all]
            [clojure.tools.cli :refer [parse-opts]]
            [pairwise.main :refer [cli-options load-scoring-matrix format-alignment]]
            [pairwise.linear :as pairwise]
            [pairwise.substitution :as sub]))

;; --- CLI option parsing ---

(deftest default-type-is-keyword
  (testing "Default alignment type should be a keyword, not a string"
    (let [{:keys [options]} (parse-opts [] cli-options)]
      (is (keyword? (:type options)))
      (is (= :global (:type options))))))

(deftest parses-sequences
  (testing "Parses -1 and -2 flags into :s1 and :s2"
    (let [{:keys [options]} (parse-opts ["-1" "ACGT" "-2" "TGCA"] cli-options)]
      (is (= "ACGT" (:s1 options)))
      (is (= "TGCA" (:s2 options))))))

(deftest parses-alignment-type
  (testing "Explicit -t local is parsed as keyword :local"
    (let [{:keys [options]} (parse-opts ["-t" "local"] cli-options)]
      (is (= :local (:type options)))))
  (testing "Explicit -t global is parsed as keyword :global"
    (let [{:keys [options]} (parse-opts ["-t" "global"] cli-options)]
      (is (= :global (:type options))))))

(deftest rejects-invalid-type
  (testing "Invalid alignment type produces an error"
    (let [{:keys [errors]} (parse-opts ["-t" "bogus"] cli-options)]
      (is (seq errors)))))

(deftest accepts-semiglobal-type
  (testing "semiglobal is accepted as a valid alignment type"
    (let [{:keys [options errors]} (parse-opts ["-t" "semiglobal"] cli-options)]
      (is (nil? errors))
      (is (= :semiglobal (:type options))))))

(deftest accepts-overlap-type
  (testing "overlap is accepted as a valid alignment type"
    (let [{:keys [options errors]} (parse-opts ["-t" "overlap"] cli-options)]
      (is (nil? errors))
      (is (= :overlap (:type options))))))

(deftest parses-numeric-options
  (testing "Numeric options are parsed as numbers"
    (let [{:keys [options]} (parse-opts ["--match" "5" "--mismatch" "-3" "-g" "8"] cli-options)]
      (is (== 5 (:match options)))
      (is (== -3 (:mismatch options)))
      (is (== 8 (:gap-penalty options))))))

(deftest default-values
  (testing "Default values are correct"
    (let [{:keys [options]} (parse-opts [] cli-options)]
      (is (= "simple" (:matrix options)))
      (is (= 1 (:match options)))
      (is (= -2 (:mismatch options)))
      (is (= 2 (:gap-penalty options)))
      (is (= :global (:type options)))
      (is (= :protein (:seq-type options)))
      (is (nil? (:s1 options)))
      (is (nil? (:s2 options)))
      (is (nil? (:output options))))))

;; --- Sequence type parsing ---

(deftest parses-seq-type
  (testing "--seq-type dna is accepted"
    (let [{:keys [options errors]} (parse-opts ["--seq-type" "dna"] cli-options)]
      (is (nil? errors))
      (is (= :dna (:seq-type options)))))
  (testing "--seq-type protein is accepted"
    (let [{:keys [options errors]} (parse-opts ["--seq-type" "protein"] cli-options)]
      (is (nil? errors))
      (is (= :protein (:seq-type options)))))
  (testing "-s shorthand works"
    (let [{:keys [options errors]} (parse-opts ["-s" "dna"] cli-options)]
      (is (nil? errors))
      (is (= :dna (:seq-type options)))))
  (testing "Invalid seq-type is rejected"
    (let [{:keys [errors]} (parse-opts ["--seq-type" "bogus"] cli-options)]
      (is (seq errors)))))

;; --- Scoring matrix loading ---

(deftest loads-simple-matrix
  (testing "Simple protein matrix is created from match/mismatch scores"
    (let [m (load-scoring-matrix "simple" 5 -3 :protein)]
      (is (map? m))
      (is (= 5 (get m [\A \A])))
      (is (= -3 (get m [\A \R])))))
  (testing "Simple DNA matrix uses 4-letter alphabet"
    (let [m (load-scoring-matrix "simple" 2 -3 :dna)]
      (is (map? m))
      (is (= 2 (get m [\A \A])))
      (is (= -3 (get m [\A \C])))
      (is (nil? (get m [\A \R])) "DNA matrix should not contain amino acid keys"))))

(deftest loads-blosum50
  (testing "BLOSUM50 matrix loads from resources"
    (let [m (load-scoring-matrix "BLOSUM50" nil nil :protein)]
      (is (map? m))
      (is (number? (get m [\H \E]))))))

(deftest loads-blosum62
  (testing "BLOSUM62 matrix loads from resources"
    (let [m (load-scoring-matrix "BLOSUM62" nil nil :protein)]
      (is (map? m)))))

(deftest rejects-unknown-matrix
  (testing "Unknown matrix name throws an exception"
    (is (thrown? Exception (load-scoring-matrix "NONEXISTENT" nil nil :protein)))))

;; --- Format alignment ---

(deftest format-alignment-output
  (testing "format-alignment produces expected output for a known alignment"
    (let [S (sub/simple-substitution-matrix :protein :same 5 :different -5)
          result (pairwise/pairwise-align "SIMILAR" "SIMMARE" S 3 :type :global)
          output (format-alignment result)]
      (is (string? output))
      (is (re-find #"Alignment Score: 14" output))
      (is (re-find #"Number of optimal alignments: 2" output))
      (is (re-find #"Seq1:" output))
      (is (re-find #"Seq2:" output)))))

;; --- End-to-end: parsed options through to alignment ---

(deftest end-to-end-global-alignment
  (testing "Full pipeline from parsed CLI options to alignment result"
    (let [{:keys [options]} (parse-opts ["-1" "SIMILAR" "-2" "SIMMARE"
                                         "--match" "5" "--mismatch" "-5"
                                         "-g" "3"] cli-options)
          {:keys [s1 s2 matrix match mismatch gap-penalty type seq-type]} options
          s1-clean (sub/sanitise s1 seq-type)
          s2-clean (sub/sanitise s2 seq-type)
          scoring-matrix (load-scoring-matrix matrix match mismatch seq-type)
          result (pairwise/pairwise-align s1-clean s2-clean scoring-matrix gap-penalty :type type)]
      (is (== 14 (:score result)))
      (is (= 2 (count (:alignments result)))))))

(deftest end-to-end-local-alignment
  (testing "Local alignment through CLI pipeline"
    (let [{:keys [options]} (parse-opts ["-1" "SIMILAR" "-2" "SIMMARE"
                                         "--match" "5" "--mismatch" "-5"
                                         "-g" "3" "-t" "local"] cli-options)
          {:keys [s1 s2 matrix match mismatch gap-penalty type seq-type]} options
          s1-clean (sub/sanitise s1 seq-type)
          s2-clean (sub/sanitise s2 seq-type)
          scoring-matrix (load-scoring-matrix matrix match mismatch seq-type)
          result (pairwise/pairwise-align s1-clean s2-clean scoring-matrix gap-penalty :type type)]
      (is (pos? (:score result)))
      (is (pos? (count (:alignments result)))))))