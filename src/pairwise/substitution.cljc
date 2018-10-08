(ns pairwise.substitution
  (:require [clojure.string :as str]
            #?(:cljs [cljs.reader :refer [read-string]])
            ;#?(:cljs  [pairwise.cljsmacros :include-macros true :refer [read-file]])
            )) 


(defn simple-substitution-matrix 
  "Create a simple substitution matrix instead of a full substitution matrix"
  [seq-type & {:keys [same different] :or {same 1 different -2}}]
  (let [s (cond (= seq-type :dna) "ACGT"
                 (= seq-type :protein) "ARNDCQEGHILKMFPSTWYVBZX")]
      (into {} (map (fn [keys] (if (= (first keys) (second keys))
                            {keys same}
                            {keys different}
                            )) (for [s1 (seq s)
                                     s2 (seq s)]
                                 [s1 s2]
                                 )))))


(defn read-scoring-matrix "This gets a substitution matrix from a file"
  [contents]
  (let [contents (str/split-lines contents)
        contents (filter  #(not (re-find #"#" %1 )) contents)
        aa1 (flatten  (map seq (rest (str/split (first contents) #"\s+"))))
        matrix (rest contents)
        scoremap (fn [scores] (let [scores (str/split scores #"\s+")
                                   aa2 (first (seq (first scores)))
                                   scores (map read-string (rest scores))]
                               (into {} (map-indexed #(hash-map [%2 aa2] (nth scores %1)) aa1))
                               ;(into {} )
                               ))]
    (into {} (map scoremap matrix))))



