(ns pairwise.tikz-view-test
  (:require [clojure.test :refer :all]
            [pairwise.tikz-view :as tikz]
            [pairwise.linear :as pairwise]
            [pairwise.affine]
            [pairwise.alignment :as alignment]
            [pairwise.substitution :as sub]
            [clojure.string :as str]))

(def test-result
  (let [S (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))]
    (pairwise/pairwise-align "HEAGAWGHEE" "PAWHEAE" S 8 :type :global)))

(deftest tikz-alignment-produces-latex
  (testing "tikz-alignment returns a string containing LaTeX commands"
    (let [output (tikz/tikz-alignment test-result)]
      (is (string? output))
      (is (str/includes? output "\\begin{document}"))
      (is (str/includes? output "\\end{document}"))
      (is (str/includes? output "\\begin{tikzpicture}")))))

(deftest tikz-alignment-contains-sequences
  (testing "Output contains the input sequence letters"
    (let [output (tikz/tikz-alignment test-result)]
      (doseq [ch (seq "HEAGAWGHEE")]
        (is (str/includes? output (str ch))))
      (doseq [ch (seq "PAWHEAE")]
        (is (str/includes? output (str ch)))))))

(def affine-result
  (let [S (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))]
    (alignment/pairwise-align "ACG" "AG" S {:d 12 :e 2}
                              :type :global :gap-model :affine)))

(deftest tikz-affine-alignment-produces-latex
  (testing "Affine alignment generates valid LaTeX with state styles"
    (let [output (tikz/tikz-alignment affine-result)]
      (is (string? output))
      (is (str/includes? output "\\begin{document}"))
      (is (str/includes? output "\\begin{tikzpicture}"))
      ;; State-specific TikZ styles should be present in header
      (is (str/includes? output "state-M"))
      (is (str/includes? output "state-X"))
      (is (str/includes? output "state-Y")))))

(deftest tikz-affine-has-decomposition-overlays
  (testing "Affine TikZ output includes layer decomposition overlays in body"
    (let [output (tikz/tikz-alignment affine-result)
          ;; Header defines each -dim style once; body uses should add more
          count-occurrences (fn [s sub] (count (re-seq (re-pattern (java.util.regex.Pattern/quote sub)) s)))]
      ;; More than 1 occurrence means it's used in the body, not just the header definition
      (is (> (count-occurrences output "state-M-dim") 1))
      (is (> (count-occurrences output "state-X-dim") 1))
      (is (> (count-occurrences output "state-Y-dim") 1)))))

(deftest scale-tikz-test
  (testing "Scale returns a pgftransformscale LaTeX command"
    (let [scale (tikz/scale-tikz "HEAGAWGHEE" "PAWHEAE")]
      (is (string? scale))
      (is (str/includes? scale "\\pgftransformscale")))))
