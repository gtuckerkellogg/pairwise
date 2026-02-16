(ns pairwise.webapp
  (:require [clojure.string :as str]
            [reagent.core :as reagent :refer (atom)]
            [reagent.dom :as rdom]
            [pairwise.alignment :as alignment]
            [pairwise.linear]  ; registers :linear multimethod implementations
            [pairwise.affine] ; registers :affine multimethod implementations
            [pairwise.viz-model :as viz]
            [pairwise.substitution :as sub]
            [pairwise.cljsmacros  :refer-macros [read-file]]))

(enable-console-print!)

(defonce scoring-matrices {
                           :blosum62 {:name "BLOSUM62"
                                      :matrix (sub/read-scoring-matrix (read-file "resources/data/BLOSUM62.txt"))}
                           :blosum50 {:name "BLOSUM50"
                                      :matrix (sub/read-scoring-matrix (read-file "resources/data/BLOSUM50.txt"))}
                           :pam250 {:name "PAM250"
                                    :matrix (sub/read-scoring-matrix (read-file "resources/data/PAM250.txt"))}
                           :pam120 {:name "PAM120"
                                    :matrix (sub/read-scoring-matrix (read-file "resources/data/PAM120.txt"))}
                           :pam40 {:name "PAM40"
                                   :matrix (sub/read-scoring-matrix (read-file "resources/data/PAM40.txt"))
                                   }
                           })

(defonce app-item-id (atom 0))

(def cell-size 50)
(def half-cell (/ cell-size 2))

(defn app-results [app-state]
  (let [scoring-matrix (condp = (:scoring-matrix-type app-state)
                         :simple (sub/simple-substitution-matrix
                                  :protein
                                  :same (:match-score app-state)
                                  :different (:mismatch-score app-state))
                         :standard (get-in scoring-matrices [(:scoring-matrix app-state) :matrix]))
        gap-penalty (if (= :affine (:gap-model app-state))
                      {:d (:gap-open app-state) :e (:gap-extend app-state)}
                      (:gap-penalty app-state))]
    (alignment/pairwise-align (:top-seq app-state)
                              (:bottom-seq app-state)
                              scoring-matrix
                              gap-penalty
                              :type (:alignment-type app-state)
                              :gap-model (:gap-model app-state))))

;; ---------------------------------------------------------------------------
;; IR instruction renderers (SVG / Hiccup)
;; ---------------------------------------------------------------------------

(defmulti render-instruction
  "Render a single IR instruction as Hiccup SVG."
  :type)

(defmethod render-instruction :dp-arrow [{:keys [from-row from-col to-row to-col]}]
  (let [x1 (+ half-cell (* from-col cell-size))
        y1 (+ half-cell (* from-row cell-size))
        x2 (+ half-cell (* to-col cell-size))
        y2 (+ half-cell (* to-row cell-size))]
    [:line {:stroke "gray" :stroke-width 2 :x1 x1 :x2 x2 :y1 y1 :y2 y2}]))

(defmethod render-instruction :path-arrow [{:keys [from-row from-col to-row to-col]}]
  (let [x1 (+ half-cell (* from-col cell-size))
        y1 (+ half-cell (* from-row cell-size))
        x2 (+ half-cell (* to-col cell-size))
        y2 (+ half-cell (* to-row cell-size))]
    [:line {:stroke "red" :stroke-width 4 :x1 x1 :x2 x2 :y1 y1 :y2 y2}]))

(defn- render-mask [{:keys [row col]}]
  (let [cx (+ half-cell (* col cell-size))
        cy (+ half-cell (* row cell-size))]
    [:circle {:cx cx :cy cy :r 12 :fill "white"}]))

(defmethod render-instruction :cell-score [{:keys [row col score] :as inst}]
  (let [x (* col cell-size)
        y (* row cell-size)]
    [:g
     (render-mask inst)
     [:rect {:x x :y y :width cell-size :height cell-size :fill "none" :stroke "gray" :stroke-width 0.2}]
     [:text {:x (+ x half-cell) :y (+ y half-cell) :text-anchor "middle" :alignment-baseline "middle" :font-family "Verdana, Arial, Helvetica, sans-serif" :font-size "70%" :stroke "black"} score]]))

(defmethod render-instruction :seq-label [{:keys [axis index char]}]
  (case axis
    :top  [:text {:x (+ half-cell (* (inc index) cell-size)) :y (- half-cell) :font-size "150%" :text-anchor "middle" :alignment-baseline "middle"} char]
    :left [:text {:y (+ half-cell (* (inc index) cell-size)) :x (- half-cell) :font-size "150%" :text-anchor "middle" :alignment-baseline "middle"} char]))

