# Affine Gap Visualization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add three-state affine gap visualization to both the SVG webapp and TikZ/Beamer renderer, with subdivided cells, state-aware arrows, and a layer toggle.

**Architecture:** Extend `viz_model.cljc` with two new IR instruction types (`:state-scores`, `:state-arrow`), add `defmethod` renderers in both `tikz_view.clj` and `webapp.cljs`, and wire up affine gap controls in the webapp form. Linear mode is completely unchanged.

**Tech Stack:** Clojure/ClojureScript, Reagent, TikZ/Beamer, shadow-cljs

**Design doc:** `plans/affine-visualization-design.md`

---

### Task 1: Add `:state-scores` IR generation to `viz_model.cljc`

**Files:**
- Modify: `src/pairwise/viz_model.cljc`
- Test: `test/pairwise/viz_model_test.clj`

**Step 1: Write the failing test**

In `test/pairwise/viz_model_test.clj`, add after the existing `affine-alignment-produces-valid-instructions` test:

```clojure
(def small-affine-result
  (alignment/pairwise-align "ACG" "AG" blosum50 {:d 12 :e 2}
                            :type :global :gap-model :affine))

(deftest affine-produces-state-scores
  (testing "Affine alignment produces :state-scores instructions"
    (let [model (viz/alignment->instructions small-affine-result)
          state-scores (instructions-of-type model :state-scores)]
      ;; 3x4 matrix = 12 cells; origin has vm=0, others may have nil :score
      ;; but all cells with a non-nil :score should get a :state-scores instruction
      (is (pos? (count state-scores)))
      ;; Each state-scores has :vm, :vx, :vy keys (values may be nil)
      (is (every? #(and (contains? % :vm) (contains? % :vx) (contains? % :vy)) state-scores))
      ;; Check a specific cell: [1,1] should have vm=5, vx=nil, vy=nil
      (let [cell-1-1 (first (filter #(and (= 1 (:row %)) (= 1 (:col %))) state-scores))]
        (is (= 5 (:vm cell-1-1)))
        (is (nil? (:vx cell-1-1)))
        (is (nil? (:vy cell-1-1)))))))

(deftest linear-produces-no-state-scores
  (testing "Linear alignment does NOT produce :state-scores instructions"
    (let [model (viz/alignment->instructions ac-result)]
      (is (empty? (instructions-of-type model :state-scores))))))
```

**Step 2: Run test to verify it fails**

Run: `clojure -M:test`
Expected: FAIL — `:state-scores` instructions not produced yet.

**Step 3: Write minimal implementation**

In `src/pairwise/viz_model.cljc`, add a private helper after `cell-scores`:

```clojure
(defn- state-scores
  "Generate :state-scores instructions from an affine DP matrix.
   Only emitted when cells have :vm/:vx/:vy keys."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [cell (get-in D [r c])]
        :when (contains? cell :vm)]
    {:type :state-scores
     :row r :col c
     :vm (:vm cell)
     :vx (:vx cell)
     :vy (:vy cell)
     :step (cell-step num-cols [r c])}))
```

In `alignment->instructions`, add `state-scores` to the instruction concat:

```clojure
(vec (concat
      [{:type :grid :rows rows :cols cols}]
      (seq-labels s1 s2)
      (cell-scores D cols)
      (state-scores D cols)     ;; NEW — empty for linear, populated for affine
      (dp-arrows D cols)
      (path-arrows result)))
```

**Step 4: Run test to verify it passes**

Run: `clojure -M:test`
Expected: All 51+ tests PASS (49 existing + 2 new).

**Step 5: Commit**

```bash
git add src/pairwise/viz_model.cljc test/pairwise/viz_model_test.clj
git commit -m "Add :state-scores IR instruction for affine cells"
```

---

### Task 2: Add `:state-arrow` IR generation to `viz_model.cljc`

**Files:**
- Modify: `src/pairwise/viz_model.cljc`
- Test: `test/pairwise/viz_model_test.clj`

**Step 1: Write the failing test**

