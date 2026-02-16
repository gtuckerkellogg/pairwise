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
;; Form components
;; ---------------------------------------------------------------------------

(defn help-toggle
  "A (?) icon that toggles inline help text."
  [_text]
  (let [show? (reagent/atom false)]
    (fn [text]
      [:span
       [:button {:class "ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-nus-navy text-white text-xs hover:bg-nus-orange transition-colors cursor-pointer"
                 :on-click #(do (.stopPropagation %) (swap! show? not))}
        "?"]
       (when @show?
         [:div {:class "mt-2 mb-2 p-3 bg-blue-50 rounded text-sm text-gray-700 leading-relaxed font-normal"}
          text])])))

(defn- toggle-btn
  "A toggle button for use in button groups."
  [label active? on-click]
  [:button {:class (str "px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer "
                        (if active?
                          "bg-nus-navy text-white border-nus-navy"
                          "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"))
            :on-click on-click}
   label])

(defn row [label input]
  [:div {:class "flex items-center gap-4 mb-3"}
   [:div {:class "w-1/3 text-sm font-medium text-gray-700"} [:label label]]
   [:div {:class "w-2/3"} input]])

(defn update-state! [app-state key value]
  (swap! app-state assoc key value)
  (swap! app-state assoc :result (app-results @app-state)))

(defn form-component [app-state]
  (let [state @app-state
        input-cls "w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-nus-navy focus:border-nus-navy"]
    [:div
     ;; --- Input sequences ---
     [:div {:class "rounded-lg border border-nus-navy overflow-hidden mb-4"}
      [:div {:class "bg-nus-navy text-white px-4 py-2 text-sm font-semibold"}
       (str "Input sequences (up to " (if (= :affine (:gap-model state)) 7 10) " letters)")]
      [:div {:class "px-4 py-3"}
       (row "TOP sequence"
            [:input {:class input-cls
                     :type "text"
                     :value (:top-seq state)
                     :max-length (if (= :affine (:gap-model state)) 7 10)
                     :on-change #(update-state! app-state :top-seq
                                                (sub/sanitise (-> % .-target .-value)))}])
       (row "BOTTOM sequence"
            [:input {:class input-cls
                     :type "text"
                     :value (:bottom-seq state)
                     :max-length (if (= :affine (:gap-model state)) 7 10)
                     :on-change #(update-state! app-state :bottom-seq
                                                (sub/sanitise (-> % .-target .-value)))}])]]

     ;; --- Alignment type ---
     [:div {:class "rounded-lg border border-nus-navy overflow-hidden mb-4"}
      [:div {:class "bg-nus-navy text-white px-4 py-2 text-sm font-semibold"}
       "Alignment type"
       [help-toggle
        "Global alignment (Needleman-Wunsch) finds the best end-to-end alignment(s) of both complete sequences. Local alignment (Smith-Waterman) finds the highest-scoring subsequence pair(s) \u2014 useful when only part of the sequences are related. When multiple paths through the matrix achieve the same optimal score, all optimal alignments are reported."]]
      [:div {:class "px-4 py-3"}
       [:div {:class "inline-flex rounded-md shadow-sm overflow-hidden"}
        (toggle-btn "Needleman-Wunsch" (= :global (:alignment-type state))
                    #(update-state! app-state :alignment-type :global))
        (toggle-btn "Smith-Waterman" (= :local (:alignment-type state))
                    #(update-state! app-state :alignment-type :local))]]]

     ;; --- Algorithm parameters ---
     [:div {:class "rounded-lg border border-nus-navy overflow-hidden mb-4"}
      [:div {:class "bg-nus-navy text-white px-4 py-2 text-sm font-semibold"} "Algorithm Parameters"]
      [:div {:class "px-4 py-3"}

       ;; Scoring matrix type
       [:div {:class "flex items-start gap-4 mb-3"}
        [:div {:class "w-1/3 text-sm font-medium text-gray-700 pt-1"}
         [:label "Scoring Matrix"]
         [help-toggle
          (if (= :standard (:scoring-matrix-type state))
            "Substitution matrices like BLOSUM and PAM encode the evolutionary likelihood of one amino acid replacing another. Higher BLOSUM numbers (e.g., 62 vs 50) are tuned for more closely related sequences."
            "A simple match/mismatch scheme: identical residues score the match value, different residues score the mismatch value (typically negative).")]]
        [:div {:class "w-2/3"}
         [:label {:class "flex items-center gap-2 text-sm mb-1 cursor-pointer"}
          [:input {:type "radio"
                   :name "scoring-matrix-type"
                   :value "simple"
                   :checked (= :simple (:scoring-matrix-type state))
                   :on-change #(update-state! app-state :scoring-matrix-type :simple)}]
          "User-defined"]
         [:label {:class "flex items-center gap-2 text-sm cursor-pointer"}
          [:input {:type "radio"
                   :name "scoring-matrix-type"
                   :value "standard"
                   :checked (= :standard (:scoring-matrix-type state))
                   :on-change #(update-state! app-state :scoring-matrix-type :standard)}]
          "Standard"]]]

       ;; Simple matrix sliders
       (when (= :simple (:scoring-matrix-type state))
         [:div {:class "mb-3"}
          (row [:label "match: " (:match-score state)]
               [:input {:class "w-full" :type "range" :min 0 :max 15
                        :value (:match-score state)
                        :on-change #(update-state! app-state :match-score
                                                   (js/parseInt (-> % .-target .-value)))}])
          (row [:label "mismatch: " (:mismatch-score state)]
               [:input {:class "w-full" :type "range" :min -10 :max 0
                        :value (:mismatch-score state)
                        :on-change #(update-state! app-state :mismatch-score
                                                   (js/parseInt (-> % .-target .-value)))}])])

       ;; Standard matrix selector
       (when (= :standard (:scoring-matrix-type state))
         [:div {:class "mb-3"}
          [:select {:class input-cls
                    :value (:scoring-matrix state)
                    :on-change #(update-state! app-state :scoring-matrix
                                               (keyword (-> % .-target .-value)))}
           (map (fn [[k v]] [:option {:key k :value k} (:name v)]) scoring-matrices)]])

       ;; Gap model
       [:div {:class "flex items-center gap-4 mb-3"}
        [:div {:class "w-1/3 text-sm font-medium text-gray-700"}
         [:label "Gap Model"]
         [help-toggle
          "Linear: each gap position costs the same penalty d. A gap of length k costs k\u00d7d. Affine: opening a new gap costs d, extending it costs e per position. A gap of length k costs d + (k\u22121)\u00d7e. This reflects the biological observation that insertions and deletions tend to occur in contiguous blocks."]]
        [:div {:class "w-2/3"}
         [:div {:class "inline-flex rounded-md shadow-sm overflow-hidden"}
          (toggle-btn "Linear" (= :linear (:gap-model state))
                      #(update-state! app-state :gap-model :linear))
          (toggle-btn "Affine" (= :affine (:gap-model state))
                      #(update-state! app-state :gap-model :affine))]]]

       ;; Gap parameters
       (if (= :affine (:gap-model state))
         [:div
          [:div {:class "mb-1"}
           [help-toggle "Larger d (gap open) relative to e (gap extend) discourages opening new gaps but tolerates longer ones. Try adjusting these to see how the optimal path changes."]]
          (row [:label "Gap open (d): " (:gap-open state)]
               [:input {:class "w-full" :type "range" :min 1 :max 20
                        :value (:gap-open state)
                        :on-change #(update-state! app-state :gap-open
                                                   (js/parseInt (-> % .-target .-value)))}])
          (row [:label "Gap extend (e): " (:gap-extend state)]
               [:input {:class "w-full" :type "range" :min 1 :max 10
                        :value (:gap-extend state)
                        :on-change #(update-state! app-state :gap-extend
                                                   (js/parseInt (-> % .-target .-value)))}])]
         (row [:label "Linear gap penalty: " (:gap-penalty state)]
              [:input {:class "w-full" :type "range" :min 0 :max 15
                       :value (:gap-penalty state)
                       :on-change #(update-state! app-state :gap-penalty
                                                  (js/parseInt (-> % .-target .-value)))}]))]]]))

(defn display-alignment [{:keys [top bottom]}]
  ^{:key (swap! app-item-id inc)}
  [:p {:class "font-mono text-sm"} top [:br] bottom [:br] [:br]])

(defn summarize-alignment [{:keys [sequence-type alignment-type result]}]
  [:span (str/capitalize (name alignment-type)) " "
   (name sequence-type) " alignment score: "
   [:strong (:score result)]])

(defn color-legend []
  [:div {:class "mb-2 text-sm flex items-center gap-4"}
   [:span "State-aware arrows:"]
   (for [[state label] [[:M "V'M"] [:X "V'X"] [:Y "V'Y"]]]
     ^{:key state}
     [:span {:class "flex items-center gap-1"}
      [:span {:class "inline-block w-3 h-3 border border-gray-500"
              :style {:background-color (state-color state)}}]
      label])])

(defn state-toggle [app-state]
  (let [active (or (:active-state @app-state) :all)]
    [:div {:class "inline-flex rounded-md shadow-sm overflow-hidden mb-3"}
     (for [s [:all :M :X :Y :optimal]
           :let [label (case s :all "All" :optimal "Optimal" (str "V'" (name s)))]]
       ^{:key s}
       (toggle-btn label (= active s)
                   #(swap! app-state assoc :active-state s)))]))

;; ---------------------------------------------------------------------------
;; Collapsible sections
;; ---------------------------------------------------------------------------

(defn collapsible
  "Collapsible section. title is a string, open? is initial state, body is hiccup."
  [title open? & _body]
  (let [expanded (reagent/atom open?)]
    (fn [title _open? & body]
      [:div {:class "mb-6 rounded-lg border border-gray-200 overflow-hidden"}
       [:button {:class "w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left font-semibold text-nus-navy transition-colors cursor-pointer"
                 :on-click #(swap! expanded not)}
        [:span title]
        [:span {:class (str "transform transition-transform duration-200 "
                            (when @expanded "rotate-180"))} "\u25be"]]
       (when @expanded
         [:div {:class "px-4 py-3 border-t border-gray-200 text-sm text-gray-700 leading-relaxed"}
          (into [:<>] body)])])))

;; ---------------------------------------------------------------------------
;; Introduction section
;; ---------------------------------------------------------------------------

(defn introduction-section []
  [collapsible "About this tool" true
   [:div
    [:p {:class "mb-3"}
     "Pairwise alignment compares two biological sequences to identify regions of similarity. "
     "Using dynamic programming, we fill a scoring matrix where each cell represents the best "
     "alignment score up to that point. The optimal alignment(s) are found by tracing back "
     "through the matrix \u2014 when multiple paths achieve the same score, all optimal alignments "
     "are reported."]
    [:p {:class "mb-3"}
     "Two classical algorithms solve this problem: "
     [:strong "Needleman-Wunsch"] " (1970) for global alignment (comparing sequences end-to-end) and "
     [:strong "Smith-Waterman"] " (1981) for local alignment (finding the highest-scoring subsequence pair). "
     "Both can use either a simple " [:strong "linear gap penalty"] " or the more realistic "
     [:strong "affine gap model"] " (Gotoh, 1982), which distinguishes between opening and extending a gap."]
    [:p {:class "mb-3 italic text-gray-500"}
     "The default sequences (HEAGAWGHEE / PAWHEAE) and BLOSUM50 matrix reproduce the example "
     "from Durbin et al. (1998), Ch. 2."]
    [collapsible "Why align sequences?" false
     [:p {:class "mb-3"}
      "Sequence similarity often implies shared evolutionary origin (homology). "
      "Aligning protein or DNA sequences reveals conserved regions that may share function "
      "or structure. Pairwise alignment is the foundation of database search tools like "
      "BLAST and FASTA, multiple sequence alignment, and phylogenetic analysis."]
     [:p
      "The dynamic programming approach guarantees finding the mathematically optimal "
      "alignment(s) given a scoring scheme \u2014 unlike heuristic methods that trade optimality "
      "for speed."]]]])

;; ---------------------------------------------------------------------------
;; Algorithm details (reactive to tool state)
;; ---------------------------------------------------------------------------

(defn- math-span
  "Render text in a math-styled font."
  [& children]
  (into [:span {:class "math-block"}] children))

(defn- recurrence-block
  "A styled block for displaying a recurrence relation."
  [content & {:keys [highlight?] :or {highlight? true}}]
  [:div {:class (str "font-mono text-sm p-3 rounded mb-2 "
                     (if highlight?
                       "bg-gray-100 border border-gray-200"
                       "bg-gray-50 border border-gray-100 opacity-50"))}
   content])

(defn- algorithm-details-linear [app-state]
  (let [global? (= :global (:alignment-type @app-state))]
    [:div
     [:p {:class "mb-3 text-sm text-gray-700 leading-relaxed"}
      (if global?
        "The Needleman-Wunsch algorithm fills the entire matrix to find the best global alignment. Each cell F(i,j) represents the optimal score for aligning the first i residues of one sequence with the first j residues of the other."
        "The Smith-Waterman algorithm modifies the global recurrence by adding zero as an option \u2014 allowing alignments to start anywhere. Traceback begins at the highest-scoring cell(s) and stops when a zero is reached.")]
     [collapsible "Recurrence relation" false
      (if global?
        [:div
         [:p {:class "mb-2 text-sm text-gray-600"} "Initialization:"]
         [recurrence-block
          [:div
           [:div "F(i, 0) = \u2212i \u00d7 d"]
           [:div "F(0, j) = \u2212j \u00d7 d"]]]
         [:p {:class "mb-2 text-sm text-gray-600"} "Recurrence:"]
         [recurrence-block
          [:div
           [:div "F(i, j) = max {"]
           [:div {:class "pl-8"} "F(i\u22121, j\u22121) + s(x" [:sub "i"] ", y" [:sub "j"] "),"]
           [:div {:class "pl-8"} "F(i\u22121, j) \u2212 d,"]
           [:div {:class "pl-8"} "F(i, j\u22121) \u2212 d"]
           [:div "}"]]]]
        [:div
         [:p {:class "mb-2 text-sm text-gray-600"} "Initialization:"]
         [recurrence-block
          [:div
           [:div "F(i, 0) = 0"]
           [:div "F(0, j) = 0"]]]
         [:p {:class "mb-2 text-sm text-gray-600"} "Recurrence:"]
         [recurrence-block
          [:div
           [:div "F(i, j) = max {"]
           [:div {:class "pl-8"} "0,"]
           [:div {:class "pl-8"} "F(i\u22121, j\u22121) + s(x" [:sub "i"] ", y" [:sub "j"] "),"]
           [:div {:class "pl-8"} "F(i\u22121, j) \u2212 d,"]
           [:div {:class "pl-8"} "F(i, j\u22121) \u2212 d"]
           [:div "}"]]]])]]))

(defn- affine-recurrence-vm
  "V'M recurrence block."
  [global? highlight?]
  [:div {:class "mb-4"}
   [:h4 {:class (str "text-sm font-semibold mb-1 " (if highlight? "text-gray-800" "text-gray-400"))}
    [:span {:style {:color (when highlight? "#56B4E9")}} "V\u2032M"]
    " \u2014 match/mismatch state"]
   (when highlight?
     [:p {:class "text-sm text-gray-600 mb-2"}
      "V\u2032M(i,j) represents the best alignment score ending with residues x"
      [:sub "i"] " and y" [:sub "j"]
      " aligned (matched or mismatched). It can transition from any of the three states."])
   [recurrence-block
    [:div
     (when (not global?)
       [:div {:class "mb-1"} "V\u2032M(i, j) = max {"])
     (when global?
       [:div "V\u2032M(i, j) = max {"])
     (when (not global?)
       [:div {:class "pl-8"} "0,"])
     [:div {:class "pl-8"} "V\u2032M(i\u22121, j\u22121),"]
     [:div {:class "pl-8"} "V\u2032X(i\u22121, j\u22121),"]
     [:div {:class "pl-8"} "V\u2032Y(i\u22121, j\u22121)"]
     [:div "} + s(x" [:sub "i"] ", y" [:sub "j"] ")"]]
    :highlight? highlight?]])

(defn- affine-recurrence-vx
  "V'X recurrence block."
  [global? highlight?]
  [:div {:class "mb-4"}
   [:h4 {:class (str "text-sm font-semibold mb-1 " (if highlight? "text-gray-800" "text-gray-400"))}
    [:span {:style {:color (when highlight? "#E69F00")}} "V\u2032X"]
    " \u2014 gap in top sequence"]
   (when highlight?
     [:p {:class "text-sm text-gray-600 mb-2"}
      "V\u2032X(i,j) represents the best score ending with a gap in the top sequence (deletion). "
      "Opening a new gap from state M costs d; extending an existing gap costs e."])
   [recurrence-block
    [:div
     [:div "V\u2032X(i, j) = max {"]
     [:div {:class "pl-8"} "V\u2032M(i\u22121, j) \u2212 d,"]
     [:div {:class "pl-8"} "V\u2032X(i\u22121, j) \u2212 e"]
     [:div "}"]]
    :highlight? highlight?]])

(defn- affine-recurrence-vy
  "V'Y recurrence block."
  [global? highlight?]
  [:div {:class "mb-4"}
   [:h4 {:class (str "text-sm font-semibold mb-1 " (if highlight? "text-gray-800" "text-gray-400"))}
    [:span {:style {:color (when highlight? "#009E73")}} "V\u2032Y"]
    " \u2014 gap in bottom sequence"]
   (when highlight?
     [:p {:class "text-sm text-gray-600 mb-2"}
      "V\u2032Y(i,j) represents the best score ending with a gap in the bottom sequence (insertion). "
      "Opening a new gap from state M costs d; extending an existing gap costs e."])
   [recurrence-block
    [:div
     [:div "V\u2032Y(i, j) = max {"]
     [:div {:class "pl-8"} "V\u2032M(i, j\u22121) \u2212 d,"]
     [:div {:class "pl-8"} "V\u2032Y(i, j\u22121) \u2212 e"]
     [:div "}"]]
    :highlight? highlight?]])

(defn- algorithm-details-affine [app-state]
  (let [active (or (:active-state @app-state) :all)
        global? (= :global (:alignment-type @app-state))
        highlight? (fn [state]
                     (or (= active :all) (= active state)))]
    [:div
     ;; Conceptual summary
     [:p {:class "mb-3 text-sm text-gray-700 leading-relaxed"}
      (case active
        :optimal
        "The optimal alignment is found by tracing back through the state-expanded graph, where each cell has three nodes (one per state). The path can transition between states, reflecting gap openings and closings. All paths achieving the optimal score are shown."
        ;; default for :all and individual states
        (str "The affine gap model uses three matrices that track the best score arriving via different states: "
             "V\u2032M (last columns matched), V\u2032X (gap in top sequence), V\u2032Y (gap in bottom sequence). "
             (when (not global?)
               "For local alignment, each state also includes 0 as an option, allowing alignments to begin anywhere. ")
             "The gap opening penalty d is applied when transitioning from M to a gap state, "
             "while the extension penalty e is applied when continuing in a gap state."))]

     ;; Recurrences — all three shown, with highlighting based on active state
     (when (not= active :optimal)
       [collapsible "Recurrence relations" (not= active :all)
        [affine-recurrence-vm global? (highlight? :M)]
        [affine-recurrence-vx global? (highlight? :X)]
        [affine-recurrence-vy global? (highlight? :Y)]])]))

(defn algorithm-details [app-state]
  (case (:gap-model @app-state)
    :linear  [algorithm-details-linear app-state]
    :affine  [algorithm-details-affine app-state]
    nil))

;; ---------------------------------------------------------------------------
;; Page layout
;; ---------------------------------------------------------------------------

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
                         :mismatch-score -3})]
    (swap! app-state assoc :result (app-results @app-state))
    (fn []
      [:div {:class "flex flex-col min-h-screen"}
       ;; Header
       [:header {:class "bg-nus-navy text-white py-8"}
        [:div {:class "max-w-6xl mx-auto px-4 text-center"}
         [:h1 {:class "text-3xl font-bold"} "Pairwise Sequence Alignment"]
         [:p {:class "mt-2 text-lg text-blue-200"}
          "Interactive visualization of dynamic programming alignment algorithms"]]]

       ;; Main content
       [:main {:class "max-w-6xl mx-auto px-4 py-8 flex-1 w-full"}
        [introduction-section]
        ;; Tool: controls + visualization
        [:div {:class "flex flex-col md:flex-row gap-6"}
         ;; Left: controls + results
         [:div {:class "md:w-1/3"}
          [form-component app-state]
          (when (:result @app-state)
            [:div {:class "rounded-lg border border-nus-orange overflow-hidden"}
             [:div {:class "bg-nus-orange-light text-nus-navy px-4 py-2 text-center font-semibold text-sm"}
              (summarize-alignment @app-state)]
             [:div {:class "px-4 py-3"}
              [:pre {:class "text-sm whitespace-pre-wrap"}
               (map display-alignment (:alignments (:result @app-state)))]]])]

         ;; Right: visualization
         [:div {:class "md:w-2/3"}
          (when (:result @app-state)
            [:div {:class "text-center"}
             [:h3 {:class "text-lg font-semibold text-gray-800 mb-2"}
              "Dynamic programming matrix visualisation"]
             (if (= :affine (:gap-model @app-state))
               [color-legend]
               [:p {:class "text-sm text-gray-600 mb-2"}
                "Paths for optimal alignments are indicated in red"])
             (when (= :affine (:gap-model @app-state))
               [state-toggle app-state])
             [:div (svg-component @app-state)]])]]

        ;; Algorithm details (below the tool)
        [:div {:class "mt-8"}
         [algorithm-details app-state]]]

       ;; Footer
       [:footer {:class "mt-12 py-6 border-t border-gray-200 text-center text-sm text-gray-500"}
        [:p "Created by "
         [:a {:href "mailto:dbsgtk@nus.edu.sg"
              :class "text-nus-navy hover:underline"} "Greg Tucker-Kellogg"]]]])))

(defn init []
  (rdom/render [page]
               (. js/document (getElementById "app"))))

(defn ^:dev/after-load reload []
  (init))