(defmethod render-instruction :grid [_inst]
  nil)

(defmethod render-instruction :default [_inst]
  nil)

;; ---------------------------------------------------------------------------
;; Affine SVG renderers (called directly with extra args)
;; ---------------------------------------------------------------------------

(def ^:private affine-cell-size 80)

(defn- state-offset
  "Sub-region pixel offset within a cell for the given state."
  [state cs]
  (let [quarter (/ cs 4)]
    (case state
      :X [quarter (- quarter)]
      :M [0 0]
      :Y [(- quarter) quarter])))

(def ^:private state-color {:M "#56B4E9" :X "#E69F00" :Y "#009E73"})

(defn- render-state-scores [{:keys [row col vm vx vy]} cs active-state optimal-cells]
  (let [cx (+ (/ cs 2) (* col cs))
        cy (+ (/ cs 2) (* row cs))
        quarter (/ cs 4)
        mask-r (* cs 0.2)
        font-size (str (* cs 0.20) "px")
        opacity (fn [state] (cond
                              (= active-state :optimal)
                              (if (contains? optimal-cells [row col state]) 1.0 0.3)
                              (or (= active-state :all) (= active-state state)) 1.0
                              :else 0.3))
        mask (fn [val dx dy]
               (when (some? val)
                 [:circle {:cx (+ cx dx) :cy (+ cy dy) :r mask-r :fill "white"}]))
        draw-val (fn [val state dx dy]
                   (when (some? val)
                     [:text {:x (+ cx dx) :y (+ cy dy)
                             :text-anchor "middle" :alignment-baseline "middle"
                             :font-family "Verdana, Arial, Helvetica, sans-serif" :font-size font-size
                             :fill (state-color state)
                             :opacity (opacity state)} val]))]
    [:g
     [:rect {:x (* col cs) :y (* row cs) :width cs :height cs
             :fill "none" :stroke "gray" :stroke-width 0.2}]
     ;; White masks behind scores (rendered before text, after arrows)
     (mask vx quarter (- quarter))
     (mask vm 0 0)
     (mask vy (- quarter) quarter)
     ;; Score text
     (draw-val vx :X quarter (- quarter))
     (draw-val vm :M 0 0)
     (draw-val vy :Y (- quarter) quarter)]))

(defn- render-state-arrow [{:keys [from-row from-col from-state
                                    to-row to-col to-state
                                    arrow-type]} cs active-state]
  (let [[fdx fdy] (state-offset from-state cs)
        [tdx tdy] (state-offset to-state cs)
        half (/ cs 2)
        x1 (+ half (* from-col cs) fdx)
        y1 (+ half (* from-row cs) fdy)
        x2 (+ half (* to-col cs) tdx)
        y2 (+ half (* to-row cs) tdy)
        base-color (state-color from-state)
        opacity (cond
                  (= active-state :optimal) (if (= arrow-type :optimal) 1.0 0.08)
                  (or (= active-state :all) (= active-state from-state)) 1.0
                  :else 0.15)
        width (if (= arrow-type :optimal) 4 1.5)]
    [:line {:stroke base-color :stroke-width width :opacity opacity
            :x1 x1 :x2 x2 :y1 y1 :y2 y2}]))

;; ---------------------------------------------------------------------------
;; Affine seq-label renderer (uses larger cell size)
;; ---------------------------------------------------------------------------

(defn- render-seq-label-with-cs [{:keys [axis index char]} cs]
  (let [half (/ cs 2)]
    (case axis
      :top  [:text {:x (+ half (* (inc index) cs)) :y (- half) :font-size "150%" :text-anchor "middle" :alignment-baseline "middle"} char]
      :left [:text {:y (+ half (* (inc index) cs)) :x (- half) :font-size "150%" :text-anchor "middle" :alignment-baseline "middle"} char])))

;; ---------------------------------------------------------------------------
;; SVG component — renders IR in correct visual layer order
;; ---------------------------------------------------------------------------

