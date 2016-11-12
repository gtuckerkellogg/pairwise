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

(let [S  (sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt"))
      s1 "HEAGAWGHEE"
      s2 "PAWHEAEE"
      d 8]
      (def app-state (
                          atom {:top-seq s1
                                :bottom-seq s2
                                :scoring-matrix S
                                :d d}))
  )

(defonce BLOSUM62 (sub/scoring-matrix (read-file "resources/data/BLOSUM62.txt")) )
(defonce BLOSUM50 (sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt")) )


(defn update-s1! [s]
  (swap! app-state assoc [:top-seq] s))

(defn input-sequence [which-seq]
  (let [val (atom "")]
    (fn []
      [:div
       [:input {:type "text"
                :placeholder "Input Sequence"
                :value @val
                :on-change (fn [evt]
                             (reset! val (-> evt .-target .-value))
                             (swap! app-state assoc which-seq  @val)                             
                             )}]
])))

(defn display-alignment [{:keys [top bottom]}]
  (str top ", " bottom))


(defn home-page []
  (let [email-address (atom nil)]
    (fn []
      [:div
       [input-sequence :top-seq]
       [input-sequence :bottom-seq]
       [:h1 (:top-seq @app-state)]
       [:h1 (:bottom-seq @app-state)]
       [:h2 (:alignments (linear/pairwise-align (:top-seq @app-state)
                                                (:bottom-seq @app-state)
                                                (:scoring-matrix @app-state)
                                                (:d @app-state) :type :global))]
]
      )))



(defn bioseq-input
  []
  [:div])



;(swap! app-state assoc :top-seq  "HEAGAWGHEE")


(reagent/render-component [home-page]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  (swap! app-state update-in [:__figwheel_counter] inc)

)
