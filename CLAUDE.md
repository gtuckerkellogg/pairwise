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
- DNA overlap example: `pairwise -1 GATTACA -2 TACAGAT -s dna -t overlap --match 2 --mismatch -3 -g 3`

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
- `arrow-color` derives direction from IR coordinates (`from` = current cell, `to` = predecessor)
- Affine mode: state toggle (All/V'M/V'X/V'Y/Optimal) controls both SVG opacity and algorithm detail highlighting
- `help-toggle` component provides contextual (?) popups with optional `:align :right` for edge placement
- `collapsible` component for expandable educational sections
- Panel headers use `bg-nus-slate` (lighter blue); page header uses `bg-nus-navy` (deep blue)
- Mobile responsive: flex layouts stack vertically, toggle buttons wrap, help popups constrained to viewport
- DNA/protein toggle: switches alphabet, sanitisation, scoring defaults, and gates BLOSUM/PAM availability
- `switch-sequence-type!` re-sanitises sequences and applies `dna-scoring-defaults` or `protein-scoring-defaults`
- `switch-alignment-type!` only sets `:alignment-type` and recomputes — never touches sequence type or scoring
- Real-time alignment computation as parameters change

### File Structure
- `src/pairwise/`: Core Clojure/ClojureScript source code
- `resources/data/`: Standard scoring matrices (BLOSUM, PAM)
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
- `:decomposition-phase` enables Beamer layer decomposition — three overlay slides highlighting one state each
- Each instruction carries grid coordinates (row/col) — renderers convert to pixels or TikZ units
- In the IR, `:from-row`/`:from-col` is the current cell; `:to-row`/`:to-col` is the predecessor
- `:step` numbers on instructions enable Beamer overlays (TikZ) and could enable web animation
- Both `tikz-view` and `webapp` consume this IR via `render-instruction` multimethods dispatching on `:type`
- Affine SVG renderers are called directly with extra args (`cs`, `active-state`) for the layer toggle

### Alignment Types
- `:global`: Needleman-Wunsch algorithm for global alignment
- `:local`: Smith-Waterman algorithm for local alignment
- `:semiglobal`: All four matrix edges free (row 0, col 0 initialised to 0; traceback starts from last row or last column, ends at row 0 or col 0) — fits one sequence inside another
- `:overlap`: Suffix-of-s1 / prefix-of-s2 overlap (row 0 free, col 0 penalised; traceback starts from last column, ends at row 0)

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