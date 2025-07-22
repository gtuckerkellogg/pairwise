# pairwise

A Clojure/Clojurescript library for pairwise sequence comparison using dynamic programming algorithms (Needleman-Wunsch and Smith-Waterman) with linear gap penalties.

When published on github, the application will run at [demo](demo/index.html).

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

### Testing

```bash
# Run tests
npm test
# or
clojure -M:test
```
