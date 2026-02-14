(ns pairwise.linear-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.walk :as w]
            ;;            [clojure.spec.alpha :as s]
            ;;            [clojure.spec.gen.alpha :as gen]
            [pairwise.substitution :as sub]))


#_(gen/sample (s/gen :pairwise.linear/dna-input) 30)




(def s1 "CC")
(def s2 "CCA")
(let [D (initialise-D s1 s2)
      S (sub/simple-substitution-matrix :dna )
      gap-penalty 1]
  (build-dp-matrix S gap-penalty s1 s2 :type :global))

(let [s1 "CCAAT"
      s2 "CCAAC"
      ]
        (substitution-type s1 s2 0 0)
)


(let [S            (sub/simple-substitution-matrix :protein :same 5 :different -3)
      s1           "SIMILAR"
      s2           "SIMMARE"
      gap-penalty  3
      type         :local
      D            (build-dp-matrix S gap-penalty s1 s2 :type type)
      ]
   (:alignments (pairwise-align s1 s2 S gap-penalty :type type)))


(let [S  (sub/simple-substitution-matrix :protein :same 5 :different -2)
      s1 "GACCAG"
      s2 "CATTCG"
      d 3
      ]
  S)

(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s2 "PAWHEAEH"
      s1 "HEAGAWGHEE"
      d 8
      ]
  (pprint/pprint (:optimal-paths (pairwise-align s1 s2 S d :type :global)))
  )

(defn when-visible
  "path: a path representing an optimal alignment
  starting-point: the step of the last cell of the DP matrix
  yield: a new set of time point"
  [path starting-point]
;  () (map inc (range  (count path)))
  (->> path
      count
      range
      (map + (repeat (count path) (+ 1 starting-point)))
      ))

(let [path [[9 8] [9 7] [8 7] [7 6]]
      starting-point 100
      ]
    (when-visible path starting-point)
    )


(repeat  3 10)


(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      ]
  (map #(map inc %) (map range (map count (:optimal-paths (pairwise-align s1 s2 S d :type :global))))))




(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "SIMILAR"
      s2 "SIMMARE"
      d 8
      A (pairwise-align s1 s2 S d :type :global)
      ]
  (map #(+ 2 %) (range 1 (inc (apply max (map count (:optimal-paths A))))))
  )

(map #(+ 2 %) (range 10))


(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      ]
  (pprint/pprint (:dp-matrix (pairwise-align s1 s2 S d :type :global)))
)


