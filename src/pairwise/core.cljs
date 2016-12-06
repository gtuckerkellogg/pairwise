(ns pairwise.core
  (:require [reagent.core :as reagent :refer (atom)]
            [reagent-forms.core :refer [bind-fields init-field value-of]]
            [pairwise.linear :as linear]
            [pairwise.substitution :as sub]
            ;[pairwise.cljsmacros :include-macros true :refer [read-file]]
            )
  (:require-macros [pairwise.cljsmacros :refer [read-file]])
  (:refer-clojure))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce scoring-matrices {
                           :blosum62 (sub/scoring-matrix (read-file "resources/data/BLOSUM62.txt")) 
                           :blosum50 (sub/scoring-matrix (read-file "resources/data/BLOSUM50.txt")) 
                           :pam250 (sub/scoring-matrix (read-file "resources/data/PAM250.txt")) 
                           :pam120 (sub/scoring-matrix (read-file "resources/data/PAM120.txt")) 
                           :pam40 (sub/scoring-matrix (read-file "resources/data/PAM40.txt")) 
                           })

(defonce app-item-id (atom 0))

(defn app-results [app-state]
  (linear/pairwise-align (:top-seq app-state)
                         (:bottom-seq app-state)
                         (get scoring-matrices (:scoring-matrix app-state))
                         (:gap-penalty app-state) :type (:alignment-type app-state)))

(defn draw-arrow [app-state [r c] & {:keys [stroke stroke-width] :or {stroke "gray" stroke-width 2}}]
  (let [x1 (+ 25 (* c 50))
        y1 (+ 25 (* r 50))
        from-seq (get-in app-state [:result :dp-matrix  r c :from])
        xpos (fn [[r c]] (+ 25 (* 50 c)))
        ypos (fn [[r c]] (+ 25 (* 50 r)))
        ]
    (map  #(if-not (nil? %1)
                           [:line { :stroke stroke :stroke-width stroke-width :x1 x1 :x2 (xpos %1) :y1 y1
                      :y2 (ypos %1)}] )  from-seq)))

(defn draw-mask [app-state [r c]]
  (let [x1 (+ 25 (* c 50))
        y1 (+ 25 (* r 50))]
    [:circle {:cx x1 :cy y1 :r 12 :fill "white"}]))

(defn draw-cell [app-state [r c]]
  (let [x (* c 50)
        y (* r 50)
        score (get-in app-state [:result :dp-matrix  r c :score])]
    [:g
     [:rect {:x x :y y :width 50 :height 50 :fill "none" :stroke "gray" :stroke-width 0.2}]
     [:text {:x (+ x  25) :y (+ y 25) :text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana" :font-size "70%" :stroke "black"} score]
     ]
    ))



(defn svg-component [ app-state & args ]
  (let [ij      (for [cols (range (count (get-in app-state [:result :dp-matrix 0])))
                      rows (range (count (get-in app-state [:result :dp-matrix])))]
                  [rows cols])
        cols (count (get-in app-state [:result :dp-matrix 0]))
        rows (count (get-in app-state [:result :dp-matrix]))
        draw-opt (fn [paths] (map #(draw-arrow app-state %1 :stroke "red" :stroke-width 4) paths))
        ]
      [:svg {:width   (str (* cols 50)) 
             :height  (str (* rows 50)) 
         :id    "canvas"
         :style {:outline          "2px solid black"
                 :background-color "#fff"}}
       (map (partial draw-arrow app-state) ij)
       (map draw-opt (:optimal-paths (:result app-state)))
       (map (partial draw-mask app-state) ij)
       (map (partial draw-cell app-state) ij)
       ]))


(defn row [label input]
  [:div.row
   [:div.col-md-4 [:label label]]
   [:div.col-md-8 input]])

(defn input [label type id]
  (row label [:input.form-control {:field type :id id}]))

(def form-template
  [:div [:div {:class "panel panel-primary"}
         [:div.panel-heading "Input sequences"]
         [:div.panel-body
          (input "Top sequence" :text :top-seq)
          (input "Bottom sequence" :text :bottom-seq)]]
   [:div {:class "panel panel-primary"}
    [:div.panel-heading "Algorithm Parameters"]
    [:div.panel-body 


     (row "scoring-matrix"
          [:select.form-control {:field :list :id :scoring-matrix}
           [:option {:key :blosum62} "BLOSUM62"]
           [:option {:key :blosum50} "BLOSUM50"]
           [:option {:key :pam250} "PAM250"]
           [:option {:key :pam120} "PAM120"]
           [:option {:key :pam40} "PAM40"]
           
           ])

     (row [:label
           {:field :label
            :preamble "Linear gap penalty: "
            :placeholder "N/A"
            :id :gap-penalty}]
          [:input.form-control
           {:field :range :min 0 :max 15 :id :gap-penalty}]
          )
     (row "Alignment algorithm" 
          [:div.btn-group {:field :single-select :id :alignment-type}
           [:button.btn.btn-default {:key :global} "Needleman-Wunsch"]
           [:button.btn.btn-default {:key :local} "Smith-Waterman"]])]]])




(defn display-alignment [{:keys [top bottom]}]
  ^{:key (swap! app-item-id inc)} [:p top [:br] bottom [:br] [:br]])

(defn summarize-alignment [{:keys [sequence-type alignment-type result]}]
  [:p (clojure.string/capitalize (name alignment-type)) " "
   (name sequence-type) " alignment score: "
   [:strong (:score result)]])


(def app-state (atom {:top-seq     "HEAGAWGHEE"
                   :bottom-seq     "PAWHEAE"
                   :scoring-matrix :blosum50
                   :gap-penalty          8
                   :sequence-type  :protein
                   :alignment-type :global
                   :scoring-matrix-name "BLOSUM50"
                   }))


(defn page []
  (fn []
    [:div
     [:div.page-header [:h1.text-center "Optimal pairwise sequence alignment" ] ]
     
     [:div.row
      [:div {:class "col-md-4"}
       [:div.row [bind-fields
                  form-template
                  app-state
                  (fn [id value {:keys [top-seq bottom-seq scoring-matrix gap-penalty :alignment-type] :as doc}]
                    (assoc-in doc [:result] (app-results doc)))]]
       [:div.row
        (if (:result @app-state)
          [:div {:class "panel panel-info"}
           [:div.panel-heading {:class "text-center"} [:h4 (summarize-alignment @app-state)]]
           [:div.panel-body
            [:div.row #_(summarize-alignment @app-state)
             [:pre  (map display-alignment (:alignments (:result @app-state)))]
             ]
            ]
          ])
        
        ]]
      [:div {:class "col-md-8"}
       [:div.row
        (if (:result @app-state)
          [:div {:class "text-center" :margin-left "5%"}
           [:div.panel-heading [:h3 "Dynamic programming matrix visualisation"]
            "Paths for optimal alignments are indicated in red"
            ]
           [:div.panel-body
            [:div.row (svg-component @app-state)]]
           ])]]]



     ]))

(reagent/render-component [page]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  (swap! app-state update-in [:__figwheel_counter] inc))
