# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Clojure/ClojureScript library for pairwise sequence comparison using dynamic programming algorithms (Needleman-Wunsch and Smith-Waterman) with linear and affine gap penalties (Gotoh algorithm). The project includes both a command-line interface and an interactive pedagogical web application. Licensed under CC-BY 4.0.

## Style Guide
- Use British English throughout (visualisation, initialisation, colour, etc.)
- NUS colour palette: navy `#003D7C`, slate `#2C6F94`, orange `#EF7C00`, orange-light `#ffae56`

## Development Commands

### Prerequisites
- Install Node.js and npm
- Install Clojure CLI tools
- Run `npm install` to install shadow-cljs

### Building and Running
- Start development server: `npm run dev` or `clojure -M:dev watch app`
- Build demo site: `npm run demo`
- Production build: `npm run build`
- Run tests: `npm test` or `clojure -M:test`

### Installing the CLI
- Install to `~/bin`: `clojure -T:build install`
- This builds the uber JAR, copies it to `~/bin/pairwise.jar`, and creates a `~/bin/pairwise` wrapper script
- After install: `pairwise -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 -g 8`
- Affine gap example: `pairwise -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 --gap-model affine --gap-open 12 --gap-extend 2`
- DNA semi-global example: `pairwise -1 GATTACA -2 TACAGAT -s dna -t semiglobal --match 2 --mismatch -3 -g 3`
- `--last-overlay N` (with `-o`) stops the *slides* after N overlay steps. It does not truncate the handout: content past the cap is kept and emitted as `\visible<beamer:0|handout:1->`, so `--overlays all --last-overlay 12` gives 12 slides and a handout showing the finished picture. Combine with `--overlays none` for a genuinely truncated static picture
- `--overlays MODE` (with `-o`) selects how the picture is revealed. The modes exist because the handout and the slides need to say different things:
  - `all` (default) — `\visible<k->`. Slides step through; the handout, having no overlays, shows the finished picture
  - `all-but-traceback` — as `all`, but the optimal path is beamer-only, so the handout is a completed matrix with the traceback left for the reader to work out
  - `none` — no `\visible` at all. One static slide, identical in handout and slides. Suppresses the affine decomposition phase, whose three overlays would otherwise be drawn on top of each other
  - `steps` — `\visible<beamer:k-|handout:0>`. The handout shows only the bare grid (the unsolved problem) while slides step through it. Combine with `--last-overlay` for a classroom exercise
  - `steps+solution` — as `steps`, but content past the cap collapses onto slide N+1 instead of being dropped, so the slides step to N and then jump to the finished picture. Requires `--last-overlay`
- Both flags are ignored without `-o` and print a note to stderr
- Visibility is per-instruction *role*, not global: `:fill` (scores and candidate arrows), `:solution` (the optimal path) and `:decomposition`. `hide-from-handout?` in `tikz-view` maps (mode, role) to whether the spec gets the `beamer:…|handout:0` qualifier
- `:past-cap` content is emitted as `beamer:0|handout:1-` where the handout would have shown it, and omitted where it would not. `beamer:0` creates no slide, so the cap still holds. `:max-progressive-step` excludes `:past-cap` instructions for the same reason
- `:decomposition` is beamer-only in **every** mode. In a handout every overlay specification matches at once, so its three state-highlight slides would otherwise be drawn superimposed — doubled arrows and half-dimmed scores. Do not make it follow the mode

