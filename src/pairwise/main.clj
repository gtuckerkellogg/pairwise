(ns pairwise.main
  (:require [pairwise.linear :as pairwise]
            [pairwise.substitution :refer :all]
            [pairwise.tikz-view :as tikz]
            [clojure.walk :as w]
            [clojure.string :as str]
            [clojure.tools.cli :refer [parse-opts]]
            ))

(def cli-options
  ;; An option with a required argument
  [["-1" "--s1 S1" "First sequence"
    :parse-fn #(Integer/parseInt %)
    :validate [#(< 0 % 0x10000) "Must be a number between 0 and 65536"]]
   ;; A non-idempotent option (:default is applied first)
   ["-v" nil "Verbosity level"
    :id :verbosity
    :default 0
    :update-fn inc] ; Prior to 0.4.1, you would have to use:
                   ;; :assoc-fn (fn [m k _] (update-in m [k] inc))
   ;; A boolean option defaulting to nil
   ["-h" "--help"]])
