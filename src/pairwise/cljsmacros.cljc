(ns pairwise.cljsmacros
  (:refer-clojure :exclude [slurp]))

(defmacro slurp [file]
  (clojure.core/slurp file))

(slurp "/home/gtk/work/zb4171/kallisto.md")


