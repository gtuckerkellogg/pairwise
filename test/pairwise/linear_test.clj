(ns pairwise.linear-test
  (:require [clojure.test :refer :all]
            [pairwise.linear :refer :all]
            [clojure.string :as str]
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
  (build-dp-matrix S gap-penalty s1 s2 :type :local))



(let [S            (sub/simple-substitution-matrix :protein :same 5 :different -3)
      s1           "PPPPSIMIL"
      s2           "SIMMILL"
      gap-penalty  3
      type         :global
      D            (build-dp-matrix S gap-penalty s1 s2 :type type)
      ]
  (->  (:alignments (pairwise-align s1 s2 S gap-penalty :type type))
       first
       str/join
       println
       ))



(let [S  (sub/simple-substitution-matrix :protein :same 5 :different -2)
      s1 "GACCAG"
      s2 "CATTCG"
      d 3
      ]
  S)

(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      ]
  (:alignments (pairwise-align s1 s2 S d :type :global))
)


(let [S  (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d 8
      ]
  (pairwise-align s1 s2 S d :type :global)
)


