(ns pairwise.core
  (:require [reagent.core :as reagent :refer (atom)]
            [reagent-forms.core :refer [bind-fields init-field value-of]]
            [pairwise.linear :as linear]
            [pairwise.substitution :as sub]
            [pairwise.cljsmacros :include-macros true :refer [read-file]])
  (:refer-clojure))

(enable-console-print!)


;; define your app data so that it doesn't get over-written on reload

(defn app-results [app-state]
  (linear/pairwise-align (:top-seq app-state)
                         (:bottom-seq app-state)
                         (:scoring-matrix app-state)
                         (:d app-state) :type (:alignment-type app-state)))

(defonce BLOSUM62 (sub/scoring-matrix (read-file "resources/data/BLOSUM62.txt")) )
(defonce BLOSUM50 (sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt")) )

(defonce app-item-id (atom 0))

(let [S  BLOSUM62
      s1 "HEAGAWGHEE"
      s2 "PAWHEAE"
      d  8]
  (def app-state (atom {:top-seq        s1
                            :bottom-seq     s2
                            :scoring-matrix BLOSUM50
                            :sequence-type  :protein
                            :alignment-type :global
                            :scoring-matrix-name "BLOSUM50"
                            :d              d
                            ;:result (app-results @app-state)
                            }))
      )


(defn draw-arrow [app-state [c r]]
  (let [x1 (+ 25 (* c 50))
        y1 (+ 25 (* r 50))
        from-seq (get-in app-state [:result :dp-matrix  r c :from])
        xpos (fn [[r c]] (+ 25 (* 50 c)))
        ypos (fn [[r c]] (+ 25 (* 50 r)))
        ]
    (map  #(if-not (nil? %1)
                           [:line { :stroke "gray" :stroke-width 2 :x1 x1 :x2 (xpos %1) :y1 y1
                      :y2 (ypos %1)}] )  from-seq)))

(defn draw-mask [app-state [c r]]
  (let [x1 (+ 25 (* c 50))
        y1 (+ 25 (* r 50))]
    [:circle {:cx x1 :cy y1 :r 12 :fill "white"}]))

(defn draw-cell [app-state [c r]]
  (let [x (* c 50)
        y (* r 50)
        score (get-in app-state [:result :dp-matrix  r c :score])]
    [:g
     [:rect {:x x :y y :width 50 :height 50 :fill "none" :stroke "gray" :stroke-width 0.2}]
     [:text {:x (+ x  25) :y (+ y 25) :text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana" :font-size "70%" :stroke "black"} score]
     ]
    )
  )



(defn svg-component [ app-state & args ]
  (let [ij      (for [cols (range (count (get-in app-state [:result :dp-matrix 0])))
                      rows (range (count (get-in app-state [:result :dp-matrix])))]
                  [cols rows])
        cols (count (get-in app-state [:result :dp-matrix 0]))
        rows (count (get-in app-state [:result :dp-matrix]))]

      [:svg {:width   (str (* cols 50)) 
             :height  (str (* rows 50)) 
         :id    "canvas"
         :style {:outline          "2px solid black"
                 :background-color "#fff"}}
       (map (partial draw-arrow app-state) ij)
       (map (partial draw-mask app-state) ij)
       (map (partial draw-cell app-state) ij)
       ]))



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

(defn row [label input]
  [:div.row
   [:div.col-md-2 [:label label]]
   [:div.col-md-5 input]])

(defn display-alignment [{:keys [top bottom]}]
  ^{:key (swap! app-item-id inc)} [:p top [:br] bottom [:br] [:br]])

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

           [:div [:h2
                  [:pre
                     (map display-alignment (:alignments (:result @app-state)))]]
            (summarize-alignment @app-state)])]))


(reagent/render-component [home-page]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  (swap! app-state update-in [:__figwheel_counter] inc)

)
