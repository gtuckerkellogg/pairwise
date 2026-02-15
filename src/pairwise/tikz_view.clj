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

;; Sub-region offsets within a cell (diagonal mnemonic)
;; V'X: upper-right, V'M: center, V'Y: lower-left
(def ^:private state-offset
  {:X [ 0.3 -0.3]    ;; upper-right in TikZ rotated coords
   :M [ 0.0  0.0]    ;; center
   :Y [-0.3  0.3]})  ;; lower-left

(defmethod render-instruction :state-scores [{:keys [row col vm vx vy step]}]
  (let [fmt (fn [val offset-key scale]
              (when (some? val)
                (let [[dr dc] (state-offset offset-key)]
                  (format "\\visible<%d->{\\draw (%s,%s) node [fill=white,scale=%s] {%s};}\n"
                          step (+ row dr) (+ col dc) scale val))))]
    [(fmt vx :X "0.35")
     (fmt vm :M "0.4")
     (fmt vy :Y "0.35")]))

(defmethod render-instruction :state-arrow [{:keys [from-row from-col from-state
                                                     to-row to-col to-state
                                                     direction arrow-type step]}]
  (let [[from-dr from-dc] (state-offset from-state)
        [to-dr to-dc] (state-offset to-state)
        style (if (= arrow-type :optimal)
                (str "state-" (name from-state) ",very thick")
                (str "state-" (name from-state)))]
    (format "\\visible<%d->{\\draw[->,>={latex},%s] (%s,%s) -- (%s,%s);}\n"
            step style
            (+ from-row from-dr) (+ from-col from-dc)
            (+ to-row to-dr) (+ to-col to-dc))))

(defn- render-decomp-score
  "Render a single state-score value for the decomposition phase."
  [row col val offset-key scale style-suffix step]
  (when (some? val)
    (let [[dr dc] (state-offset offset-key)]
      (format "\\visible<%d>{\\draw (%s,%s) node [fill=white,scale=%s,%s] {%s};}\n"
              step (+ row dr) (+ col dc) scale style-suffix val))))

(defn- render-decomp-arrow
  "Render a single state-arrow for the decomposition phase."
  [arrow style-suffix step]
  (let [{:keys [from-row from-col from-state to-row to-col to-state arrow-type]} arrow
        [from-dr from-dc] (state-offset from-state)
        [to-dr to-dc] (state-offset to-state)
        width (if (= arrow-type :optimal) "very thick" "")]
    (format "\\visible<%d>{\\draw[->,>={latex},%s%s] (%s,%s) -- (%s,%s);}\n"
            step style-suffix (if (seq width) (str "," width) "")
            (+ from-row from-dr) (+ from-col from-dc)
            (+ to-row to-dr) (+ to-col to-dc))))

(defmethod render-instruction :decomposition-phase
  [{:keys [states start-step state-scores state-arrows]}]
  (vec
   (for [[idx highlight] (map-indexed vector states)
         :let [step (+ start-step idx)]]
     (str
      ;; Render all scores — highlighted state at full style, others dimmed
      (apply str
        (for [{:keys [row col vm vx vy]} state-scores]
          (str
           (render-decomp-score row col vx :X "0.35"
                                (if (= highlight :X) "state-X" "state-X-dim") step)
           (render-decomp-score row col vm :M "0.4"
                                (if (= highlight :M) "state-M" "state-M-dim") step)
           (render-decomp-score row col vy :Y "0.35"
                                (if (= highlight :Y) "state-Y" "state-Y-dim") step))))
      ;; Render all arrows — highlighted state at full style, others dimmed
      (apply str
        (for [arrow state-arrows]
          (let [from-state (:from-state arrow)
                style (if (= highlight from-state)
                        (str "state-" (name from-state))
                        (str "state-" (name from-state) "-dim"))]
            (render-decomp-arrow arrow style step))))))))

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
