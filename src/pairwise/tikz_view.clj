(ns pairwise.tikz-view
  (:require [pairwise.alignment :as pairwise]
            [pairwise.linear]  ; registers :linear multimethod implementations
            [pairwise.viz-model :as viz]
            [clojure.string :as str]
            [clojure.java.io :as io]))


(defn- load-resource [path]
  (if-let [resource (io/resource path)]
    (slurp resource)
    (throw (Exception. (str "Could not find " path " resource")))))

(def macros
  "The arrow macros and style definitions, shared with the generated
   alignment-macros.sty package (see build/sty). Single source of truth for the
   visual grammar."
  (load-resource "tikz/alignment-macros.tex"))

(defn load-header []
  (str (load-resource "tikz/preamble.tex") "\n" macros))

(def header (load-header))

(def ^:dynamic *max-progressive-step* nil)

(def ^:dynamic *overlays*
  "What the handout keeps. Slides always step through; a handout has no
   overlays, so anything left unqualified appears there all at once.
     :all                the finished picture — matrix fill and traceback
     :none               no overlays at all; one static slide either way
     :steps              nothing — the bare grid, an unsolved problem
     :all-but-traceback  the completed matrix but not the optimal path, so the
                         reader can trace it themselves"
  :all)

(defn- hide-from-handout?
  "Whether content of this role is suppressed in the handout.

   :decomposition is always beamer-only. It exists purely to be stepped
   through, and in a handout every overlay specification matches at once, so
   its three state-highlight slides would draw on top of each other."
  [role]
  (case *overlays*
    :none false
    :steps true
    :all (= role :decomposition)
    :all-but-traceback (not= role :fill)))

(defn- overlay-spec
  "Overlay specification for `role` content revealed at `from` and, when `to` is
   given, hidden again after it.

   Returns a Beamer specification string, nil to emit the fragment unwrapped, or
   :omit to leave it out altogether.

   `past-cap?` marks content beyond --last-overlay. The cap limits the
   presentation, not the printed page, so such content is not shown on any
   slide but survives wherever the handout would have shown it anyway."
  [role from to past-cap?]
  (let [withheld? (hide-from-handout? role)]
    (cond
      past-cap? (if (or withheld? (= *overlays* :none))
                  :omit
                  "beamer:0|handout:1-")
      (= *overlays* :none) nil
      :else (let [range (if to (format "%s-%s" from to) (format "%s-" from))]
              (if withheld?
                (str "beamer:" range "|handout:0")
                range)))))

(defn- visible
  "Wrap a TikZ fragment so it appears only where it should. `role` is :fill
   (matrix scores and the candidate moves behind them), :solution (the optimal
   path) or :decomposition (the affine state-by-state overlays)."
  ([role from past-cap? body] (visible role from past-cap? nil body))
  ([role from past-cap? to body]
   (let [spec (overlay-spec role from to past-cap?)]
     (cond
       (= spec :omit) nil
       (nil? spec) (str body "\n")
       :else (format "\\visible<%s>{%s}\n" spec body)))))

(defn scale-tikz [s1 s2]
  (let [scale (+ 2 (max (count s1) (count s2)))]
    (format "\\pgftransformscale{%3.2f}\n" (/ 8. scale))))

(defn latex-env [env s]
  (vector (format "\n\\begin{%s}\n" (name env))
          s
          (format "\n\\end{%s}\n" (name env))))


(defn latex-command [cmd args s]
  (vector (if args
            (format "\\%s%s{\n" (name cmd) args)
            (format "\\%s{\n" (name cmd)))
          s
          "}"))

;; ---------------------------------------------------------------------------
;; Instruction renderers
;; ---------------------------------------------------------------------------

(def ^:private direction-cmd
  "Macro names are namespaced (see resources/tikz/alignment-macros.tex); they
   must match the \\newcommand definitions there."
  {:horiz "alnleft" :vert "alnup" :diag "alnmatch"})

(def ^:private direction-state
  "Grid directions correspond one-to-one with the affine states, so linear and
   affine visualisations share a single colour grammar: diagonal is a
   substitution (V'M), vertical a gap in the top sequence (V'X), horizontal a
   gap in the left sequence (V'Y)."
  {:diag :M :vert :X :horiz :Y})

(defn- arrow-style
  "TikZ style list for an arrow. Hue comes from the state (equivalently, the
   direction of the move); weight and saturation from whether the arrow lies on
   an optimal path. A dashed diagonal marks a mismatch. The style also supplies
   the arrowhead, which only the opt-* styles carry."
  [state arrow-type & {:keys [dim? mismatch?]}]
  (str (if (= arrow-type :optimal) "opt-" "dp-")
       (name state)
       (when dim? "-dim")
       (when mismatch? ",dashed")))

(defmulti render-instruction
  "Render a single IR instruction as a TikZ string."
  :type)

(defmethod render-instruction :grid [{:keys [rows cols]}]
  ["\\pgftransformrotate{-90}\n"
   (format "\\draw [xshift=-0.5cm,yshift=-0.5cm,aln-grid] (0,0) grid (%d,%d);\n" rows cols)])

(defmethod render-instruction :seq-label [{:keys [axis index char]}]
  (case axis
    :top  (format "\\draw (-1,%s) node [aln-seq-label] {%s};\n" (inc index) char)
    :left (format "\\draw (%s,-1) node [aln-seq-label] {%s};\n" (inc index) char)))

(defmethod render-instruction :cell-score [{:keys [row col score step past-cap]}]
  (visible :fill step past-cap
           (format "\\draw (%d,%d) node [aln-score] {%s};" row col score)))

