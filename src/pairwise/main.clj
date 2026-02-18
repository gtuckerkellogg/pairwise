(ns pairwise.main
  (:require [pairwise.alignment :as pairwise]
            [pairwise.linear]   ; registers :linear multimethod implementations
            [pairwise.affine]   ; registers :affine multimethod implementations
            [pairwise.substitution :as sub]
            [pairwise.tikz-view :as tikz]
            [clojure.walk :as w]
            [clojure.string :as str]
            [clojure.tools.cli :refer [parse-opts]]
            [clojure.java.io :as io])
  (:gen-class))

(def cli-options
  [["-1" "--s1 S1" "First sequence (required)"
    :id :s1]
   ["-2" "--s2 S2" "Second sequence (required)"
    :id :s2]
   ["-m" "--matrix MATRIX" "Scoring matrix: simple, BLOSUM62, BLOSUM50, PAM120, PAM250, PAM40"
    :default "simple"
    :id :matrix]
   [nil "--match SCORE" "Match score for simple matrix"
    :default 1
    :parse-fn #(Double/parseDouble %)
    :id :match]
   [nil "--mismatch SCORE" "Mismatch score for simple matrix"
    :default -2
    :parse-fn #(Double/parseDouble %)
    :id :mismatch]
   ["-g" "--gap-penalty PENALTY" "Gap penalty (linear model)"
    :default 2
    :parse-fn #(Double/parseDouble %)
    :id :gap-penalty]
   [nil "--gap-model MODEL" "Gap model: linear or affine"
    :default :linear
    :parse-fn keyword
    :validate [#(contains? #{:linear :affine} %) "Must be 'linear' or 'affine'"]
    :id :gap-model]
   [nil "--gap-open PENALTY" "Gap opening penalty (affine model)"
    :default 10
    :parse-fn #(Double/parseDouble %)
    :id :gap-open]
   [nil "--gap-extend PENALTY" "Gap extension penalty (affine model)"
    :default 1
    :parse-fn #(Double/parseDouble %)
    :id :gap-extend]
   ["-t" "--type TYPE" "Alignment type: global, local, semiglobal, or overlap"
    :default :global
    :parse-fn keyword
    :validate [#(contains? #{:global :local :semiglobal :overlap} %) "Must be 'global', 'local', 'semiglobal', or 'overlap'"]
    :id :type]
   ["-s" "--seq-type TYPE" "Sequence type: protein or dna"
    :default :protein
    :parse-fn keyword
    :validate [#(contains? #{:protein :dna} %) "Must be 'protein' or 'dna'"]
    :id :seq-type]
   ["-o" "--output FILE" "Output TikZ/LaTeX to FILE (default: print text alignment)"
    :id :output]
   ["-h" "--help" "Show this help message"]])

(defn load-scoring-matrix
  "Load a scoring matrix by name or create a simple one.
   seq-type (:protein or :dna) determines the alphabet for simple matrices."
  [matrix-name match mismatch seq-type]
  (if (= matrix-name "simple")
    (sub/simple-substitution-matrix seq-type :same match :different mismatch)
    (let [resource-path (str "data/" matrix-name ".txt")
          resource (io/resource resource-path)]
      (if resource
        (sub/read-scoring-matrix (slurp resource))
        (throw (Exception. (str "Unknown scoring matrix: " matrix-name)))))))

(defn format-alignment
  "Format alignment results for display"
  [result]
  (let [{:keys [score alignments sequence-1 sequence-2]} result]
    (str "Alignment Score: " score "\n\n"
         "Number of optimal alignments: " (count alignments) "\n\n"
         (str/join "\n\n"
                   (map-indexed
                    (fn [idx aln]
                      (str "Alignment " (inc idx) ":\n"
                           "Seq1: " (:top aln) "\n"
                           "Seq2: " (:bottom aln)))
                    alignments)))))

(defn -main [& args]
  (let [{:keys [options arguments errors summary]} (parse-opts args cli-options)]
    (cond
      (:help options)
      (do
        (println "Pairwise Sequence Alignment Tool")
        (println)
        (println summary)
        (println)
        (println "Examples:")
        (println "  # Global alignment with simple matrix")
        (println "  pairwise -1 HEAGAWGHEE -2 PAWHEAE")
        (println)
        (println "  # Local alignment with BLOSUM62")
        (println "  pairwise -1 HEAGAWGHEE -2 PAWHEAE -t local -m BLOSUM62")
        (println)
        (println "  # Affine gap alignment with BLOSUM50")
        (println "  pairwise -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 --gap-model affine --gap-open 12 --gap-extend 2")
        (println)
        (println "  # DNA overlap alignment")
        (println "  pairwise -1 GATTACA -2 TACAGAT -s dna -t overlap --match 2 --mismatch -3 -g 3")
        (println)
        (println "  # Generate TikZ/LaTeX visualization")
        (println "  pairwise -1 ACGT -2 ACGT -o alignment.tex")
        (System/exit 0))

      errors
      (do
        (doseq [error errors]
          (println "Error:" error))
        (System/exit 1))

      (or (nil? (:s1 options)) (nil? (:s2 options)))
      (do
        (println "Error: Both sequences are required (use -1 and -2)")
        (println)
        (println summary)
        (System/exit 1))

      :else
      (try
        (let [{:keys [s1 s2 matrix match mismatch gap-penalty gap-model gap-open gap-extend type seq-type output]} options
              s1-clean (sub/sanitise s1 seq-type)
              s2-clean (sub/sanitise s2 seq-type)
              scoring-matrix (load-scoring-matrix matrix match mismatch seq-type)
              gap-pen (if (= gap-model :affine)
                        {:d gap-open :e gap-extend}
                        gap-penalty)
              result (pairwise/pairwise-align s1-clean s2-clean scoring-matrix gap-pen
                       :type type :gap-model gap-model)]

          (if output
            ;; TikZ output mode
            (do
              (let [tikz-content (tikz/tikz-alignment result)]
                (spit output tikz-content)
                (println "TikZ/LaTeX output written to:" output)
                (println)
                (println "To compile the LaTeX file:")
                (println "  pdflatex" output)
                (println "  # or")
                (println "  xelatex" output))
              (System/exit 0))

            ;; Text output mode (default)
            (do
              (println "Input sequences:")
              (println "  Seq1:" s1-clean)
              (println "  Seq2:" s2-clean)
              (println)
              (println "Parameters:")
              (println "  Matrix:" matrix)
              (when (= matrix "simple")
                (println "  Match:" match)
                (println "  Mismatch:" mismatch))
              (println "  Gap model:" (name gap-model))
              (if (= gap-model :affine)
                (do (println "  Gap open:" gap-open)
                    (println "  Gap extend:" gap-extend))
                (println "  Gap penalty:" gap-penalty))
              (println "  Sequence type:" (name seq-type))
              (println "  Alignment type:" (name type))
              (println)
              (println (format-alignment result))
              (System/exit 0))))
        (catch Exception e
          (println "Error:" (.getMessage e))
          (.printStackTrace e)
          (System/exit 1))))))
