(ns pairwise.spec
  #_(:require [clojure.spec.alpha :as s]
            [clojure.spec.gen.alpha :as gen]))

;; (def dna-letters "ACGT")
;; (def dna-regex #"^[ACGT]+$")
;; (def protein-letters "ABCDEFGHIKLMNPQRSTVWXY")
;; (def protein-regex #"^[ABCDEFGHIKLMNPQRSTVWXYZ*]+$")

;; (s/def ::dna (s/with-gen (s/and string?  #(re-matches dna-regex %))
;;                #(gen/fmap clojure.string/join (gen/vector (gen/elements (seq dna-letters))))))


;; (s/def ::dna-input (s/and ::dna
;;                           #(>= (count %) 4) #(<= (count %) 20)))

;; (s/def ::protein (s/with-gen (s/and string?  #(re-matches protein-regex %))
;;                #(gen/fmap clojure.string/join (gen/vector (gen/elements (seq protein-letters))))))

;; (s/def ::protein-input (s/and ::protein
;;                           #(>= (count %) 4) #(<= (count %) 20)))

;; (s/def ::bioseq-input (s/or ::dna-input ::protein-input))

;; (gen/sample (s/gen ::dna-input))

;; (s/exercise ::dna-input)