(defmethod render-instruction :dp-arrow [{:keys [from-row from-col direction step past-cap]}]
  (visible :fill step past-cap
           (format "\\%s{%d}{%d}{%s}"
                   (direction-cmd direction) from-row from-col
                   (arrow-style (direction-state direction) :dp))))

(defmethod render-instruction :path-arrow [{:keys [from-row from-col direction substitution-type step past-cap]}]
  (visible :solution step past-cap
           (format "\\%s{%d}{%d}{%s}"
                   (direction-cmd direction) from-row from-col
                   (arrow-style (direction-state direction) :optimal
                                :mismatch? (= substitution-type :mismatch)))))

;; Sub-region offsets within a cell (diagonal mnemonic)
;; TikZ rotated coords: row increases downward, col increases rightward
;; V'X: upper-right → row decreases, col increases
;; V'M: center
;; V'Y: lower-left → row increases, col decreases
(def ^:private state-offset
  {:X [-0.3  0.3]    ;; upper-right
   :M [ 0.0  0.0]    ;; center
   :Y [ 0.3 -0.3]})  ;; lower-left

(defmethod render-instruction :state-scores [{:keys [row col vm vx vy step past-cap]}]
  (let [fmt (fn [val offset-key size style]
              (when (some? val)
                (let [[dr dc] (state-offset offset-key)]
                  (visible :fill step past-cap *max-progressive-step*
                           (format "\\draw (%s,%s) node [%s,%s] {%s};"
                                   (+ row dr) (+ col dc) size style val)))))]
    [(fmt vx :X "aln-state-score" "text-X")
     (fmt vm :M "aln-state-score-main" "text-M")
     (fmt vy :Y "aln-state-score" "text-Y")]))

(defmethod render-instruction :state-arrow [{:keys [from-row from-col from-state
                                                     to-row to-col to-state
                                                     substitution-type arrow-type step
                                                     past-cap]}]
  (let [[from-dr from-dc] (state-offset from-state)
        [to-dr to-dc] (state-offset to-state)
        style (arrow-style from-state arrow-type
                           :mismatch? (= substitution-type :mismatch))]
    (visible (if (= arrow-type :optimal) :solution :fill)
             step past-cap *max-progressive-step*
             (format "\\draw[%s] (%s,%s) -- (%s,%s);"
                     style
                     (+ from-row from-dr) (+ from-col from-dc)
                     (+ to-row to-dr) (+ to-col to-dc)))))

(defn- render-decomp-score
  "Render a single state-score value for the decomposition phase."
  [row col val offset-key size style-suffix step]
  (when (some? val)
    (let [[dr dc] (state-offset offset-key)]
      (visible :decomposition step false step
               (format "\\draw (%s,%s) node [%s,%s] {%s};"
                       (+ row dr) (+ col dc) size style-suffix val)))))

(defn- render-decomp-arrow
  "Render a single state-arrow for the decomposition phase. Arrows belonging to
   the state under discussion render at full strength; the rest are dimmed."
  [arrow highlight step]
  (let [{:keys [from-row from-col from-state to-row to-col to-state
                substitution-type arrow-type]} arrow
        [from-dr from-dc] (state-offset from-state)
        [to-dr to-dc] (state-offset to-state)
        style (arrow-style from-state arrow-type
                           :dim? (not= highlight from-state)
                           :mismatch? (= substitution-type :mismatch))]
    (visible :decomposition step false step
             (format "\\draw[%s] (%s,%s) -- (%s,%s);"
                     style
                     (+ from-row from-dr) (+ from-col from-dc)
                     (+ to-row to-dr) (+ to-col to-dc)))))

(defmethod render-instruction :decomposition-phase
  [{:keys [states start-step state-scores state-arrows]}]
  ;; The phase exists only to be stepped through. With overlays switched off its
  ;; three slides would land on top of each other, drawing every state at once.
  (when-not (= *overlays* :none)
    (vec
   (for [[idx highlight] (map-indexed vector states)
         :let [step (+ start-step idx)]]
     (str
      ;; Render all arrows first — highlighted state at full style, others dimmed
      (apply str
        (for [arrow state-arrows]
          (render-decomp-arrow arrow highlight step)))
      ;; Render all scores on top — highlighted state at full style, others dimmed
      (apply str
        (for [{:keys [row col vm vx vy]} state-scores]
          (str
           (render-decomp-score row col vx :X "aln-state-score"
                                (if (= highlight :X) "text-X" "text-X-dim") step)
           (render-decomp-score row col vm :M "aln-state-score-main"
                                (if (= highlight :M) "text-M" "text-M-dim") step)
           (render-decomp-score row col vy :Y "aln-state-score"
                                (if (= highlight :Y) "text-Y" "text-Y-dim") step)))))))))

(defmethod render-instruction :default [_inst]
  nil)

;; ---------------------------------------------------------------------------
;; Main entry point
;; ---------------------------------------------------------------------------

(defn tikz-alignment
  "Generate a complete TikZ/LaTeX document for an alignment visualization.

   Options:
     :last-overlay  render only the first n Beamer overlay steps (nil = all)
     :overflow      :drop (default) or :collapse — see pairwise.viz-model
     :overlays      :all (default), :none or :steps — see *overlays*"
  ([alignments] (tikz-alignment alignments nil))
  ([alignments {:keys [overlays] :or {overlays :all} :as opts}]
  (binding [*overlays* overlays]
   (let [model (viz/alignment->instructions alignments opts)
        max-prog (:max-progressive-step model)
        content (if max-prog
                  (binding [*max-progressive-step* max-prog]
                    (flatten (map render-instruction (:instructions model))))
                  (flatten (map render-instruction (:instructions model))))]
    (str/join (flatten (list header (->> (flatten content)
                                         (latex-env :tikzpicture)
                                         (latex-env :standaloneframe)
                                         (latex-env :document)))))))))
