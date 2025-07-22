(ns pairwise.linear-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [pairwise.tikz-view :refer :all]
            [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.walk :as w]
            ;;            [clojure.spec.alpha :as s]
            ;;            [clojure.spec.gen.alpha :as gen]
            [pairwise.substitution :as sub]))

(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      ]
  (tikz-alignment (pairwise-align s1 s2 S d :type :global))
)


