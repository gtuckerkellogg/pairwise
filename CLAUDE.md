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
- **pairwise.substitution**: Scoring matrix utilities and sequence validation
- **pairwise.webapp**: Reagent-based web interface (linear gaps only)
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

### Alignment Types
- `:global`: Needleman-Wunsch algorithm for global alignment
- `:local`: Smith-Waterman algorithm for local alignment

### Gap Models
- `:linear`: Gap of length k costs k*d (single penalty parameter)
- `:affine`: Gap of length k costs d + (k-1)*e (Durbin et al. convention; opening penalty d, extension penalty e). Uses Gotoh's three-state recurrence with state-expanded traceback graph (`[row col :M/:X/:Y]` nodes)

### Sequence Validation
- Input sequences are sanitized to valid protein characters
- Invalid characters replaced with 'X'
- Maximum sequence length limited to 10 characters in web interface