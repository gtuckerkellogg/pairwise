(ns pairwise.tikz-view-test
  (:require [clojure.test :refer :all]
            [pairwise.tikz-view :as tikz]
            [pairwise.linear :as pairwise]
            [pairwise.affine]
            [pairwise.alignment :as alignment]
            [pairwise.substitution :as sub]
            [clojure.string :as str]
            [clojure.set :as set]))

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
      (is (str/includes? output "text-M"))
      (is (str/includes? output "text-X"))
      (is (str/includes? output "text-Y"))
      ;; Arrows share one grammar with linear mode: hue by state, weight by
      ;; whether the arrow lies on an optimal path.
      (is (str/includes? output "dp-M"))
      (is (str/includes? output "dp-X"))
      (is (str/includes? output "dp-Y"))
      (is (str/includes? output "opt-M"))
      (is (str/includes? output "opt-X"))
      (is (str/includes? output "opt-Y")))))

(deftest tikz-affine-has-decomposition-overlays
  (testing "Affine TikZ output includes layer decomposition overlays in body"
    (let [output (tikz/tikz-alignment affine-result)
          ;; Header defines each -dim style once; body uses should add more
          count-occurrences (fn [s sub] (count (re-seq (re-pattern (java.util.regex.Pattern/quote sub)) s)))]
      ;; More than 1 occurrence means it's used in the body, not just the header definition
      (is (> (count-occurrences output "text-M-dim") 1))
      (is (> (count-occurrences output "text-X-dim") 1))
      (is (> (count-occurrences output "text-Y-dim") 1)))))

(deftest scale-tikz-test
  (testing "Scale returns a pgftransformscale LaTeX command"
    (let [scale (tikz/scale-tikz "HEAGAWGHEE" "PAWHEAE")]
      (is (string? scale))
      (is (str/includes? scale "\\pgftransformscale")))))

;; ---------------------------------------------------------------------------
;; Renderer and macro package agree on style names
;; ---------------------------------------------------------------------------

