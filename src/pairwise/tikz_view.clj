(ns pairwise.tikz-view
  (:require [pairwise.alignment :as pairwise]
            [pairwise.linear]  ; registers :linear multimethod implementations
            [pairwise.viz-model :as viz]
            [clojure.string :as str]
            [clojure.java.io :as io]))


(defn load-header []
  (if-let [resource (io/resource "tikz/header.tex")]
    (slurp resource)
    (throw (Exception. "Could not find tikz/header.tex resource"))))

(def header (load-header))

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
  {:horiz "drawleft" :vert "drawup" :diag "drawmatch"})

(defmulti render-instruction
  "Render a single IR instruction as a TikZ string."
  :type)

(defmethod render-instruction :grid [{:keys [rows cols]}]
  ["\\pgftransformrotate{-90}\n"
   (format "\\draw [xshift=-0.5cm,yshift=-0.5cm,color=lightgray] (0,0) grid (%d,%d);\n" rows cols)])

(defmethod render-instruction :seq-label [{:keys [axis index char]}]
  (case axis
    :top  (format "\\draw (-1,%s) node [scale=1] {%s};\n" (inc index) char)
    :left (format "\\draw (%s,-1) node [scale=1] {%s};\n" (inc index) char)))

(defmethod render-instruction :cell-score [{:keys [row col score step]}]
  (format "\\visible<%d->{\\draw (%d,%d) node [fill=white,scale=0.5] {%s};}\n" step row col score))

(defmethod render-instruction :dp-arrow [{:keys [from-row from-col direction step]}]
  (format "\\visible<%d->{\\%s{%d}{%d}{%s}}\n"
          step (direction-cmd direction) from-row from-col "align step"))

(defmethod render-instruction :path-arrow [{:keys [from-row from-col direction substitution-type step]}]
  (let [style (if (= substitution-type :match)
                "optimal step"
                "optimal-but-non-identical step")]
    (format "\\visible<%d->{\\%s{%d}{%d}{%s}}\n"
            step (direction-cmd direction) from-row from-col style)))

(defmethod render-instruction :default [_inst]
  nil)

;; ---------------------------------------------------------------------------
;; Main entry point
;; ---------------------------------------------------------------------------

(defn tikz-alignment
  "Generate a complete TikZ/LaTeX document for an alignment visualization."
  [alignments]
  (let [model (viz/alignment->instructions alignments)
        content (flatten (map render-instruction (:instructions model)))]
    (str/join (flatten (list header (->> (flatten content)
                                         (latex-env :tikzpicture)
                                         (latex-env :standaloneframe)
                                         (latex-env :document)))))))
