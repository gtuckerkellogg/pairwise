# pairwise

A Clojure/Clojurescript library for pairwise sequence comparison using dynamic programming algorithms (Needleman-Wunsch and Smith-Waterman) with linear gap penalties.

When published on github, the application will run at [demo](https://gtuckerkellogg.github.io/pairwise).

## Usage

This project now uses [Clojure CLI tools](https://clojure.org/guides/getting_started) and [Shadow CLJS](https://shadow-cljs.github.io/docs/UsersGuide.html) for building.

### Development

```bash
# Install dependencies
npm install

# Start development server with hot reloading
npm run dev
# or
clojure -M:dev watch app

# Open http://localhost:3000 in your browser
```

### Building

```bash
# Build demo site
npm run demo

# Build production version
npm run build
```

### Command-Line Interface

Install the CLI to `~/bin`:

```bash
clojure -T:build install
```

This builds an uber JAR, copies it to `~/bin/pairwise.jar`, and creates a `~/bin/pairwise` wrapper script. Make sure `~/bin` is on your `PATH`.

```bash
# Global alignment with BLOSUM50
pairwise -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 -g 8

# Local alignment with BLOSUM62
pairwise -1 HEAGAWGHEE -2 PAWHEAE -t local -m BLOSUM62

# Affine gap penalties
pairwise -1 HEAGAWGHEE -2 PAWHEAE -m BLOSUM50 --gap-model affine --gap-open 12 --gap-extend 2

# Generate TikZ/LaTeX visualization
pairwise -1 ACGT -2 ACGT -o alignment.tex

# Full usage
pairwise --help
```

### Testing

```bash
# Run tests
npm test
# or
clojure -M:test
```
