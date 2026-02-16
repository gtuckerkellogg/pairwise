# Pedagogical Web Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the bare-bones alignment webapp into a pedagogical tool with integrated educational content, reactive algorithm explanations, and modern Tailwind CSS styling.

**Architecture:** All changes are in two files: `resources/public/index.html` (swap Bootstrap for Tailwind CDN) and `src/pairwise/webapp.cljs` (new Reagent components for educational content, migrate all Bootstrap classes to Tailwind). The existing visualization and alignment logic are untouched. New components read from the same `app-state` atom to reactively show algorithm details matching the current tool state.

**Tech Stack:** ClojureScript, Reagent, Tailwind CSS (CDN), shadow-cljs

**Key files:**
- `resources/public/index.html` — HTML shell, CDN links
- `resources/public/css/style.css` — current custom CSS (will be simplified)
- `demo/index.html` — demo build HTML (mirrors main)
- `src/pairwise/webapp.cljs` — all Reagent components
- `plans/2026-02-16-pedagogical-webapp-design.md` — approved design doc

**Dev server:** `npm run dev` starts shadow-cljs at `http://localhost:3000` with live reload.

**Tests:** `npm test` or `clojure -M:test` (existing tests cover alignment logic; webapp changes are visual and tested manually via dev server).

---

### Task 1: Replace Bootstrap with Tailwind CSS in HTML

**Files:**
- Modify: `resources/public/index.html`
- Modify: `demo/index.html`
- Modify: `resources/public/css/style.css`

**Step 1: Update `resources/public/index.html`**

Replace the entire file with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Pairwise Sequence Alignment — Interactive Visualization</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              nus: { navy: '#003D7C', orange: '#EF7C00', 'orange-light': '#ffae56' }
            }
          }
        }
      }
    </script>
    <link href="css/style.css" rel="stylesheet" type="text/css">
  </head>
  <body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
    <div id="app" class="flex-1"></div>
    <script src="js/compiled/main.js" type="text/javascript"></script>
  </body>