(deftest every-emitted-style-is-defined
  (testing "Style names the renderer emits are defined in alignment-macros.tex"
    ;; A style the renderer emits but the macros never define fails at pdflatex
    ;; time with an error pointing at the generated .tex, far from the cause.
    ;; Covers both \\draw[...] and node [...] option lists; a bare token with no
    ;; "=" is a style name, anything with one is a key-value option.
    (let [defined (set (map second
                            (re-seq #"\\tikzset\{([A-Za-z0-9-]+)/\.style"
                                    tikz/macros)))
          emitted (set (mapcat (fn [output]
                                 (->> (concat (re-seq #"\\draw\s*\[([^\]]+)\]" output)
                                              (re-seq #"node\s*\[([^\]]+)\]" output))
                                      (map second)
                                      (mapcat #(str/split % #","))
                                      (map str/trim)
                                      (remove #(or (str/includes? % "=")
                                                   (str/starts-with? % "#")
                                                   (#{"->" "dashed"} %)))))
                               [(tikz/tikz-alignment test-result)
                                (tikz/tikz-alignment affine-result)]))]
      (is (contains? emitted "aln-score") "linear scores should use the style")
      (is (contains? emitted "aln-grid") "the grid should use the style")
      (is (contains? emitted "aln-state-score"))
      (is (empty? (set/difference emitted defined))
          (str "undefined styles: " (set/difference emitted defined)))))
  (testing "Nothing is hardcoded to a white page"
    (doseq [output [(tikz/tikz-alignment test-result)
                    (tikz/tikz-alignment affine-result)]]
      (is (not (str/includes? output "fill=white"))
          "score patches must track the document background, not be white")
      (is (not (str/includes? output "color=lightgray"))
          "the grid must track the document background"))))

(deftest macros-define-both-arrow-weights
  (testing "The macro package carries the full grammar, not a stale subset"
    (doseq [style ["dp-M" "dp-X" "dp-Y" "opt-M" "opt-X" "opt-Y"
                   "dp-M-dim" "opt-M-dim" "text-M" "text-M-dim"]]
      (is (str/includes? tikz/macros (str "\\tikzset{" style "/.style"))
          (str style " missing from alignment-macros.tex"))))
  (testing "Only optimal-path styles carry an arrowhead"
    (doseq [line (str/split-lines tikz/macros)
            :when (str/includes? line "/.style")]
      (let [head? (str/includes? line "->")
            optimal? (str/includes? line "{opt-")]
        (is (= head? optimal?)
            (str "arrowhead should appear on opt-* styles only: " line))))))

(deftest every-emitted-macro-is-defined
  (testing "Macro names the renderer emits are defined in alignment-macros.tex"
    (let [defined (set (map second
                            (re-seq #"\\newcommand\\([A-Za-z]+)\[" tikz/macros)))
          emitted (set (mapcat (fn [output]
                                 (map second (re-seq #"\\(aln[A-Za-z]*)\{" output)))
                               [(tikz/tikz-alignment test-result)
                                (tikz/tikz-alignment affine-result)]))]
      (is (= #{"alnup" "alnleft" "alnmatch"} defined))
      (is (seq emitted))
      (is (empty? (set/difference emitted defined))
          (str "undefined macros: " (set/difference emitted defined)))))
  (testing "The generic names are gone, so the package cannot clash with older
            generated output that defines them itself"
    (doseq [generic ["drawup" "drawleft" "drawmatch"]]
      (is (not (str/includes? tikz/macros (str "\\newcommand\\" generic)))
          (str generic " should be namespaced")))))

;; ---------------------------------------------------------------------------
;; Overlay modes
;; ---------------------------------------------------------------------------

(defn- specs-in [output]
  (set (map second (re-seq #"visible<([^>]+)>" output))))

(deftest overlays-all-is-the-default
  (testing "Plain overlay specs; a handout, having no overlays, shows it all"
    (let [output (tikz/tikz-alignment test-result)]
      (is (= output (tikz/tikz-alignment test-result {:overlays :all})))
      (is (every? #(re-matches #"\d+-" %) (specs-in output))))))

(deftest overlays-none-emits-no-overlay-specs
  (testing "One static slide — nothing is wrapped in \\visible"
    (doseq [result [test-result affine-result]]
      (let [output (tikz/tikz-alignment result {:overlays :none})]
        (is (empty? (specs-in output))))))
  (testing "and the decomposition phase is suppressed, since its three slides
            would otherwise be drawn on top of each other"
    (let [output (tikz/tikz-alignment affine-result {:overlays :none})]
      ;; -dim styles appear once each as header definitions and nowhere else.
      (is (= 1 (count (re-seq #"text-M-dim" output)))))))

(deftest overlays-steps-hides-content-from-the-handout
  (testing "Every reveal is beamer-only, so the handout shows the bare problem"
    (let [output (tikz/tikz-alignment test-result {:overlays :steps})
          specs (specs-in output)]
      (is (seq specs))
      (is (every? #(str/ends-with? % "|handout:0") specs))
      (is (every? #(str/starts-with? % "beamer:") specs))))
  (testing "the grid and sequence labels stay outside any overlay, so the
            handout still shows the empty matrix to work on"
    (let [output (tikz/tikz-alignment test-result {:overlays :steps})]
      (is (str/includes? output "aln-grid"))
      (is (not (re-find #"visible<[^>]*>\{[^}]*aln-grid" output))))))

(deftest overlays-steps-and-solution-drops-nothing
  (testing "steps+solution keeps every cell, unlike a plain capped build"
    (let [opts {:last-overlay 12 :overlays :steps}
          dropped (tikz/tikz-alignment test-result opts)
          collapsed (tikz/tikz-alignment test-result (assoc opts :overflow :collapse))
          scores (fn [o] (count (re-seq #"aln-score" o)))]
      (is (< (scores dropped) (scores collapsed)))
      (is (= (scores collapsed) (scores (tikz/tikz-alignment test-result)))))))

(defn- spec-lines
  "Every \\visible line as [overlay-spec body]. Line-based because bodies
   contain braces of their own."
  [output]
  (for [line (str/split-lines output)
        :let [m (re-find #"visible<([^>]+)>\{(.*)\}" line)]
        :when m]
    [(nth m 1) (nth m 2)]))

(defn- handout-suppressed? [spec] (str/ends-with? spec "|handout:0"))

(deftest overlays-all-but-traceback-splits-fill-from-solution
  (testing "The completed matrix reaches the handout; the optimal path does not"
    (let [lines (spec-lines (tikz/tikz-alignment test-result
                                                 {:overlays :all-but-traceback}))
          {solution true fill false} (group-by #(str/includes? (second %) "opt-") lines)]
      (is (seq solution) "fixture should have an optimal path")
      (is (seq fill))
      (is (every? (comp handout-suppressed? first) solution)
          "traceback arrows must be beamer-only")
      (is (every? (comp not handout-suppressed? first) fill)
          "scores and candidate arrows must print in the handout")))
  (testing "and the slides are unaffected — same reveal order as :all"
    (let [strip #(str/replace % #"beamer:([^|]+)\|handout:0" "$1")]
      (is (= (tikz/tikz-alignment test-result)
             (strip (tikz/tikz-alignment test-result
                                         {:overlays :all-but-traceback})))))))

(deftest decomposition-is-always-beamer-only
  (testing "In a handout every overlay spec matches at once, so the three
            state-highlight slides would otherwise be drawn superimposed"
    (doseq [mode [:all :all-but-traceback :steps]]
      (let [lines (spec-lines (tikz/tikz-alignment affine-result {:overlays mode}))
            decomp (filter #(str/includes? (second %) "-dim") lines)]
        (is (seq decomp) (str "fixture should decompose under " mode))
        (is (every? (comp handout-suppressed? first) decomp)
            (str "decomposition leaked into the handout under " mode))))))

(deftest overlays-all-keeps-the-finished-picture-in-the-handout
  (testing "A linear picture is withheld from the handout not at all"
    (let [lines (spec-lines (tikz/tikz-alignment test-result {:overlays :all}))]
      (is (seq lines))
      (is (not-any? (comp handout-suppressed? first) lines))))
  (testing "and in the affine case only the tail — the decomposition phase —
            is withheld, never any of the picture itself"
    (let [lines (spec-lines (tikz/tikz-alignment affine-result {:overlays :all}))
          step-of (fn [[spec _]] (parse-long (re-find #"\d+" spec)))
          {withheld true printed false} (group-by (comp handout-suppressed? first) lines)]
      (is (seq withheld))
      (is (seq printed))
      ;; Every withheld step comes after every printed one, so nothing from the
      ;; matrix itself is caught up in the suppression.
      (is (> (apply min (map step-of withheld))
             (apply max (map step-of printed)))))))