```clojure
(deftest affine-produces-state-arrows
  (testing "Affine alignment produces :state-arrow instructions"
    (let [model (viz/alignment->instructions small-affine-result)
          state-arrows (instructions-of-type model :state-arrow)]
      (is (pos? (count state-arrows)))
      ;; Each state-arrow has :from-state and :to-state
      (is (every? #(and (contains? % :from-state) (contains? % :to-state)) state-arrows))
      ;; States are :M, :X, or :Y
      (is (every? #(#{:M :X :Y} (:from-state %)) state-arrows))
      (is (every? #(#{:M :X :Y} (:to-state %)) state-arrows))
      ;; Each has :arrow-type (:dp or :optimal)
      (is (every? #(#{:dp :optimal} (:arrow-type %)) state-arrows))
      ;; Directions are valid
      (is (every? #(#{:diag :horiz :vert} (:direction %)) state-arrows)))))

(deftest linear-produces-no-state-arrows
  (testing "Linear alignment does NOT produce :state-arrow instructions"
    (let [model (viz/alignment->instructions ac-result)]
      (is (empty? (instructions-of-type model :state-arrow))))))
```

**Step 2: Run test to verify it fails**

Run: `clojure -M:test`
Expected: FAIL — `:state-arrow` instructions not produced yet.

**Step 3: Write minimal implementation**

In `src/pairwise/viz_model.cljc`, add two helpers:

```clojure
(defn- state-keyword->from-key
  "Map state keyword to the DP matrix key holding that state's traceback sources."
  [state]
  (case state :M :from-m :X :from-x :Y :from-y))

(defn- state-dp-arrows
  "Generate :state-arrow instructions with :arrow-type :dp from affine DP matrix.
   Reads :from-m, :from-x, :from-y per cell to produce state-aware arrows."
  [D num-cols]
  (for [[r c] (matrix/cell-coordinates D)
        :let [cell (get-in D [r c])
              step (cell-step num-cols [r c])]
        ;; Iterate over the three states
        from-state [:M :X :Y]
        :let [sources (get cell (state-keyword->from-key from-state))]
        :when (seq sources)
        ;; Each source is [to-row to-col to-state]
        [to-r to-c to-state] sources]
    {:type :state-arrow
     :from-row r :from-col c :from-state from-state
     :to-row to-r :to-col to-c :to-state to-state
     :direction (matrix/direction-between [r c] [to-r to-c])
     :arrow-type :dp
     :step step}))
```

For optimal path state-arrows, add a helper that handles affine path nodes (`[row col :state]`):

```clojure
(defn- state-path-arrows
  "Generate :state-arrow instructions with :arrow-type :optimal from affine optimal paths.
   Affine path nodes are [row col :state]."
  [result]
  (let [paths (:optimal-paths result)
        path-steps (mapcat (partial partition 2 1) paths)
        reveal-times (flatten (:optimal-path-steps result))]
    (map (fn [step step-time]
           (let [from (first step)
                 to (second step)
                 from-r (first from) from-c (second from) from-state (nth from 2)
                 to-r (first to) to-c (second to) to-state (nth to 2)]
             {:type :state-arrow
              :from-row from-r :from-col from-c :from-state from-state
              :to-row to-r :to-col to-c :to-state to-state
              :direction (matrix/direction-between [from-r from-c] [to-r to-c])
              :arrow-type :optimal
              :step step-time}))
         path-steps reveal-times)))
```

Update `alignment->instructions` to detect affine mode and emit the right arrow types:

```clojure
(defn- affine-mode?
  "Check if a DP matrix was produced by the affine algorithm."
  [D]
  (contains? (get-in D [0 0]) :vm))

(defn alignment->instructions
  [result]
  (let [D (:dp-matrix result)
        s1 (:sequence-1 result)
        s2 (:sequence-2 result)
        [rows cols] (matrix/matrix-dimensions D)
        affine? (affine-mode? D)]
    {:dimensions {:rows rows :cols cols}
     :sequences {:top s1 :left s2}
     :instructions
     (vec (concat
           [{:type :grid :rows rows :cols cols}]
           (seq-labels s1 s2)
           (cell-scores D cols)
           (state-scores D cols)
           (if affine?
             (concat (state-dp-arrows D cols)
                     (state-path-arrows result))
             (concat (dp-arrows D cols)
                     (path-arrows result)))))}))
```