</html>
```

**Step 2: Update `demo/index.html`**

Same structure as above, but with `demo/css/style.css` path and `demo/js/compiled/main.js` path.

**Step 3: Simplify `resources/public/css/style.css`**

Replace contents with minimal overrides that Tailwind can't handle inline:

```css
/* Custom styles that complement Tailwind */
/* KaTeX-style math formatting for recurrences */
.math-block { font-family: 'Cambria Math', 'Latin Modern Math', serif; }
```

**Step 4: Verify dev server starts**

Run: `npm run dev`
Open: `http://localhost:3000`
Expected: Page loads (will look broken because ClojureScript still uses Bootstrap classes — that's expected and fixed in Task 2).

**Step 5: Commit**

```bash
git add resources/public/index.html demo/index.html resources/public/css/style.css
git commit -m "feat: replace Bootstrap 3 with Tailwind CSS CDN

Configure NUS color palette as custom Tailwind theme colors.
Simplify custom CSS to minimal overrides."
```

---

### Task 2: Migrate core layout and form components to Tailwind

**Files:**
- Modify: `src/pairwise/webapp.cljs` (lines 216–331, 368–419)

This task migrates the existing `page`, `form-component`, `row`, `summarize-alignment`, `display-alignment`, `color-legend`, and `state-toggle` components from Bootstrap classes to Tailwind classes. No new content is added yet — this is a pure class migration to restore a working UI.

**Step 1: Rewrite `row` helper**

Current (Bootstrap):
```clojure
(defn row [label input]
  [:div.row
   [:div.col-md-4  [:label label]]
   [:div.col-md-8 input]])
```

New (Tailwind):
```clojure
(defn row [label input]
  [:div {:class "flex items-center gap-4 mb-3"}
   [:div {:class "w-1/3 text-sm font-medium text-gray-700"} [:label label]]
   [:div {:class "w-2/3"} input]])
```

**Step 2: Rewrite `form-component`**

Replace all Bootstrap panel/button classes with Tailwind equivalents:
- `panel panel-primary` → `rounded-lg border border-nus-navy overflow-hidden mb-4`
- `panel-heading` → `bg-nus-navy text-white px-4 py-2 text-sm font-semibold`
- `panel-body` → `px-4 py-3`
- `btn-group` with `btn btn-default` → `inline-flex rounded-md shadow-sm` with individual buttons using conditional `bg-nus-navy text-white` / `bg-white text-gray-700 border` for active/inactive
- `form-control` → `w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-nus-navy focus:border-nus-navy`
- `select.form-control` → `w-full border border-gray-300 rounded px-3 py-1.5 text-sm`
- Radio buttons: style with Tailwind spacing

**Step 3: Rewrite `page` component layout**

Replace Bootstrap grid with Tailwind flex:
- `div.page-header h1.text-center` → proper Tailwind header (will be expanded in Task 4)
- `div.row` with `col-md-4` / `col-md-8` → `flex flex-col md:flex-row gap-6` with `md:w-1/3` / `md:w-2/3`
- `panel panel-info` (results) → `rounded-lg border border-nus-orange overflow-hidden`
- `panel-heading` (results) → `bg-nus-orange-light text-nus-navy px-4 py-2 text-center font-semibold`

**Step 4: Rewrite `color-legend` and `state-toggle`**

- `color-legend`: use Tailwind spacing/flex classes
- `state-toggle`: `btn-group` → `inline-flex rounded-md shadow-sm` with Tailwind button styles

**Step 5: Rewrite footer**

Move footer into the `page` component (it was previously in HTML). Add as a Tailwind-styled footer at the bottom:

```clojure
[:footer {:class "mt-12 py-6 border-t border-gray-200 text-center text-sm text-gray-500"}
 [:p "Created by "
  [:a {:href "mailto:dbsgtk@nus.edu.sg"
       :class "text-nus-navy hover:underline"} "Greg Tucker-Kellogg"]]]
```

**Step 6: Verify in dev server**

Run dev server, confirm:
- Form controls render correctly with Tailwind styling
- Button toggles (alignment type, gap model, state toggle) work
- SVG visualization still renders
- Layout is responsive (controls above viz on mobile, side-by-side on desktop)

**Step 7: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: migrate all components from Bootstrap to Tailwind CSS

Rewrite form, layout, buttons, panels, and footer using Tailwind
utility classes. NUS navy/orange colors preserved. No functional changes."
```

---

### Task 3: Add collapsible section component and introduction

**Files:**
- Modify: `src/pairwise/webapp.cljs`

**Step 1: Create `collapsible` component**

A reusable Reagent component that shows a header and toggles body visibility:

```clojure
(defn collapsible
  "Collapsible section. title is a string, open? is initial state, body is hiccup."
  [title open? & body]
  (let [expanded (atom open?)]
    (fn [title _open? & body]
      [:div {:class "mb-6 rounded-lg border border-gray-200 overflow-hidden"}
       [:button {:class "w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left font-semibold text-nus-navy transition-colors"
                 :on-click #(swap! expanded not)}
        [:span title]
        [:span {:class (str "transform transition-transform " (if @expanded "rotate-180" ""))} "▾"]]
       (when @expanded
         [:div {:class "px-4 py-3 border-t border-gray-200"}
          (into [:<>] body)])])))
```

**Step 2: Create `introduction-section` component**

Add below the page header, above the tool. Content from the design doc — self-contained, no prerequisite reading. Include an expandable sub-section for biological motivation.

Key content points:
- What pairwise alignment is and why it matters
- Two algorithms: Needleman-Wunsch (global) and Smith-Waterman (local)
- Ties produce multiple optimal alignments, all reported
- Linear vs affine gap models
- Note about default sequences from Durbin et al. (1998) Ch. 2
- Expandable: biological motivation for sequence comparison

**Step 3: Wire introduction into `page` component**

Insert `[introduction-section]` between the header and the tool row.

**Step 4: Verify in dev server**

- Introduction section renders with collapsible behavior
- Clicking the header toggles visibility
- Content is readable and well-formatted
- Tool still works below

**Step 5: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: add collapsible component and introduction section

Self-contained educational introduction above the interactive tool.
Collapsible with expandable sub-section for biological motivation."
```

---

### Task 4: Add contextual parameter help (?) icons

**Files:**
- Modify: `src/pairwise/webapp.cljs` (inside `form-component`)

**Step 1: Create `help-toggle` component**

A small `(?)` icon that toggles an inline help paragraph:

```clojure
(defn help-toggle [text]
  (let [show? (atom false)]
    (fn [text]
      [:span
       [:button {:class "ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-nus-navy text-white text-xs hover:bg-nus-orange transition-colors cursor-pointer"
                 :on-click #(swap! show? not)} "?"]
       (when @show?
         [:div {:class "mt-2 p-3 bg-blue-50 rounded text-sm text-gray-700 leading-relaxed"}
          text])])))
```

**Step 2: Add help text to each parameter section**

Insert `[help-toggle "..."]` next to each panel heading in `form-component`:

- **Alignment type heading:** "Global alignment (Needleman-Wunsch) finds the best end-to-end alignment(s) of both complete sequences. Local alignment (Smith-Waterman) finds the highest-scoring subsequence pair(s) — useful when only part of the sequences are related. When multiple paths through the matrix achieve the same optimal score, all optimal alignments are reported."
- **Scoring matrix heading**, after "Scoring Matrix" label:
  - When standard: "Substitution matrices like BLOSUM and PAM encode the evolutionary likelihood of one amino acid replacing another. Higher BLOSUM numbers (e.g., 62 vs 50) are tuned for more closely related sequences."
  - When user-defined: "A simple match/mismatch scheme: identical residues score the match value, different residues score the mismatch value (typically negative)."
- **Gap model heading:** "Linear: each gap position costs the same penalty d. A gap of length k costs k×d. Affine: opening a new gap costs d, extending it costs e per position. A gap of length k costs d + (k−1)×e. This reflects the biological observation that insertions and deletions tend to occur in contiguous blocks."
- **Gap open/extend** (when affine): "Larger d (gap open) relative to e (gap extend) discourages opening new gaps but tolerates longer ones. Try adjusting these to see how the optimal path changes."

**Step 3: Verify in dev server**

- Each (?) icon renders inline next to its heading
- Clicking toggles the help text
- Help text is well-formatted and doesn't disrupt layout
- Multiple help sections can be open simultaneously

**Step 4: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: add contextual parameter help (?) icons

Each parameter section gets a toggleable help explanation.
Covers alignment type, scoring matrices, gap models, and gap parameters."
```

---

### Task 5: Add reactive algorithm details section (linear)

**Files:**
- Modify: `src/pairwise/webapp.cljs`

**Step 1: Create `algorithm-details-linear` component**

Renders when `(:gap-model @app-state)` is `:linear`. Shows:

- Conceptual summary of linear gap DP (always visible)
- Collapsible formal recurrence section with the recurrence relation:
  - Global (Needleman-Wunsch): `F(i,j) = max(F(i-1,j-1) + s(xi,yj), F(i-1,j) - d, F(i,j-1) - d)` with initialization `F(i,0) = -i×d, F(0,j) = -j×d`
  - Local (Smith-Waterman): same but with `max(..., 0)` and `F(i,0) = F(0,j) = 0`
- The displayed recurrence should change based on `(:alignment-type @app-state)`
- Use styled spans/divs for the math (not LaTeX — keep it simple with monospace/serif font)

**Step 2: Create wrapper `algorithm-details` component**

Dispatches to linear or affine sub-component based on `(:gap-model @app-state)`:

```clojure
(defn algorithm-details [app-state]
  (case (:gap-model @app-state)
    :linear  [algorithm-details-linear app-state]
    :affine  [algorithm-details-affine app-state]
    nil))
```

(The affine version is built in Task 6.)

**Step 3: Wire into `page` component**

Insert `[algorithm-details app-state]` below the tool row, above the references section (added in Task 7).

**Step 4: Verify in dev server**

- With linear gap model selected, algorithm details show the correct recurrence
- Switching between global/local updates the displayed recurrence
- Collapsible math section works
- Switching to affine shows nothing yet (placeholder or nil)

**Step 5: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: add reactive algorithm details for linear gap model

Shows conceptual summary and expandable recurrence relation.
Content adapts to global vs local alignment type selection."
```

---

### Task 6: Add reactive algorithm details section (affine)

**Files:**
- Modify: `src/pairwise/webapp.cljs`

This is the most complex educational component. The algorithm details section for affine gaps is **reactive to the state toggle** — the same toggle (All / V'M / V'X / V'Y / Optimal) that controls the visualization also controls which recurrences and explanations are shown.

**Step 1: Create `algorithm-details-affine` component**

Reads `(:active-state @app-state)` (same atom the state toggle writes to) and renders accordingly:

- **`:all`** — Show all three recurrences together with a summary of their relationships. Conceptual: "The affine gap model uses three matrices that track the best score arriving via different states: V'M (last columns matched), V'X (gap in top sequence), V'Y (gap in bottom sequence)."
- **`:M`** — Highlight V'M recurrence only. Conceptual: "V'M(i,j) represents the best alignment score ending with residues xi and yj aligned (matched or mismatched). It can transition from any of the three states." Expandable: formal recurrence `V'M(i,j) = max(V'M(i-1,j-1), V'X(i-1,j-1), V'Y(i-1,j-1)) + s(xi,yj)`
- **`:X`** — Highlight V'X recurrence. Conceptual: "V'X(i,j) represents the best score ending with a gap in the top sequence (deletion). Opening a new gap from state M costs d; extending an existing gap costs e." Expandable: `V'X(i,j) = max(V'M(i-1,j) - d, V'X(i-1,j) - e)`
- **`:Y`** — Highlight V'Y recurrence. Conceptual: "V'Y(i,j) represents the best score ending with a gap in the bottom sequence (insertion). Opening a new gap from state M costs d; extending costs e." Expandable: `V'Y(i,j) = max(V'M(i,j-1) - d, V'Y(i,j-1) - e)`
- **`:optimal`** — Explain traceback: "The optimal alignment is found by tracing back through the state-expanded graph, where each cell has three nodes (one per state). The path can transition between states, reflecting gap openings and closings."

When a specific state is active, show all three recurrences but visually highlight the active one (full opacity) and dim the others (reduced opacity / gray text), mirroring what the SVG visualization does.

Also adapt for global vs local alignment type (local adds max(..., 0) and changes initialization).

**Step 2: Verify in dev server**

- Switch to affine gap model
- Click each state toggle: V'M, V'X, V'Y, All, Optimal
- Confirm the algorithm details section updates to match
- Confirm the SVG visualization also updates (existing behavior)
- Confirm expandable math sections work within each state view
- Switch between global/local and verify content adapts

**Step 3: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: add reactive algorithm details for affine gap model

Algorithm explanations sync with the state toggle (All/V'M/V'X/V'Y/Optimal).
Active state highlighted, others dimmed. Expandable formal recurrences."
```

---

### Task 7: Add references section and page header

**Files:**
- Modify: `src/pairwise/webapp.cljs`

**Step 1: Create `references-section` component**

Full academic citations in a styled section at the bottom:

- Needleman & Wunsch (1970) — *J. Mol. Biol.* 48(3), 443–453
- Smith & Waterman (1981) — *J. Mol. Biol.* 147(1), 195–197
- Gotoh (1982) — *J. Mol. Biol.* 162(3), 705–708
- Altschul & Erickson (1986) — *Bull. Math. Biol.* 48(5–6), 603–616
- Durbin, Eddy, Krogh & Mitchison (1998) — *Biological Sequence Analysis*, Cambridge University Press

Include a note: "This implementation uses the Altschul & Erickson (1986) three-state formulation (SS-2), which correctly enumerates all optimal alignments — unlike Gotoh's original (1982) algorithm, which can miss the optimum."

**Step 2: Update page header**

Replace the current plain `h1` with a proper header:

```clojure
[:header {:class "bg-nus-navy text-white py-8 mb-8"}
 [:div {:class "max-w-6xl mx-auto px-4 text-center"}
  [:h1 {:class "text-3xl font-bold"} "Pairwise Sequence Alignment"]
  [:p {:class "mt-2 text-lg text-blue-200"} "Interactive visualization of dynamic programming alignment algorithms"]]]
```

**Step 3: Verify in dev server**

- Header renders with NUS navy background
- References section renders at the bottom with proper formatting
- Page flows: Header → Intro → Tool → Algorithm Details → References → Footer

**Step 4: Commit**

```bash
git add src/pairwise/webapp.cljs
git commit -m "feat: add references section and styled page header

Full academic citations for all referenced algorithms and papers.
NUS-branded header with title and subtitle."
```

---

### Task 8: Polish and responsive design pass

**Files:**
- Modify: `src/pairwise/webapp.cljs`
- Modify: `resources/public/css/style.css` (if needed)

**Step 1: Add max-width container**

Wrap the main content area in a `max-w-6xl mx-auto px-4` container for readable line lengths.

**Step 2: Responsive breakpoints**

- On mobile (< md): controls and visualization stack vertically
- Controls panel is full-width
- SVG visualization is full-width with horizontal scroll if needed
- Algorithm details are full-width
- Collapsible sections work well on touch

**Step 3: Typography pass**

- Headings: consistent sizing (h1 in header, h2 for section titles, h3 for subsections)
- Body text: `text-gray-700 leading-relaxed`
- Math/recurrences: `font-mono` or serif font for distinction
- Links: `text-nus-navy hover:underline`

**Step 4: Visual consistency**

- All panels use consistent border radius and spacing
- Active toggle buttons use NUS navy, inactive use white/gray
- Help text boxes use a consistent light blue background
- Smooth transitions on collapsible open/close

**Step 5: Update `demo/index.html`**

Ensure the demo build HTML matches the dev HTML (Tailwind CDN, same config).

**Step 6: Build and verify demo**

Run: `npm run demo`
Verify the demo build works with optimized JS.

**Step 7: Commit**

```bash
git add src/pairwise/webapp.cljs resources/public/css/style.css demo/index.html
git commit -m "feat: responsive design polish and typography pass

Consistent spacing, responsive layout, readable typography.
Demo build updated to match dev HTML."
```

---

### Task 9: Run tests and final verification

**Step 1: Run existing tests**

Run: `npm test`
Expected: All existing alignment tests pass (no functional changes were made).

**Step 2: Manual verification checklist**

In the dev server, verify:
- [ ] Page loads with header, intro, tool, algorithm details, references, footer
- [ ] Introduction section collapses/expands
- [ ] All parameter (?) help icons toggle correctly
- [ ] Linear mode: algorithm details show correct recurrence for global and local
- [ ] Affine mode: algorithm details react to state toggle (All/V'M/V'X/V'Y/Optimal)
- [ ] SVG visualization renders correctly for both linear and affine
- [ ] Alignment results display correctly
- [ ] Responsive layout works on narrow viewport
- [ ] References section displays all citations

**Step 3: Commit any fixes**

If any issues found, fix and commit.