(defn svg-component [app-state & _args]
  (let [model (viz/alignment->instructions (:result app-state))
        {:keys [rows cols]} (:dimensions model)
        instructions (:instructions model)
        by-type (group-by :type instructions)
        affine? (seq (:state-scores by-type))
        cs (if affine? affine-cell-size cell-size)
        active-state (or (:active-state app-state) :all)
        optimal-cells (when (= active-state :optimal)
                        (into #{}
                              (mapcat (fn [{:keys [from-row from-col from-state
                                                   to-row to-col to-state]}]
                                        [[from-row from-col from-state]
                                         [to-row to-col to-state]]))
                              (filter #(= :optimal (:arrow-type %))
                                      (:state-arrow by-type))))]
    [:svg {:width   "80%"
           :height  "50%"
           :viewBox (print-str (- cs) (- cs) (str (* (inc cols) cs)) (str (* (inc rows) cs)))
           :id    "canvas"
           :style {:background-color "#fff"}}
     [:rect {:x 0 :y 0 :width (* cs cols) :height (* cs rows) :fill "none" :stroke "black" :stroke-width 1}]
     (if affine?
       (list
        (map #(render-state-arrow % cs active-state) (:state-arrow by-type))
        (map #(render-state-scores % cs active-state optimal-cells) (:state-scores by-type))
        (map #(render-seq-label-with-cs % cs) (:seq-label by-type)))
       (list
        (map render-instruction (:dp-arrow by-type))
        (map render-instruction (:path-arrow by-type))
        (map render-instruction (:cell-score by-type))
        (map render-instruction (:seq-label by-type))))]))

;; ---------------------------------------------------------------------------
;; Form components (unchanged)
;; ---------------------------------------------------------------------------

(defn row [label input]
  [:div.row
   [:div.col-md-4  [:label label]]
   [:div.col-md-8 input]])

(defn update-state! [app-state key value]
  (swap! app-state assoc key value)
  (swap! app-state assoc :result (app-results @app-state)))

(defn form-component [app-state]
  (let [state @app-state]
    [:div
     [:div {:class "panel panel-primary"}
      [:div.panel-heading (str "Input sequences (up to " (if (= :affine (:gap-model state)) 7 10) " letters)")]
      [:div.panel-body
       (row "TOP sequence"
            [:input.form-control {:type "text"
                                  :value (:top-seq state)
                                  :max-length (if (= :affine (:gap-model state)) 7 10)
                                  :on-change #(update-state! app-state :top-seq
                                                           (sub/sanitise (-> % .-target .-value)))}])

       (row "BOTTOM sequence"
            [:input.form-control {:type "text"
                                  :value (:bottom-seq state)
                                  :max-length (if (= :affine (:gap-model state)) 7 10)
                                  :on-change #(update-state! app-state :bottom-seq
                                                           (sub/sanitise (-> % .-target .-value)))}])]]

     [:div {:class "panel panel-primary"}
      [:div.panel-heading "Alignment type"]
      [:div.panel-body
       [:div.btn-group
        [:button.btn.btn-default {:class (when (= :global (:alignment-type state)) "active")
                                  :on-click #(update-state! app-state :alignment-type :global)}
         "Needleman-Wunsch"]
        [:button.btn.btn-default {:class (when (= :local (:alignment-type state)) "active")
                                  :on-click #(update-state! app-state :alignment-type :local)}
         "Smith-Waterman"]]]]

     [:div {:class "panel panel-primary"}
      [:div.panel-heading "Algorithm Parameters"]
      [:div.panel-body

       [:div.row
        [:div.col-md-4 {:vertical-align "middle"} [:label  "Scoring Matrix"]]
        [:div.col-md-8
         [:div
          [:label
           [:input {:type "radio"
                    :name "scoring-matrix-type"
                    :value "simple"
                    :checked (= :simple (:scoring-matrix-type state))
                    :on-change #(update-state! app-state :scoring-matrix-type :simple)}]
           " User-defined"]]
         [:div
          [:label
           [:input {:type "radio"
                    :name "scoring-matrix-type"
                    :value "standard"
                    :checked (= :standard (:scoring-matrix-type state))
                    :on-change #(update-state! app-state :scoring-matrix-type :standard)}]
           " Standard"]]]]

       (when (= :simple (:scoring-matrix-type state))
         [:div.form-group
          (row [:label "match: " (:match-score state)]
               [:input.form-control
                {:type "range" :min 0 :max 15
                 :value (:match-score state)
                 :on-change #(update-state! app-state :match-score
                                          (js/parseInt (-> % .-target .-value)))}])
          (row [:label "mismatch: " (:mismatch-score state)]
               [:input.form-control
                {:type "range" :min -10 :max 0
                 :value (:mismatch-score state)
                 :on-change #(update-state! app-state :mismatch-score
                                          (js/parseInt (-> % .-target .-value)))}])])

       (when (= :standard (:scoring-matrix-type state))
         [:select.form-control {:value (:scoring-matrix state)
                                :on-change #(update-state! app-state :scoring-matrix
                                                         (keyword (-> % .-target .-value)))}
          (map (fn [[k v]] [:option {:key k :value k} (:name v)]) scoring-matrices)])

       [:div.row
        [:div.col-md-4 [:label "Gap Model"]]
        [:div.col-md-8
         [:div.btn-group
          [:button.btn.btn-default {:class (when (= :linear (:gap-model state)) "active")
                                    :on-click #(update-state! app-state :gap-model :linear)}
           "Linear"]
          [:button.btn.btn-default {:class (when (= :affine (:gap-model state)) "active")
                                    :on-click #(update-state! app-state :gap-model :affine)}
           "Affine"]]]]

       (if (= :affine (:gap-model state))
         [:div
          (row [:label "Gap open (d): " (:gap-open state)]
               [:input.form-control
                {:type "range" :min 1 :max 20
                 :value (:gap-open state)
                 :on-change #(update-state! app-state :gap-open
                                           (js/parseInt (-> % .-target .-value)))}])
          (row [:label "Gap extend (e): " (:gap-extend state)]
               [:input.form-control
                {:type "range" :min 1 :max 10
                 :value (:gap-extend state)
                 :on-change #(update-state! app-state :gap-extend
                                           (js/parseInt (-> % .-target .-value)))}])]
         (row [:label "Linear gap penalty: " (:gap-penalty state)]
              [:input.form-control
               {:type "range" :min 0 :max 15
                :value (:gap-penalty state)
                :on-change #(update-state! app-state :gap-penalty
                                         (js/parseInt (-> % .-target .-value)))}]))]]]))

(defn display-alignment [{:keys [top bottom]}]
  ^{:key (swap! app-item-id inc)} [:p top [:br] bottom [:br] [:br]])

(defn summarize-alignment [{:keys [sequence-type alignment-type result]}]
  [:span (str/capitalize (name alignment-type)) " "
   (name sequence-type) " alignment score: "
   [:strong (:score result)]])


(defn color-legend []
  [:div {:style {:margin-bottom "10px" :font-size "14px"}}
   "State-aware arrows: "
   (for [[state label] [[:M "V'M"] [:X "V'X"] [:Y "V'Y"]]]
     ^{:key state}
     [:span {:style {:margin-right "15px"}}
      [:span {:style {:display "inline-block"
                      :width "12px"
                      :height "12px"
                      :background-color (state-color state)
                      :border "1px solid #666"
                      :margin-right "4px"
                      :vertical-align "middle"}}]
      label])])

(defn state-toggle [app-state]
  (let [active (or (:active-state @app-state) :all)]
    [:div.btn-group {:style {:margin-bottom "10px"}}
     (for [s [:all :M :X :Y :optimal]
           :let [label (case s :all "All" :optimal "Optimal" (str "V'" (name s)))]]
       ^{:key s}
       [:button.btn.btn-sm.btn-default
        {:class (when (= active s) "active")
         :on-click #(swap! app-state assoc :active-state s)}
        label])]))

(defn page []
  (let [app-state (atom {:top-seq     "HEAGAWGHEE"
                         :bottom-seq     "PAWHEAE"
                         :scoring-matrix :blosum50
                         :scoring-matrix-type :standard
                         :gap-penalty          8
                         :gap-model            :linear
                         :gap-open             12
                         :gap-extend           2
                         :sequence-type  :protein
                         :alignment-type :global
                         :match-score     5
                         :mismatch-score -3
                         })]
    (swap! app-state assoc :result (app-results @app-state))
    (fn []
      [:div
       [:div.page-header [:h1.text-center "Optimal pairwise sequence alignment" ] ]

       [:div.row
        [:div {:class "col-md-4"}
         [:div.row [form-component app-state]]
         [:div.row
          (when (:result @app-state)
            [:div {:class "panel panel-info"}
             [:div.panel-heading {:class "text-center"} (summarize-alignment @app-state)]
             [:div.panel-body
              [:div.row
               [:pre  (map display-alignment (:alignments (:result @app-state)))]
               ]
              ]
             ])

          ]]
        [:div {:class "col-md-8"}
         [:div.row
          (when (:result @app-state)
            [:div {:class "text-center" :margin-left "5%"}
             [:div.panel-heading [:h3 "Dynamic programming matrix visualisation"]
              (if (= :affine (:gap-model @app-state))
                [color-legend]
                "Paths for optimal alignments are indicated in red")]
             (when (= :affine (:gap-model @app-state))
               [state-toggle app-state])
             [:div.panel-body
              [:div.row (svg-component @app-state)]]
             ])]]
        ]



       ])))

(defn init []
  (rdom/render [page]
               (. js/document (getElementById "app"))))

(defn ^:dev/after-load reload []
  (init))