**Step 4: Run test to verify it passes**

Run: `clojure -M:test`
Expected: All tests PASS.

**Important:** Verify that the existing `affine-alignment-produces-valid-instructions` test still passes — it checks for `:path-arrow` type, but affine mode now emits `:state-arrow` instead. **Update that test** to check for `:state-arrow`:

```clojure
(deftest affine-alignment-produces-valid-instructions
  (testing "Affine alignment results also produce valid IR"
    (let [model (viz/alignment->instructions affine-result)
          types (set (map :type (:instructions model)))]
      (is (contains? types :grid))
      (is (contains? types :cell-score))
      (is (contains? types :state-scores))
      (is (contains? types :state-arrow))
      ;; All cell-score instructions have numeric scores
      (is (every? number? (map :score (instructions-of-type model :cell-score)))))))
```

**Step 5: Also verify linear TikZ regression**

Run the same TikZ regression test from the previous work:

```bash
clojure -M -e '
(require (quote [pairwise.tikz-view :as tikz])
         (quote [pairwise.alignment :as a])
         (quote [pairwise.linear])
         (quote [pairwise.substitution :as sub]))
(let [S (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))
      r (a/pairwise-align "HEAGAWGHEE" "PAWHEAE" S 8 :type :global)]
  (spit "/tmp/tikz-linear-check.tex" (tikz/tikz-alignment r)))'
diff /tmp/tikz-large-before.tex /tmp/tikz-linear-check.tex
```

Expected: Zero diff — linear output unchanged.

**Step 6: Commit**

```bash
git add src/pairwise/viz_model.cljc test/pairwise/viz_model_test.clj
git commit -m "Add :state-arrow IR instruction for affine traceback"
```

---

### Task 3: Add TikZ renderers for `:state-scores` and `:state-arrow`

**Files:**
- Modify: `resources/tikz/header.tex`
- Modify: `src/pairwise/tikz_view.clj`
- Test: `test/pairwise/tikz_view_test.clj`

**Step 1: Write the failing test**

In `test/pairwise/tikz_view_test.clj`:

```clojure
(def affine-result
  (let [S (sub/read-scoring-matrix (slurp "resources/data/BLOSUM50.txt"))]
    (pairwise/pairwise-align "ACG" "AG" S {:d 12 :e 2}
                             :type :global :gap-model :affine)))

(deftest tikz-affine-alignment-produces-latex
  (testing "Affine alignment generates valid LaTeX with state styles"
    (let [output (tikz/tikz-alignment affine-result)]
      (is (string? output))
      (is (str/includes? output "\\begin{document}"))
      (is (str/includes? output "\\begin{tikzpicture}"))
      ;; State-specific TikZ styles should be present in header
      (is (str/includes? output "state-M"))
      (is (str/includes? output "state-X"))
      (is (str/includes? output "state-Y")))))
```

Add `pairwise.affine` to the test ns require:

```clojure
(ns pairwise.tikz-view-test
  (:require [clojure.test :refer :all]
            [pairwise.tikz-view :as tikz]
            [pairwise.linear :as pairwise]
            [pairwise.affine]
            [pairwise.alignment :as alignment]
            [pairwise.substitution :as sub]
            [clojure.string :as str]))
```

**Step 2: Run test to verify it fails**

Run: `clojure -M:test`
Expected: FAIL — no `state-M` in output yet.

**Step 3: Add TikZ styles to header.tex**

Append to `resources/tikz/header.tex`:

```latex
% Affine gap state styles
\tikzset{state-M/.style={draw=blue!70, thick}}
\tikzset{state-X/.style={draw=green!60!black, thick}}
\tikzset{state-Y/.style={draw=orange!80!red, thick}}
\tikzset{state-M-dim/.style={draw=blue!20, thin}}
\tikzset{state-X-dim/.style={draw=green!15, thin}}
\tikzset{state-Y-dim/.style={draw=orange!20, thin}}
```

