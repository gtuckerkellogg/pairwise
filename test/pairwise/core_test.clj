(ns pairwise.core-test
  (:require [clojure.test :refer :all]
            [pairwise.core :refer :all]
            [pairwise.substitution :refer :all]))


(def s1 "CAC")
(def s2 "CTCACA")

(let [S (simple-substitution-matrix :dna :same 1 :different -1)
      D (initialise-D (count s1) (count s2))]
(deftest score-m-test
  (testing "some stuff")
  (is (zero? (score-M D S s1 s2 0 0)))
  (is (nil? (score-M D S s1 s2 1 0)))
  (is (nil? (score-M D S s1 s2 0 1)))
  (is (nil? (score-M D S s1 s2 0 2)))
  (is (nil? (score-M D S s1 s2 0 8)))
  (is (= 1 (score-M D S s1 s2 1 1)))
  (is (= -1 (score-M D S s1 "GTCACA" 1 1)))))

(let [S (simple-substitution-matrix :dna :same 1 :different -1)
      D (initialise-D (count s1) (count s2))
      d 2
      e 1]
 (score-Y D d e 0 2)
)



(let [S (simple-substitution-matrix :dna :same 1 :different -1)
      D (initialise-D (count s1) (count s2))
      d -2
      e -1
      D (score-one D S d e s1 s2 0 1)
      
      ]
  (score-one D S d e s1 s2 0 0)
  )

(let [S (simple-substitution-matrix :dna :same 0 :different -1)
      D (initialise-D (count s1) (count s2))
      d 2
      e 1
      idx  (for [i (range (inc (count s1)))
                 j (range (inc (count s2)))] 
             [i j])
      ]
  (reduce (fn [D idx]
            (score-one D S d e s1 s2 (first idx) (second idx)))
          D idx)


  
  )







