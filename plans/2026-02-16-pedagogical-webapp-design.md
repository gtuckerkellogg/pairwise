# Pedagogical Web Application Design

**Date:** 2026-02-16
**Status:** Approved

## Goal

Transform the bare-bones pairwise alignment web app into a proper pedagogical tool with educational content about the algorithms, parameters, and visualization — serving both university students and self-learners.

## Key Design Decisions

- **Layout:** Integrated panels — educational content woven into the interface alongside the interactive tool, with collapsible/expandable sections
- **Styling:** Tailwind CSS via CDN (v4 play CDN), replacing Bootstrap 3. NUS color palette retained (`#003D7C` navy, `#EF7C00` orange)
- **Content depth:** Adaptive — conceptual summaries visible by default, formal mathematics in expandable sub-sections
- **Branding:** Personal attribution (Greg Tucker-Kellogg), not institutional
- **References:** Full academic citations with contextual connections (e.g., default sequences from Durbin et al.)

## Page Structure

```
┌─────────────────────────────────────────────────┐
│  Header: "Pairwise Sequence Alignment"          │
│  Subtitle: Interactive exploration of DP algos  │
├─────────────────────────────────────────────────┤
│  Introduction (collapsible, open by default)    │
│  - Self-contained: what is alignment, why it    │
│    matters, tie → multiple optimal alignments   │
│  - Note: defaults reproduce Durbin et al. Ch. 2 │
│  - Expandable: biological motivation            │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │ Controls     │  │ SVG Visualization       │  │
│  │ with (?)     │  │                         │  │
│  │ contextual   │  │                         │  │
│  │ help icons   │  │                         │  │
│  │              │  │                         │  │
│  │ Alignment    │  │                         │  │
│  │ results      │  │                         │  │
│  └──────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────┤
│  Algorithm Details (reactive to tool state)      │
│  - Content changes with gap model + toggles     │
│  - Affine toggles control both viz & text       │
│  - Each state: summary + expandable recurrence  │
├─────────────────────────────────────────────────┤
│  References (full citations)                    │
├─────────────────────────────────────────────────┤
│  Footer: Created by Greg Tucker-Kellogg         │
└─────────────────────────────────────────────────┘
```

## Contextual Parameter Help

Each parameter group gets a `(?)` toggle with brief, practical explanation:

- **Alignment type:** Global finds best end-to-end alignment(s); local finds highest-scoring subsequence pair(s). Ties yield multiple optimal alignments, all reported.
- **Scoring matrix (standard):** BLOSUM/PAM encode evolutionary substitution likelihoods. Higher BLOSUM numbers → more closely related sequences.
- **Scoring matrix (user-defined):** Simple match/mismatch scheme for identical vs different residues.
- **Gap model (linear):** Each gap position costs d. Gap of length k costs k×d.
- **Gap model (affine):** Opening costs d, extending costs e. Gap of length k costs d + (k-1)×e. Reflects biological tendency for indels to occur in contiguous blocks.
- **Gap open / Gap extend:** Larger d relative to e discourages new gaps but tolerates longer ones.

## Reactive Algorithm Details

### Linear gap model active

- Show the linear DP recurrence for whichever alignment type is selected
- Global: explain initialization and full-matrix fill
- Local: explain the max(..., 0) modification and free-ride edges

### Affine gap model active

The state toggle (All / V'M / V'X / V'Y / Optimal) controls both the visualization AND the algorithm details section simultaneously:

- **V'M active:** Show and highlight V'M recurrence; explain match/mismatch transitions
- **V'X active:** Show V'X recurrence; explain gap-opening vs gap-extension in top sequence
- **V'Y active:** Show V'Y recurrence; explain gap-opening vs gap-extension in bottom sequence
- **All:** Show all three recurrences together with their relationships
- **Optimal:** Explain traceback through the state-expanded graph; how optimal paths traverse between states

Each shows a conceptual summary by default with expandable formal recurrence.

## Introduction Content

Self-contained, no prerequisite reading assumed:

> Pairwise alignment compares two biological sequences to identify regions of similarity. Using dynamic programming, we fill a scoring matrix where each cell represents the best alignment score up to that point. The optimal alignment(s) are found by tracing back through the matrix — when multiple paths achieve the same score, all optimal alignments are reported.
>
> Two classical algorithms solve this problem: **Needleman-Wunsch** (1970) for global alignment and **Smith-Waterman** (1981) for local alignment. Both can use either a simple linear gap penalty or the more realistic **affine gap model** (Gotoh, 1982), which distinguishes between opening and extending a gap.
>
> *The default sequences and BLOSUM50 matrix reproduce the example from Durbin et al. (1998), Ch. 2.*

Collapsible, open by default. Expandable sub-section on biological motivation.

## References

- Needleman, S.B. & Wunsch, C.D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *J. Mol. Biol.* 48(3), 443–453.
- Smith, T.F. & Waterman, M.S. (1981). Identification of common molecular subsequences. *J. Mol. Biol.* 147(1), 195–197.
- Gotoh, O. (1982). An improved algorithm for matching biological sequences. *J. Mol. Biol.* 162(3), 705–708.
- Altschul, S.F. & Erickson, B.W. (1986). Optimal sequence alignment using affine gap costs. *Bull. Math. Biol.* 48(5–6), 603–616.
- Durbin, R., Eddy, S.R., Krogh, A. & Mitchison, G. (1998). *Biological Sequence Analysis: Probabilistic Models of Proteins and Nucleic Acids.* Cambridge University Press.

Note: The affine gap implementation uses the Altschul & Erickson (1986) three-state formulation (SS-2), which correctly enumerates all optimal alignments — unlike Gotoh's original (1982) algorithm.

## Styling Migration

- Replace Bootstrap 3 CDN with Tailwind CSS CDN (`<script src="https://cdn.tailwindcss.com">`)
- Configure NUS colors as custom Tailwind theme colors
- Migrate Bootstrap grid/panel/button classes to Tailwind equivalents
- Footer: "Created by Greg Tucker-Kellogg" with contact link

## Technical Approach

- All changes in `index.html` (Tailwind CDN, remove Bootstrap) and `webapp.cljs` (new Reagent components, Tailwind classes)
- CSS file (`style.css`) replaced or heavily simplified since Tailwind handles styling
- New Reagent components: `introduction-section`, `parameter-help`, `algorithm-details`, `references-section`, `collapsible`
- Algorithm details component reads `:gap-model` and `:active-state` from app-state to render reactive content
- No new dependencies beyond the Tailwind CDN script tag
