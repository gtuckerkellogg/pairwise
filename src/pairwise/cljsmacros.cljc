(ns pairwise.cljsmacros
  (:refer-clojure :exclude [slurp]))

(defmacro read-file [file]
  (clojure.core/slurp file))



