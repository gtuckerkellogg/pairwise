(ns pairwise.cljsmacros
  (:refer-clojure :exclude [slurp]))

#?(:clj (defmacro read-file [file]
          (clojure.core/slurp file)))