**Step 4: Add render-instruction defmethods**

In `src/pairwise/tikz_view.clj`, add sub-region offset constants and renderers:

```clojure
;; Sub-region offsets within a cell (diagonal mnemonic)
;; V'X: upper-right, V'M: center, V'Y: lower-left
(def ^:private state-offset
  {:X [ 0.3 -0.3]    ;; upper-right in TikZ rotated coords
   :M [ 0.0  0.0]    ;; center
   :Y [-0.3  0.3]})  ;; lower-left

(defmethod render-instruction :state-scores [{:keys [row col vm vx vy step]}]
  (let [fmt (fn [val offset-key scale]
              (when (some? val)
                (let [[dr dc] (state-offset offset-key)]
                  (format "\\visible<%d->{\\draw (%s,%s) node [fill=white,scale=%s] {%s};}\n"
                          step (+ row dr) (+ col dc) scale val))))]
    [(fmt vx :X "0.35")
     (fmt vm :M "0.4")
     (fmt vy :Y "0.35")]))

(defmethod render-instruction :state-arrow [{:keys [from-row from-col from-state
                                                     to-row to-col to-state
                                                     direction arrow-type step]}]
  (let [[from-dr from-dc] (state-offset from-state)
        [to-dr to-dc] (state-offset to-state)
        style (if (= arrow-type :optimal)
                (str "state-" (name from-state) ",very thick")
                (str "state-" (name from-state)))]
    (format "\\visible<%d->{\\draw[->,>={latex},%s] (%s,%s) -- (%s,%s);}\n"
            step style
            (+ from-row from-dr) (+ from-col from-dc)
            (+ to-row to-dr) (+ to-col to-dc))))
```

**Step 5: Run test to verify it passes**

Run: `clojure -M:test`
Expected: All tests PASS.

**Step 6: Verify linear TikZ output unchanged**

Same diff check as Task 2. Expected: Zero diff.

**Step 7: Commit**

```bash
git add resources/tikz/header.tex src/pairwise/tikz_view.clj test/pairwise/tikz_view_test.clj
git commit -m "Add TikZ renderers for affine state-scores and state-arrows"
```

---

### Task 4: Add SVG renderers for `:state-scores` and `:state-arrow` in `webapp.cljs`

**Files:**
- Modify: `src/pairwise/webapp.cljs`

**Step 1: Add sub-region offset constants**

```clojure
;; Affine mode cell size (larger to fit three values)
(def affine-cell-size 80)
(def affine-half-cell (/ affine-cell-size 2))

;; Sub-region pixel offsets within a cell (diagonal mnemonic)
;; V'X: upper-right, V'M: center, V'Y: lower-left
(defn- state-offset [state cs]
  (let [quarter (/ cs 4)]
    (case state
      :X [quarter (- quarter)]       ;; upper-right
      :M [0 0]                       ;; center
      :Y [(- quarter) quarter])))    ;; lower-left
```

**Step 2: Add render-instruction defmethods**

```clojure
(defmethod render-instruction :state-scores [{:keys [row col vm vx vy]} cs active-state]
  (let [cx (+ (/ cs 2) (* col cs))
        cy (+ (/ cs 2) (* row cs))
        quarter (/ cs 4)
        opacity (fn [state] (if (or (= active-state :all) (= active-state state)) 1.0 0.3))
        draw-val (fn [val state dx dy]
                   (when (some? val)
                     [:text {:x (+ cx dx) :y (+ cy dy)
                             :text-anchor "middle" :alignment-baseline "middle"
                             :font-family "Verdana" :font-size "55%"
                             :opacity (opacity state)} val]))]
    [:g
     [:rect {:x (* col cs) :y (* row cs) :width cs :height cs
             :fill "none" :stroke "gray" :stroke-width 0.2}]
     (draw-val vx :X quarter (- quarter))
     (draw-val vm :M 0 0)
     (draw-val vy :Y (- quarter) quarter)]))

(defmethod render-instruction :state-arrow [{:keys [from-row from-col from-state
                                                     to-row to-col to-state
                                                     arrow-type]} cs active-state]
  (let [[fdx fdy] (state-offset from-state cs)
        [tdx tdy] (state-offset to-state cs)
        half (/ cs 2)
        x1 (+ half (* from-col cs) fdx)
        y1 (+ half (* from-row cs) fdy)
        x2 (+ half (* to-col cs) tdx)
        y2 (+ half (* to-row cs) tdy)
        state-color {:M "#4477AA" :X "#228833" :Y "#CC6633"}
        base-color (state-color from-state)
        opacity (if (or (= active-state :all) (= active-state from-state)) 1.0 0.15)
        width (if (= arrow-type :optimal) 3 1.5)]
    [:line {:stroke base-color :stroke-width width :opacity opacity
            :x1 x1 :x2 x2 :y1 y1 :y2 y2}]))
```

