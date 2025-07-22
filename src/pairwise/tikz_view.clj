(ns pairwise.tikz-view
  (:require [pairwise.linear :as pairwise]
            [pairwise.substitution :refer :all]
            [clojure.walk :as w]
            [clojure.string :as str]))


(def header (slurp "resources/tikz/header.tex"))

(defn- scores [D]
  (w/prewalk #(:score %1) D))

(defn scale-tikz [s1 s2]
  (let [scale  (+ 2 (max (count s1) (count  s2)))]
    scale
    (format "\\pgftransformscale{%3.2f}\n" (/ 8. scale))))

(defn draw-grid [s1 s2]
  (let [M (inc (count s1))
        N (inc (count s2))]
    ["\\pgftransformrotate{-90}\n"
;;     (format "\\path [use as bounding box] (-1.5,-1) rectangle (%d,%d);\n" (inc N) (inc M))
     (format "\\draw [xshift=-0.5cm,yshift=-0.5cm,color=lightgray] (0,0) grid (%d,%d);\n" N M)
     (map str (map-indexed #(format "\\draw (-1,%s) node [scale=1] {%s};\n" (inc %1) %2) (seq s1)))
     (map str (map-indexed #(format "\\draw (%s,-1) node [scale=1] {%s};\n" (inc %1) %2) (seq s2)))]
    ))


(defn latex-env [env s]
  (vector (format "\n\\begin{%s}\n" (name env))
          s
          (format "\n\\end{%s}\n" (name env))))


(defn latex-command [cmd args s]
  (vector (if args
            (format "\\%s%s{\n" (name cmd) args)
            (format "}" (name cmd))) 
          s
          "}"))


(defn- draw-score [D ij]
  (let [score (:score (get-in D ij))
        step (inc (:step (get-in D ij)))
        i (first ij)
        j (second ij)]
    (format "\\visible<%d->{\\draw (%d,%d) node [fill=white,scale=0.5] {%s};}\n" step i j score)))

(defn- draw-dp-arrows [D ij]
  (let [from (:from (get-in D ij))
        step (inc (:step (get-in D ij)))
        direction (:direction (get-in D ij))
        direction-map {:horiz "drawleft"
                  :vert  "drawup"
                  :diag  "drawmatch"}
        i (first ij)
        j (second ij)]
    (when-not (nil? (first direction))
      (map-indexed #(format "\\visible<%d->{\\%s{%d}{%d}{%s}}\n" step (%2 direction-map) i j "align step" %1) direction )
      )))

(defn- draw-optimal-paths [a]
  (let [paths    (:optimal-paths a)
        path-steps  (mapcat (partial partition 2 1) paths)
        reveal-times (flatten (:optimal-path-steps a))
        draw-one (fn [step step-time]
                   (let [from (first step)
                         to (second step)
                         substitution-type (get-in a [:dp-matrix (first from) (second from) :substitution-type])
                         draw (cond
                                        (= (first from) (first to))   "drawleft"
                                        (= (second from) (second to)) "drawup"
                                        :else                         "drawmatch"
                                        )]
                     (if (= substitution-type :match)
                       (format "\\visible<%d->{\\%s{%d}{%d}{optimal step}}\n" step-time draw (first from) (second from))                       
                       (format "\\visible<%d->{\\%s{%d}{%d}{optimal-but-non-identical step}}\n" step-time draw (first from) (second from))                       
                       )
))]
    (apply str (mapcat draw-one path-steps reveal-times))
    )
  )

(defn tikz-alignment
  "doc-string"
  [alignments]
  (let [ij      (for [cols (range (count (first (:dp-matrix alignments))))
                      rows (range (count (:dp-matrix alignments)))]
                  [rows cols])
        content (flatten  [(draw-grid (:sequence-1 alignments) (:sequence-2 alignments))
                           (map #(draw-score (:dp-matrix alignments) %1) ij)
                           (map #(draw-dp-arrows (:dp-matrix alignments) %1) ij)
                           (draw-optimal-paths alignments)
                           ])
        ]

    (str/join   (flatten (list header  (->> (flatten content)
                                            (latex-env :tikzpicture)
;;                                            (latex-command :resizebox "{!}{6in}")
                                            (latex-env :standaloneframe)
                                            (latex-env :document))))
              )))


(let [S  (read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      result (pairwise/pairwise-align s1 s2 S d :type :global)]
  (spit "resources/tikz/book.tex" (tikz-alignment result))
  )



(let [S  (read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEE"
      d 8
      ]
  (count (flatten (:optimal-path-steps (pairwise/pairwise-align s1 s2 S d :type :global))))
  )

(let [S  (read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEE"
      d 8
      ]
  (pairwise/pairwise-align s1 s2 S d :type :global)
  )


(let [S  (simple-substitution-matrix :protein :same 5 :different -5)
      s1 "SIMILAR"
      s2 "SIMMARE"
      d 3
      result (pairwise/pairwise-align s1 s2 S d :type :global)]
  (spit "resources/tikz/similar.tex" (tikz-alignment result))
  )

(let [S  (simple-substitution-matrix :protein :same 5 :different -5)
      s1 "SIMILAR"
      s2 "SIMMARE"
      d 3
      result (pairwise/pairwise-align s1 s2 S d :type :local)]
  (spit "resources/tikz/similar-local.tex" (tikz-alignment result))
  )

(let [S  (simple-substitution-matrix :protein :same 5 :different -5)
      s1 "SIMILAR"
      s2 "SIMMARE"
      d 3
      result (pairwise/pairwise-align s1 s2 S d :type :global)]
    (:alignments (pairwise/pairwise-align s1 s2 S d :type :local))
  )