### Generating the LaTeX package
- `clojure -T:build sty` writes `target/alignment-macros.sty` from `resources/tikz/alignment-macros.tex`
- `clojure -T:build sty :dest '"/path/to/texmf/tex/latex/gtk"'` writes straight into a texmf tree (run `mktexlsr` after)
- Nothing in `alignment-macros.tex` may assume a white page. Two `\colorlet` knobs carry the document's colours — `alnbg` (the page) and `alnfg` (the ink) — and follow the beamer theme via `\usebeamercolor{background canvas}`/`{normal text}` at `\AtBeginDocument`, defaulting to white/black elsewhere
- Every other colour mixes a hue toward one of those knobs, never toward literal white or black: score patches `fill=alnbg`; pale candidate arrows and dim variants `viz?!NN!alnbg`, so "washed out" always means "closer to the page" and inverts correctly on a dark theme; saturated score text `viz?!80!alnfg`. Styles resolve the mix at use time, so a document can re-`\colorlet` either knob mid-deck
- `aln-score`, `aln-state-score`, `aln-state-score-main`, `aln-seq-label` and `aln-grid` keep this out of the Clojure format strings — `tikz-view` emits style names, never colours or sizes. Text sizes live in the style sheet so a deck can enlarge them without regenerating: `\tikzset{aln-score/.append style={scale=1}}`
- TikZ's `scale` key is multiplicative, so `aln-score-base` deliberately sets no scale — a style building on a scaled one would compound the two factors and render far smaller than intended
- The three affine state scores share one cell at ±0.3 offsets, so they must stay smaller than the single linear score or three-digit values collide `every-emitted-style-is-defined` asserts no output contains `fill=white` or `color=lightgray`
- On a light background this is byte-for-byte the old appearance; the light renders are pixel-identical before and after
- Macros are namespaced `\alnup`/`\alnleft`/`\alnmatch`. They were `\drawup`/`\drawleft`/`\drawmatch`, which collided: older generated output defines those three itself with `\newcommand`, so loading the package alongside such a file was a fatal "Command already defined". Do not reintroduce the generic names
- The `.sty` is generated and carries a do-not-edit banner — change `alignment-macros.tex` and regenerate. Documents that `\usepackage{alignment-macros}` then share exactly the styles the generated standalone output uses
- `every-emitted-style-is-defined` (in `tikz_view_test.clj`) fails if the renderer emits a style the macros file does not define, catching drift before pdflatex does

### Shadow-CLJS Development
- Development server runs at `http://localhost:3000`
- Shadow-CLJS provides live code reloading for ClojureScript
- CSS changes are automatically reloaded
- REPL available via `npm run repl` or through editor integration

## Architecture

