(ns pairwise.tikz-view
  (:require [pairwise.linear :as pairwise]
            [pairwise.substitution :refer :all]
            [clojure.walk :as w]
            [clojure.string :as str]))


(def header (slurp "resources/tikz/header.tex"))
(def footer (slurp "resources/tikz/footer.tex"))

(defn- scores [D]
  (w/prewalk #(:score %1) D)
  )

(defn scale-tikz [s1 s2]
  (let [scale  (+ 2 (max (count s1) (count  s2)))]
    scale
    (format "\\pgftransformscale{%3.2f};\n" (/ 8. scale))
    )
  )

(defn draw-grid [s1 s2]
  (let [M (inc (count s1))
        N (inc (count s2))]
    ["\\pgftransformrotate{-90};"
     (format "\\path [use as bounding box] (-1.5,-1) rectangle (%d,%d);\n" (inc N) (inc M))
     (format "\\draw [xshift=-0.5cm,yshift=-0.5cm,color=lightgray] (0,0) grid (%d,%d);\n" N M)
     (map str (map-indexed #(format "\\draw (-1,%s) node [scale=1] {%s};\n" (inc %1) %2) (seq s1)))
     (map str (map-indexed #(format "\\draw (%s,-1) node [scale=1] {%s};\n" (inc %1) %2) (seq s2)))]
    ))


(defn latex-env [env s]
  (vector (format "\\begin{%s}\n" (name env))
          s
          (format "\\end{%s}\n" (name env))))

(defn latex-command [cmd args s]
  (vector (if args
            (format "\\%s%s{\n" (name cmd) args)
            (format "}" (name cmd))) 
          s
          "}"))


(defn- draw-score [D ij]
  (let [score (:score (get-in D ij))
        i (first ij)
        j (second ij)]
    (format "\\draw (%d,%d) node [fill=white,scale=0.5] {%s};\n" i j score)))

(defn- draw-dp-arrows [D ij]
  (let [from (:from (get-in D ij))
        step (:step (get-in D ij))
        step-map {:horiz "drawleft"
                  :vert  "drawup"
                  :diag  "drawmatch"}
        i (first ij)
        j (second ij)]
    (when-not (nil? (first step))
      (map-indexed #(format "\\%s{%d}{%d}{%s};\n" (%2 step-map) i j "align step" %1) step )
      )))

(defn- draw-optimal-paths [a]
  (let [paths    (:optimal-paths a)
        steps  (mapcat (partial partition 2 1) paths)
        draw-one (fn [step]
                   (let [from (first step)
                         to (second step)
                         draw (cond
                                        (= (first from) (first to))   "drawleft"
                                        (= (second from) (second to)) "drawup"
                                        :else                         "drawmatch"
                                        )]
                     (format "\\%s{%d}{%d}{optimal step};\n" draw (first from) (second from))))]
                                        ;(apply draw-one paths (rest paths))
                                        ;
    (apply str (mapcat draw-one steps))
    )
  )


(defn tikz-alignment
  "doc-string"
  [alignments outfile]
  (let [spitout #(spit outfile %1 :append true)
        ij      (for [cols (range (count (first (:dp-matrix alignments))))
                      rows (range (count (:dp-matrix alignments))) 
                      ]
                  [rows cols])
        content (flatten  [(draw-grid (:sequence-1 alignments) (:sequence-2 alignments))
                           (map #(draw-score (:dp-matrix alignments) %1) ij)
                           (map #(draw-dp-arrows (:dp-matrix alignments) %1) ij)
                           (draw-optimal-paths alignments)
                           ])
        ]
    (spit outfile header)
                                        ;(map spitout (flatten content))
                                        ;    (spitout footer)
    (map spitout  (flatten (->> (flatten content)
                                (latex-env :tikzpicture)
;                                (latex-command :resizebox "{!}{6in}")
                                (latex-env :standaloneframe)
                                (latex-env :document))))
    )
  )

#_(let [s1 "IMILAAAARRR"
      s2 "SIMILRR"
      S  (simple-substitution-matrix :protein :same 5 :different -3)
      d 3
      result (pairwise/pairwise-align s1 s2 S d :type :local)]
  (tikz-alignment result "resources/tikz/out.tex")
  )

(let [S  (scoring-matrix "resources/data/BLOSUM50.txt")
      s1 "HEAGAWGHEE"
      s2 "PAWHEE"
      d 8
      result (pairwise/pairwise-align s1 s2 S d :type :global)]
  (tikz-alignment result "resources/tikz/out.tex")
;  (:alignments result)
  )
