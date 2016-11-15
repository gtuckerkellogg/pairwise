(ns pairwise.core
  (:require [reagent.core :as reagent :refer (atom)]
            [pairwise.linear :as linear]
            [pairwise.substitution :as sub]
            [pairwise.cljsmacros :include-macros true :refer [read-file]]
            ))
 


(sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt"))

(enable-console-print!)


(println "This text is printed from src/pairwise/core.cljs. Go ahead and edit it and see reloading in action!")

;; define your app data so that it doesn't get over-written on reload

(defn render-alignment [alignment]
     [:pre (:top alignment) "\n"(:bottom alignment)]
  )

(defn app-results [app-state]
  (linear/pairwise-align (:top-seq app-state)
                         (:bottom-seq app-state)
                         (:scoring-matrix app-state)
                         (:d app-state) :type (:alignment-type app-state)))

(defonce BLOSUM62 (sub/scoring-matrix (read-file "resources/data/BLOSUM62.txt")) )
(defonce BLOSUM50 (sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt")) )


(let [S  BLOSUM62
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d  8]
      (def app-state (
                      atom {:top-seq        s1
                            :bottom-seq     s2
                            :scoring-matrix BLOSUM50
                            :sequence-type  :protein
                            :alignment-type :global
                            :scoring-matrix-name "BLOSUM50"
                            :d              d
                            ;:result (app-results @app-state)
                            }))
      )






(defn update-s1! [s]
  (swap! app-state assoc [:top-seq] s))

(defn input-sequence [which-seq]
  (let [val (atom "")]
    (fn []
      [:div
       [:input {:type        "text"
                :placeholder "Input Sequence"
                :value       @val
                :on-change   (fn [evt]
                               (reset! val (-> evt .-target .-value))
                               (swap! app-state assoc which-seq  @val)
                               (swap! app-state assoc :result (app-results @app-state))
                               )}]
])))

(defn display-alignment [{:keys [top bottom]}]
  [list top [:br] bottom [:br] [:br]])


(defn home-page []
      (fn []
      [:div
       [input-sequence :top-seq]
       [input-sequence :bottom-seq]
       [:h3 "scoring matrix: " (:scoring-matrix-name @app-state)
         [:br] "gap penalty: "(:d @app-state)]

       (if (:result @app-state)
         [:div [:h2 [:pre
                     (mapcat display-alignment (:alignments (:result @app-state)))]]
          [:h2 (clojure.string/capitalize (name (:alignment-type @app-state))) " " (name (:sequence-type @app-state)) " alignment score: " (get-in @app-state [:result :score])]])
]
      )
)





;(swap! app-state assoc :top-seq  "HEAGAWGHEE")


(reagent/render-component [home-page]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  (swap! app-state update-in [:__figwheel_counter] inc)

)