**Note:** The SVG renderers accept extra parameters (`cs` for cell-size and `active-state` for the layer toggle). The existing `render-instruction` multimethod dispatches on `:type` only. For the affine instructions, the `svg-component` will call these renderers directly with the extra args rather than through the multimethod. Alternative: wrap the extra state in a dynamic var or pass it via the instruction map. The implementer should choose the cleanest approach — the key constraint is that existing linear renderers must not change.

**Step 3: Update svg-component to handle affine mode**

The `svg-component` function needs to detect affine mode and use larger cells:

```clojure
(defn svg-component [app-state & _args]
  (let [model (viz/alignment->instructions (:result app-state))
        {:keys [rows cols]} (:dimensions model)
        instructions (:instructions model)
        by-type (group-by :type instructions)
        affine? (seq (:state-scores by-type))
        cs (if affine? affine-cell-size cell-size)
        hc (/ cs 2)
        active-state (or (:active-state app-state) :all)]
    [:svg {:width   "80%"
           :height  "50%"
           :viewBox (print-str (- cs) (- cs)
                               (str (* (inc cols) cs))
                               (str (* (inc rows) cs)))
           :id    "canvas"
           :style {:background-color "#fff"}}
     [:rect {:x 0 :y 0 :width (* cs cols) :height (* cs rows)
             :fill "none" :stroke "black" :stroke-width 1}]
     ;; Render based on mode
     (if affine?
       ;; Affine: state-aware arrows + subdivided cells
       (list
        (map #(render-instruction % cs active-state) (:state-arrow by-type))
        (map #(render-instruction % cs active-state) (:state-scores by-type))
        (map render-instruction (:seq-label by-type)))
       ;; Linear: existing pipeline unchanged
       (list
        (map render-instruction (:dp-arrow by-type))
        (map render-instruction (:path-arrow by-type))
        (map render-instruction (:cell-score by-type))
        (map render-instruction (:seq-label by-type))))]))
```

**Step 4: Verify it compiles**

Run: `npm run build`
Expected: 0 warnings.

**Step 5: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "Add SVG renderers for affine state-scores and state-arrows"
```

---

### Task 5: Add affine gap controls to webapp form

**Files:**
- Modify: `src/pairwise/webapp.cljs`

**Step 1: Require pairwise.affine in webapp namespace**

Add to the `:require` vector:

```clojure
[pairwise.affine]  ; registers :affine multimethod implementations
```

**Step 2: Add gap model state and update app-results**

In the `page` function's initial state atom, add:

```clojure
:gap-model       :linear
:gap-open        12
:gap-extend      2
```

Update `app-results` to pass gap-model:

```clojure
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
```

**Step 3: Add gap model radio buttons and sliders to form-component**

After the alignment type panel, add a gap model panel. When affine is selected, show gap-open and gap-extend sliders instead of the linear gap penalty slider. Also enforce max-length 7 for affine mode.

In `form-component`, replace the gap penalty row with:

```clojure
;; Gap model selector
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

;; Gap parameters (conditional on gap model)
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
                                  (js/parseInt (-> % .-target .-value)))}]))
