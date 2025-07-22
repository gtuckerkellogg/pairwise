# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Clojure/ClojureScript library for pairwise sequence comparison using dynamic programming algorithms (Needleman-Wunsch and Smith-Waterman) with linear gap penalties. The project includes both a command-line interface and an interactive web application.

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

### Shadow-CLJS Development
- Development server runs at `http://localhost:3000`
- Shadow-CLJS provides live code reloading for ClojureScript
- CSS changes are automatically reloaded
- REPL available via `npm run repl` or through editor integration

## Architecture

### Core Modules
- **pairwise.linear**: Core dynamic programming algorithms for sequence alignment
- **pairwise.substitution**: Scoring matrix utilities and sequence validation
- **pairwise.webapp**: Reagent-based web interface
- **pairwise.main**: Command-line interface (incomplete)

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

### Sequence Validation
- Input sequences are sanitized to valid protein characters
- Invalid characters replaced with 'X'
- Maximum sequence length limited to 10 characters in web interface