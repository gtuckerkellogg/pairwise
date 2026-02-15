# Affine Gap Visualization Design

**Date:** 2026-02-15
**Status:** Approved

## Context

The project has affine gap alignment (Gotoh/SS-2) and a shared visualization IR (`viz_model.cljc`). Both renderers (TikZ/Beamer and SVG/webapp) consume the IR. The webapp currently supports linear gaps only.

No existing tool combines an interactive filled-matrix view with explicit visual arrows showing state transitions between the three affine gap states. This is a pedagogical gap we can fill.

## Pedagogical Design

The visualization supports a two-class scaffolding:

- **Class 1 (linear):** Students learn the DP matrix with one score per cell, progressive Beamer reveal, student-at-microphone exercises.
- **Class 2 (affine):** Students see the same familiar grid structure, but now each cell has three state values. The visualization is a natural extension, not a new layout.

Each student at the microphone computes all three state values (V'M, V'X, V'Y) for their cell. All three are revealed together on one Beamer step.

## IR Extensions

Two new instruction types added to the existing IR:

### `:state-scores`

The three per-state values for a cell:

```clojure
{:type :state-scores
 :row 2 :col 3
 :vm 5      ;; match/mismatch state (nil if not reachable)
 :vx -7     ;; vertical gap state
 :vy nil    ;; horizontal gap state
 :step 15}
```

### `:state-arrow`

A state-aware traceback arrow showing source and target states:

```clojure
{:type :state-arrow
 :from-row 2 :from-col 3 :from-state :M
 :to-row 1 :to-col 2 :to-state :M
 :direction :diag
 :arrow-type :dp      ;; :dp or :optimal
 :step 15}
```

Linear gap alignments produce no `:state-scores` or `:state-arrow` instructions. The existing `:cell-score`, `:dp-arrow`, and `:path-arrow` types are unchanged.

## Subdivided Cell Layout

Each affine cell uses a diagonal spatial mnemonic where position hints at arrow direction:

```
+-------------+
|           V'X|   upper-RIGHT: arrow from above (top = vertical)
|     V'M     |   CENTER: arrow from diagonal
|V'Y          |   lower-LEFT: arrow from left (left = horizontal)
+-------------+
```

- V'X at upper-right: the TOP axis matches "arrow from above"
- V'Y at lower-left: the LEFT axis matches "arrow from left"
- V'M at center: the diagonal arrives at center

Nil states (unreachable) are left empty — no value, no arrows.

## State-Aware Arrows

Arrows connect sub-regions within cells, not just cell centers. The anchor point within a cell depends on the state:

- V'X arrows anchor at upper-right
- V'M arrows anchor at center
- V'Y arrows anchor at lower-left

This produces a visual distinction between gap opening and gap extension:

| Transition | Visual | Meaning |
|---|---|---|
| V'M -> V'M | center-to-center, diagonal | Match/mismatch continues |
| V'M -> V'X | center-to-upper-right, vertical | Gap opens in s1 |
| V'X -> V'X | upper-right-to-upper-right, vertical | Gap extends in s1 |
| V'X -> V'M | upper-right-to-center, diagonal | Gap closes, back to match |
| V'M -> V'Y | center-to-lower-left, horizontal | Gap opens in s2 |
| V'Y -> V'Y | lower-left-to-lower-left, horizontal | Gap extends in s2 |
| V'Y -> V'M | lower-left-to-center, diagonal | Gap closes, back to match |

Gap extension arrows stay within the same sub-region. Gap opening arrows visibly cross between sub-regions. Students can see the "jump" that costs extra.

## Webapp Interaction

### Gap model selector

Radio buttons (Linear / Affine) in the Algorithm Parameters panel. Affine mode:

- Replaces the linear gap penalty slider with "Gap open (d)" and "Gap extend (e)" sliders
- Switches to subdivided cells with state-aware arrows
- Reduces max sequence length to 7 characters
- Increases cell size from 50px to ~80px

### State layer toggle

Four buttons above the SVG (affine mode only):

```
[ All ] [ V'M ] [ V'X ] [ V'Y ]
```

- **All** (default): Full subdivided cells, all arrows visible
- **V'M / V'X / V'Y**: Selected state at full opacity; other states dimmed to ~30% opacity

The toggle is a rendering filter — no recomputation. Local UI state (atom) controls opacity.

## Beamer/TikZ Rendering

### Progressive fill (Phase 1)

All three values in a cell share the same Beamer step number. One click reveals the full subdivided cell:

```latex
\visible<15->{\draw (2,3) node [scale=0.4] {5};}          % V'M center
\visible<15->{\draw (1.7,3.3) node [scale=0.35] {-7};}    % V'X upper-right
\visible<15->{\draw (2.3,2.7) node [scale=0.35] {-12};}   % V'Y lower-left
```

State-aware arrows use new TikZ styles:

```latex
\tikzset{state-M/.style={draw=blue!70, thick}}
\tikzset{state-X/.style={draw=green!60!black, thick}}
\tikzset{state-Y/.style={draw=orange!80!red, thick}}
```

### Layer decomposition (Phase 2)

After the progressive fill completes, additional Beamer overlays isolate each state using the fade approach (dim non-active states to ~30% opacity):

- Overlay N: V'M highlighted, V'X and V'Y dimmed
- Overlay N+1: V'X highlighted, V'M and V'Y dimmed
- Overlay N+2: V'Y highlighted, V'M and V'Y dimmed
- Overlay N+3: All states return to full color

## Color Scheme

The IR carries state identity (M/X/Y) but not colors. Each renderer chooses colors independently:

- **SVG:** Colors match the webapp theme
- **TikZ:** Colors are defined as TikZ styles, configurable per Beamer theme

Both schemes must be accessible for color-blind viewers.

## Backward Compatibility

- Linear gap mode is completely unchanged — no new instructions emitted
- Existing tests continue to pass
- The webapp defaults to linear mode
- TikZ output for linear alignments is byte-identical to current

## What This Does NOT Change

- No changes to alignment algorithms
- No changes to the IR pipeline (only additive instruction types)
- No changes to CLI interface
- No changes to existing linear visualization
