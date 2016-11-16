(ns pairwise.core
  (:require [reagent.core :as reagent :refer (atom)]
            [pairwise.linear :as linear]
            [pairwise.substitution :as sub]
            [pairwise.cljsmacros :include-macros true :refer [read-file]]))

(enable-console-print!)


;; define your app data so that it doesn't get over-written on reload

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



(defn draw-cell [app-state [i j]]
  (let [x (* i 50)
        y (* j 50)]
      [:g
   [:rect {:x x :y y :width 50 :height 50 :fill "white" :stroke "gray" }]
       [:text {:x (+ x  25) :y (+ y 25) :text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana"} (get-in app-state [:result :dp-matrix  j i :score])]]
    )
  )

(defn svg-component [ app-state & args ]
  (let [ij      (for [cols (range (count (get-in app-state [:result :dp-matrix 0])))
                      rows (range (count (get-in app-state [:result :dp-matrix])))]
                  [rows cols])
        ]
      [:svg {:width   (str (* (count (:top-seq app-state)) 50)) 
         :height  (str (* (count (:bottom-seq app-state)) 50)) 
         :id    "canvas"
         :style {:outline          "2px solid black"
                 :background-color "#fff"}}
       (map (partial draw-cell app-state) ij)
       ;(map-indexed #(identity [:text {:text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana" :x (+ 25 (* 50 %1)) :y 25 } (str %2)]) (seq (:top-seq app-state)))
       ;(map-indexed #(identity [:text {:text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana" :x 25 :y (+ (* 50 %1) 25) } (str %2)]) (seq (:bottom-seq app-state)))
   #_(map str (map-indexed #(identity [:text {:x (* 50 %1) :y 10 } (str %2)]) (seq (:top-seq app-state))))]
    )
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

(defn summarize-alignment [{:keys [sequence-type alignment-type result]}]
  [:h2
   (clojure.string/capitalize (name alignment-type)) " "
   (name sequence-type) " alignment score: "
   (:score result)])


(defn home-page []
  (fn []

        [:div
         (svg-component @app-state)
       [input-sequence :top-seq]
       [input-sequence :bottom-seq]
       [:h3 "scoring matrix: " (:scoring-matrix-name @app-state)
        [:br] "gap penalty: "(:d @app-state)]
         (if (:result @app-state)
           (println (get-in @app-state [:result :dp-matrix 0 1]))
           [:div [:h2
                  [:pre
                     (mapcat display-alignment (:alignments (:result @app-state)))]]
            (summarize-alignment @app-state)])]))


(reagent/render-component [home-page]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  (swap! app-state update-in [:__figwheel_counter] inc)

)
