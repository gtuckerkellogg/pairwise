# Migration Plan: Leiningen to deps.edn + Shadow-CLJS

## Phase 1: Core Dependencies Migration
- Create `deps.edn` with current dependencies updated to latest versions
- Convert Leiningen profiles to deps.edn aliases
- Update Clojure from 1.10.1 to 1.12.0 and ClojureScript to latest

## Phase 2: Build Tool Selection & Setup
**Recommend Shadow-CLJS over Figwheel-Main** because:
- Better npm integration and modern JS tooling
- Simpler configuration with sensible defaults
- Multiple build targets (dev, prod, demo) in one config
- Active development and community adoption

- Install shadow-cljs via npm 
- Create `shadow-cljs.edn` configuration file
- Convert 3 existing cljsbuild targets (dev, min, demo)

## Phase 3: Development Workflow
- Configure shadow-cljs watch modes for live reloading
- Set up nREPL integration for REPL development
- Configure CSS hot-reloading equivalent to Figwheel
- Update HTML files to reference new build outputs

## Phase 4: Scripts & Documentation
- Create npm scripts or Makefile for common tasks
- Update README.md with new build commands
- Update CLAUDE.md with new development workflow
- Add `.gitignore` entries for shadow-cljs outputs

## Phase 5: Testing & Cleanup
- Verify all build targets work correctly
- Test hot reloading and REPL functionality
- Remove old Leiningen files (project.clj, figwheel_server.log)
- Clean up old build artifacts

**Benefits**: Modern tooling, simpler config, better JS ecosystem integration, active community support.