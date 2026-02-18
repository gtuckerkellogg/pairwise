(ns pairwise.substitution-test
  (:require [clojure.test :refer :all]
            [clojure.java.io :as io]
            [pairwise.substitution :refer :all]))

(deftest simple-substitution-matrix-test
  (testing "DNA matrix has correct match/mismatch scores"
    (let [m (simple-substitution-matrix :dna :same 1 :different -1)]
      (is (= 1 (get m [\A \A])))
      (is (= 1 (get m [\C \C])))
      (is (= -1 (get m [\A \C])))
      (is (= -1 (get m [\G \T])))))
  (testing "Protein matrix covers all standard amino acids"
    (let [m (simple-substitution-matrix :protein :same 5 :different -3)]
      (is (= 5 (get m [\A \A])))
      (is (= -3 (get m [\A \R])))
      (is (map? m)))))

(deftest read-scoring-matrix-test
  (testing "Reads BLOSUM50 from file"
    (let [m (read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))]
      (is (map? m))
      (is (number? (get m [\A \A])))
      (is (number? (get m [\H \E])))))
  (testing "Reads BLOSUM62 from file"
    (let [m (read-scoring-matrix (slurp "resources/data/BLOSUM62.txt"))]
      (is (map? m))))
  (testing "Reads PAM matrices"
    (doseq [name ["PAM40" "PAM120" "PAM250"]]
      (let [m (read-scoring-matrix (slurp (str "resources/data/" name ".txt")))]
        (is (map? m) (str name " should load as a map"))))))

(deftest sanitise-test
  (testing "Valid protein sequence passes through unchanged"
    (is (= "HEAGAWGHEE" (sanitise "HEAGAWGHEE"))))
  (testing "Lowercase is uppercased"
    (is (= "ACGT" (sanitise "acgt"))))
  (testing "Invalid characters are replaced with X"
    (is (= "ACXGT" (sanitise "AC1GT")))
    (is (= "ACXGT" (sanitise "AC GT"))))
  (testing "Empty string"
    (is (= "" (sanitise ""))))
  (testing "DNA sanitise strips non-ACGT characters"
    (is (= "ACGT" (sanitise "ACGT" :dna)))
    (is (= "ACGT" (sanitise "acgt" :dna)))
    (is (= "ACGT" (sanitise "ANCHGT" :dna)))
    (is (= "GATTACA" (sanitise "GAT TACA!" :dna)))
    (is (= "" (sanitise "XYZ" :dna))))
  (testing "Explicit :protein behaves like 1-arity default"
    (is (= "ACXGT" (sanitise "AC1GT" :protein)))
    (is (= "HEAGAWGHEE" (sanitise "HEAGAWGHEE" :protein)))))
