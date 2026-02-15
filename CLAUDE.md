# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Clojure/ClojureScript library for pairwise sequence comparison using dynamic programming algorithms (Needleman-Wunsch and Smith-Waterman) with linear and affine gap penalties (Gotoh algorithm). The project includes both a command-line interface and an interactive web application.

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
- **pairwise.viz-model**: Shared visualization IR — transforms alignment results into renderer-agnostic drawing instructions (`.cljc`, used by both TikZ and webapp)
- **pairwise.substitution**: Scoring matrix utilities and sequence validation
- **pairwise.tikz-view**: TikZ/LaTeX renderer — consumes IR instructions to produce Beamer-compatible LaTeX output
- **pairwise.webapp**: Reagent-based web interface — consumes IR instructions for SVG visualization (linear and affine gaps)
- **pairwise.main**: Command-line interface (supports both linear and affine)

### Key Components
- **Dynamic Programming Matrix**: Built using `build-dp-matrix` with configurable scoring matrices
- **Path Finding**: `findpaths` function traces optimal alignment paths through the DP matrix
- **Alignment Generation**: `path-to-alignment` converts optimal paths to sequence alignments
- **Scoring Matrices**: Support for standard matrices (BLOSUM, PAM) and user-defined simple matrices

### Web Application
- Built with Reagent (React wrapper for ClojureScript)
- Interactive forms using reagent-forms
- SVG visualization of dynamic programming matrices with optimal paths
- Real-time alignment computation as parameters change

### File Structure
- `src/pairwise/`: Core Clojure/ClojureScript source code
- `resources/data/`: Standard scoring matrices (BLOSUM, PAM)
- `resources/public/`: Web assets and compiled JavaScript
- `demo/`: Standalone demo build output
- `test/`: Unit tests

### Visualization IR
- **pairwise.viz-model** produces a renderer-agnostic intermediate representation from alignment results
- IR is a map with `:dimensions`, `:sequences`, and `:instructions` (a flat vector of typed instruction maps)
- Linear instruction types: `:grid`, `:seq-label`, `:cell-score`, `:dp-arrow`, `:path-arrow`
- Affine instruction types: `:grid`, `:seq-label`, `:cell-score`, `:state-scores`, `:state-arrow`, `:decomposition-phase`
- `:state-scores` carries per-cell `:vm`, `:vx`, `:vy` values for three-state visualization
- `:state-arrow` carries `:from-state`/`:to-state` (`:M`/`:X`/`:Y`) and `:arrow-type` (`:dp`/`:optimal`)
- `:decomposition-phase` enables Beamer layer decomposition — three overlay slides highlighting one state each
- Each instruction carries grid coordinates (row/col) — renderers convert to pixels or TikZ units
- `:step` numbers on instructions enable Beamer overlays (TikZ) and could enable web animation
- Both `tikz-view` and `webapp` consume this IR via `render-instruction` multimethods dispatching on `:type`
- Affine SVG renderers are called directly with extra args (`cs`, `active-state`) for the layer toggle

### Alignment Types
- `:global`: Needleman-Wunsch algorithm for global alignment
- `:local`: Smith-Waterman algorithm for local alignment

### Gap Models
- `:linear`: Gap of length k costs k*d (single penalty parameter)
- `:affine`: Gap of length k costs d + (k-1)*e (Durbin et al. convention; opening penalty d, extension penalty e). Uses the three-state recurrence (V'M, V'X, V'Y) with per-state traceback and a state-expanded graph (`[row col :M/:X/:Y]` nodes). This is equivalent to the SS-2 algorithm of Altschul and Erickson (1986), which correctly finds all optimal alignments — unlike Gotoh's original (1982) algorithm, which can miss the optimum due to incomplete traceback information

### Sequence Validation
- Input sequences are sanitized to valid protein characters
- Invalid characters replaced with 'X'
- Maximum sequence length limited to 10 characters in web interface (7 for affine mode)