### Core Modules
- **pairwise.alignment**: Multimethod definitions and shared traceback/path logic, dispatching on `:gap-model` (`:linear` or `:affine`)
- **pairwise.linear**: Linear gap penalty implementations (Needleman-Wunsch/Smith-Waterman)
- **pairwise.affine**: Affine gap penalty implementations (Gotoh algorithm with three-state DP: V'M, V'X, V'Y)
- **pairwise.viz-model**: Shared visualisation IR — transforms alignment results into renderer-agnostic drawing instructions (`.cljc`, used by both TikZ and webapp)
- **pairwise.substitution**: Scoring matrix utilities and sequence validation
- **pairwise.tikz-view**: TikZ/LaTeX renderer — consumes IR instructions to produce Beamer-compatible LaTeX output
- **pairwise.webapp**: Reagent-based pedagogical web interface — consumes IR instructions for SVG visualisation (linear and affine gaps)
- **pairwise.main**: Command-line interface (supports both linear and affine)

### Key Components
- **Dynamic Programming Matrix**: Built using `build-dp-matrix` with configurable scoring matrices
- **Path Finding**: `findpaths` function traces optimal alignment paths through the DP matrix
- **Alignment Generation**: `path-to-alignment` converts optimal paths to sequence alignments
- **Scoring Matrices**: Support for standard matrices (BLOSUM, PAM) and user-defined simple matrices

### Web Application
- Built with Reagent (React wrapper for ClojureScript)
- Styled with Tailwind CSS via CDN (custom NUS colour theme defined in `index.html`)
- KaTeX via CDN for LaTeX math rendering of recurrences
- SVG visualisation of dynamic programming matrices with colour-coded arrows
- Colour scheme: blue (`#56B4E9`) for match/diagonal, red (`#DC2626`) for gap in seq 1/vertical, green (`#009E73`) for gap in seq 2/horizontal — consistent across linear and affine modes
- `state-color` map defines colours shared by both SVG renderers and algorithm detail headings
- `direction-state` maps `:diag`/`:vert`/`:horiz` to `:M`/`:X`/`:Y`; `arrow-color` looks the hue up through it
- `mismatch-dash` adds `stroke-dasharray` to diagonal path arrows that align two different residues
- Affine mode: state toggle (All/V'M/V'X/V'Y/Optimal) controls both SVG opacity and algorithm detail highlighting
- `help-toggle` component provides contextual (?) popups with optional `:align :right` for edge placement
- `collapsible` component for expandable educational sections
- Panel headers use `bg-nus-slate` (lighter blue); page header uses `bg-nus-navy` (deep blue)
- Mobile responsive: flex layouts stack vertically, toggle buttons wrap, help popups constrained to viewport
- DNA/protein toggle: switches alphabet, sanitisation, scoring defaults, and gates BLOSUM/PAM availability
- `switch-sequence-type!` re-sanitises sequences and applies `dna-scoring-defaults` or `protein-scoring-defaults`
- `switch-alignment-type!` only sets `:alignment-type` and recomputes — never touches sequence type or scoring
- Semi-global alignments carry `:pattern` and `:description` keys (from `classify-alignment`) on each alignment map; these are displayed beneath each alignment in the results panel
- Every alignment carries `:middle`, the conservation line from `alignment/match-line`, displayed between the two sequences. The container needs `whitespace-pre` — the line encodes gaps as spaces, which HTML would otherwise collapse
- Real-time alignment computation as parameters change

### File Structure
- `src/pairwise/`: Core Clojure/ClojureScript source code
- `resources/data/`: Standard scoring matrices (BLOSUM, PAM)
- `resources/tikz/`: `alignment-macros.tex` holds the arrow macros and style definitions — the single source of truth for the TikZ visual grammar; `preamble.tex` holds only the standalone document class and package loads. `tikz-view` concatenates the two for self-contained output, and `clojure -T:build sty` wraps the macros alone as a LaTeX package
- `resources/public/`: Web assets and compiled JavaScript (includes Tailwind/KaTeX CDN config in `index.html`)
- `resources/public/css/style.css`: Minimal custom CSS (mostly handled by Tailwind)
- `demo/`: Standalone demo build output (mirrors `resources/public/index.html`)
- `plans/`: Design documents and implementation plans
- `test/`: Unit tests

### Visualisation IR
- **pairwise.viz-model** produces a renderer-agnostic intermediate representation from alignment results
- IR is a map with `:dimensions`, `:sequences`, and `:instructions` (a flat vector of typed instruction maps)
- Linear instruction types: `:grid`, `:seq-label`, `:cell-score`, `:dp-arrow`, `:path-arrow`
- Affine instruction types: `:grid`, `:seq-label`, `:cell-score`, `:state-scores`, `:state-arrow`, `:decomposition-phase`
- `:state-scores` carries per-cell `:vm`, `:vx`, `:vy` values for three-state visualisation
- `:state-arrow` carries `:from-state`/`:to-state` (`:M`/`:X`/`:Y`) and `:arrow-type` (`:dp`/`:optimal`)
- `:substitution-type` (`:match`/`:mismatch`) is attached only to arrows that align a residue pair — diagonal `:path-arrow`s and `:state-arrow`s leaving `:M`. It is `nil` on gap arrows: it describes the step, not the cell
- `:decomposition-phase` enables Beamer layer decomposition — three overlay slides highlighting one state each
- Each instruction carries grid coordinates (row/col) — renderers convert to pixels or TikZ units
- In the IR, `:from-row`/`:from-col` is the current cell; `:to-row`/`:to-col` is the predecessor
- `:step` numbers on instructions enable Beamer overlays (TikZ) and could enable web animation
- `alignment->instructions` takes an options map; `:last-overlay n` limits the build to n steps and `:overflow` (`:drop` default, or `:collapse`) decides whether later instructions are marked `:past-cap` or re-timed onto step n+1. `:drop` marks rather than removes: the cap limits the presentation, not the printed page, so the renderer — which knows the handout rule for each role — decides whether the content survives. Steps are numbered before truncation, so the result is exactly the opening slides of the full build rather than a renumbered one — verified by pixel-comparing pages of a capped build against the same pages of the uncapped one
- Truncation keeps `:grid` and `:seq-label` (they carry no `:step` and are always drawn), trims `:decomposition-phase` one state at a time via `:start-step`, and derives `:max-progressive-step` from what actually survived so Beamer neither pads the deck with empty overlays nor hides a `:collapse` jump slide
- A decomposition phase starting past the cap is dropped under both overflow policies — it is a separate exposition, not part of the solution being jumped to
- `tikz-view` builds every overlay specification through one `visible` helper, switched by the `*overlays*` dynamic var. Nothing else in the renderer emits `\visible`
- Both `tikz-view` and `webapp` consume this IR via `render-instruction` multimethods dispatching on `:type`
- **Shared visual grammar** — both renderers, both gap models, encode these channels and nothing else. Each channel carries exactly one meaning:
  - *hue* = what the move means. Grid direction maps one-to-one onto the affine states (`:diag`≡V'M, `:vert`≡V'X, `:horiz`≡V'Y), so the linear picture is the affine picture with the states collapsed. Each renderer has a `direction-state` map making this explicit
  - *weight and saturation* = optimality. Candidate moves the recurrence considered are thin and pale (TikZ `dp-M`/`dp-X`/`dp-Y`, hue at 40%; SVG 1.5px at 0.5 opacity); moves on an optimal path are thick and saturated (TikZ `opt-*`; SVG 4px at full opacity). The `-dim` TikZ variants push non-highlighted states back during affine decomposition overlays
  - *arrowhead* (TikZ only) = also optimality, redundantly. Only `opt-*` styles carry `->`; the head lives in the style, not in the `\alnup`/`\alnleft`/`\alnmatch` macros. A cell's predecessors are always up and/or left, so on a candidate arrow the head is redundant with the geometry and students read it as a puzzle rather than a cue; on the optimal path it marks a traversal they actually follow. Do not put heads back on `dp-*`. The web app draws no heads at all — a deliberate difference, not an oversight
  - *line style* = residue identity. A dashed diagonal aligns a mismatch; everything else is solid
- Do not add a fourth meaning to hue. Earlier TikZ output coloured optimal arrows black vs red for `optimal-but-non-identical`, which read as an error state, collided with red-for-gap, and was derived from the wrong thing (the cell's `:substitution-type` rather than the arrow's)
- Affine SVG renderers are called directly with extra args (`cs`, `active-state`) for the layer toggle

### Conservation Line
- `alignment/match-line` builds a per-column line, attached to every alignment as `:middle` by `pairwise-align` and shown by both the CLI and the web app
- `|` identity; `:` a differing pair the matrix scores **> 0** (conservative substitution); `.` any other differing pair; space for a gap in either sequence
- Strictly positive, following BLAST (whose `Positives`/`+` means > 0) and EMBOSS. A log-odds matrix scores a pair zero when it occurs exactly as often as chance predicts — absence of evidence for conservation, not evidence for it. Zero and missing entries both read as `.`
- The boundary is not marginal: of BLOSUM50's 190 distinct non-identical standard pairs, 23 are positive, 22 are exactly zero and 145 are negative, so `>= 0` would nearly double what shows as `:`
- The matrix is consulted as `[top bottom]` and then `[bottom top]`, matching how `linear`/`affine` look up substitution scores, so an asymmetric or partial matrix still resolves

### Alignment Types
- `:global`: Needleman-Wunsch algorithm for global alignment
- `:local`: Smith-Waterman algorithm for local alignment
- `:semiglobal`: All four matrix edges free (row 0, col 0 initialised to 0; traceback starts from last row or last column, ends at row 0 or col 0). The result is annotated via `classify-alignment` to describe the structural relationship (containment, suffix–prefix overlap, etc.) — there is no separate `:overlap` type

### Gap Models
- `:linear`: Gap of length k costs k*d (single penalty parameter)
- `:affine`: Gap of length k costs d + (k-1)*e (Durbin et al. convention; opening penalty d, extension penalty e). Uses the three-state recurrence (V'M, V'X, V'Y) with per-state traceback and a state-expanded graph (`[row col :M/:X/:Y]` nodes). This is equivalent to the SS-2 algorithm of Altschul and Erickson (1986), which correctly finds all optimal alignments — unlike Gotoh's original (1982) algorithm, which can miss the optimum due to incomplete traceback information

### Sequence Types
- `:protein` (default): 20+ amino acid one-letter codes; invalid characters replaced with `X`
- `:dna`: 4-letter alphabet (A, C, G, T); non-ACGT characters stripped (not replaced)
- `sanitise` accepts optional second argument for seq-type (1-arity defaults to `:protein`)
- Web app: DNA/protein toggle in input panel; switching to DNA hides BLOSUM/PAM (protein-only), auto-switches to simple matrix, re-sanitises sequences, and applies DNA-appropriate scoring defaults (match=2, mismatch=-3, gap=3, gap-open=5, gap-extend=2)
- CLI: `--seq-type` / `-s` flag (`protein` or `dna`)
- Alignment type and sequence type are independent controls — switching alignment type never changes sequence type, sequences, or scoring parameters
- Maximum sequence length limited to 10 characters in web interface