```

Update the sequence input max-length to be conditional:

```clojure
:max-length (if (= :affine (:gap-model state)) 7 10)
```

**Step 4: Add state layer toggle**

Add a toggle component that appears above the SVG when in affine mode:

```clojure
(defn state-toggle [app-state]
  (let [active (or (:active-state @app-state) :all)]
    [:div.btn-group {:style {:margin-bottom "10px"}}
     (for [s [:all :M :X :Y]
           :let [label (if (= s :all) "All" (str "V'" (name s)))]]
       [:button.btn.btn-sm.btn-default
        {:key s
         :class (when (= active s) "active")
         :on-click #(swap! app-state assoc :active-state s)}
        label])]))
```

Add this component in the `page` function, above the `svg-component` call, conditionally for affine mode:

```clojure
(when (= :affine (:gap-model @app-state))
  [state-toggle app-state])
```

**Step 5: Verify it compiles and runs**

Run: `npm run build`
Expected: 0 warnings.

Run: `npm run dev`
Test manually: switch between linear and affine, verify subdivided cells appear, toggle state layers.

**Step 6: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "Add affine gap controls and state layer toggle to webapp"
```

---

### Task 6: Add Beamer layer decomposition to TikZ renderer

**Files:**
- Modify: `src/pairwise/viz_model.cljc`
- Modify: `src/pairwise/tikz_view.clj`
- Test: `test/pairwise/tikz_view_test.clj`

**Step 1: Write the failing test**

```clojure
(deftest tikz-affine-has-decomposition-overlays
  (testing "Affine TikZ output includes layer decomposition overlays"
    (let [output (tikz/tikz-alignment affine-result)]
      ;; After the progressive fill, there should be dimmed overlays
      (is (str/includes? output "state-M-dim"))
      (is (str/includes? output "state-X-dim"))
      (is (str/includes? output "state-Y-dim")))))
```

**Step 2: Implement layer decomposition**

In `viz_model.cljc`, add a new instruction type `:decomposition-phase` that the TikZ renderer uses to emit overlays for each state highlighted/dimmed. This instruction contains:

```clojure
{:type :decomposition-phase
 :states [:M :X :Y]
 :start-step <N>}  ;; step number after last fill step
```

The viz model computes `start-step` as `last-cell-step + last-path-step + 1`.

In `tikz_view.clj`, the `:decomposition-phase` renderer emits three overlay groups (one per highlighted state), each showing that state's scores and arrows at full opacity and others dimmed.

**Step 3: Run test to verify it passes**

Run: `clojure -M:test`
Expected: All tests PASS.

**Step 4: Verify linear TikZ unchanged**

Same diff check. Expected: Zero diff.

**Step 5: Commit**

```bash
git add src/pairwise/viz_model.cljc src/pairwise/tikz_view.clj test/pairwise/tikz_view_test.clj
git commit -m "Add Beamer layer decomposition phase for affine visualization"
```

---

### Task 7: Update CLAUDE.md and final verification

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Run full test suite**

Run: `clojure -M:test`
Expected: All tests PASS.

**Step 2: Run ClojureScript build**

Run: `npm run build`
Expected: 0 warnings.

**Step 3: Verify linear TikZ regression**

Run diff check against stored reference output.
Expected: Zero diff.

**Step 4: Update CLAUDE.md**

Update the webapp description to note it now supports both linear and affine gaps. Update the Visualization IR section to mention `:state-scores` and `:state-arrow` instruction types.

**Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "Document affine visualization support in CLAUDE.md"
```

---

## Verification (End-to-End)

```bash
npm test                    # All tests pass
npm run build               # ClojureScript compiles, 0 warnings
npm run dev                 # Webapp: linear mode identical, affine mode shows subdivided cells
# TikZ linear regression:
clojure -M -m pairwise.main -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 -g 8 -o /tmp/test-linear.tex
# TikZ affine:
clojure -M -m pairwise.main -1 ACG -2 AG -m BLOSUM50 --gap-model affine --gap-open 12 --gap-extend 2 -o /tmp/test-affine.tex
# Verify both produce valid LaTeX
```

## What This Does NOT Change

- No changes to alignment algorithms (linear or affine)
- No changes to CLI interface
- No changes to alignment result structure
- Linear visualization is byte-identical to current output
