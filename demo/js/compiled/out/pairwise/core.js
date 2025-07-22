// Compiled by ClojureScript 1.9.229 {:static-fns true, :optimize-constants true}
goog.provide('pairwise.core');
goog.require('cljs.core');
goog.require('reagent.core');
goog.require('reagent_forms.core');
goog.require('pairwise.linear');
goog.require('pairwise.substitution');
goog.require('pairwise.cljsmacros');
cljs.core.enable_console_print_BANG_();
if(typeof pairwise.core.scoring_matrices !== 'undefined'){
} else {
pairwise.core.scoring_matrices = new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$blosum62,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$name,"BLOSUM62",cljs.core.cst$kw$matrix,pairwise.substitution.scoring_matrix("#  Matrix made by matblas from blosum62.iij\n#  * column uses minimum score\n#  BLOSUM Clustered Scoring Matrix in 1/2 Bit Units\n#  Blocks Database = /data/blocks_5.0/blocks.dat\n#  Cluster Percentage: >= 62\n#  Entropy =   0.6979, Expected =  -0.5209\n   A  R  N  D  C  Q  E  G  H  I  L  K  M  F  P  S  T  W  Y  V  B  Z  X  *\nA  4 -1 -2 -2  0 -1 -1  0 -2 -1 -1 -1 -1 -2 -1  1  0 -3 -2  0 -2 -1  0 -4 \nR -1  5  0 -2 -3  1  0 -2  0 -3 -2  2 -1 -3 -2 -1 -1 -3 -2 -3 -1  0 -1 -4 \nN -2  0  6  1 -3  0  0  0  1 -3 -3  0 -2 -3 -2  1  0 -4 -2 -3  3  0 -1 -4 \nD -2 -2  1  6 -3  0  2 -1 -1 -3 -4 -1 -3 -3 -1  0 -1 -4 -3 -3  4  1 -1 -4 \nC  0 -3 -3 -3  9 -3 -4 -3 -3 -1 -1 -3 -1 -2 -3 -1 -1 -2 -2 -1 -3 -3 -2 -4 \nQ -1  1  0  0 -3  5  2 -2  0 -3 -2  1  0 -3 -1  0 -1 -2 -1 -2  0  3 -1 -4 \nE -1  0  0  2 -4  2  5 -2  0 -3 -3  1 -2 -3 -1  0 -1 -3 -2 -2  1  4 -1 -4 \nG  0 -2  0 -1 -3 -2 -2  6 -2 -4 -4 -2 -3 -3 -2  0 -2 -2 -3 -3 -1 -2 -1 -4 \nH -2  0  1 -1 -3  0  0 -2  8 -3 -3 -1 -2 -1 -2 -1 -2 -2  2 -3  0  0 -1 -4 \nI -1 -3 -3 -3 -1 -3 -3 -4 -3  4  2 -3  1  0 -3 -2 -1 -3 -1  3 -3 -3 -1 -4 \nL -1 -2 -3 -4 -1 -2 -3 -4 -3  2  4 -2  2  0 -3 -2 -1 -2 -1  1 -4 -3 -1 -4 \nK -1  2  0 -1 -3  1  1 -2 -1 -3 -2  5 -1 -3 -1  0 -1 -3 -2 -2  0  1 -1 -4 \nM -1 -1 -2 -3 -1  0 -2 -3 -2  1  2 -1  5  0 -2 -1 -1 -1 -1  1 -3 -1 -1 -4 \nF -2 -3 -3 -3 -2 -3 -3 -3 -1  0  0 -3  0  6 -4 -2 -2  1  3 -1 -3 -3 -1 -4 \nP -1 -2 -2 -1 -3 -1 -1 -2 -2 -3 -3 -1 -2 -4  7 -1 -1 -4 -3 -2 -2 -1 -2 -4 \nS  1 -1  1  0 -1  0  0  0 -1 -2 -2  0 -1 -2 -1  4  1 -3 -2 -2  0  0  0 -4 \nT  0 -1  0 -1 -1 -1 -1 -2 -2 -1 -1 -1 -1 -2 -1  1  5 -2 -2  0 -1 -1  0 -4 \nW -3 -3 -4 -4 -2 -2 -3 -2 -2 -3 -2 -3 -1  1 -4 -3 -2 11  2 -3 -4 -3 -2 -4 \nY -2 -2 -2 -3 -2 -1 -2 -3  2 -1 -1 -2 -1  3 -3 -2 -2  2  7 -1 -3 -2 -1 -4 \nV  0 -3 -3 -3 -1 -2 -2 -3 -3  3  1 -2  1 -1 -2 -2  0 -3 -1  4 -3 -2 -1 -4 \nB -2 -1  3  4 -3  0  1 -1  0 -3 -4  0 -3 -3 -2  0 -1 -4 -3 -3  4  1 -1 -4 \nZ -1  0  0  1 -3  3  4 -2  0 -3 -3  1 -1 -3 -1  0 -1 -3 -2 -2  1  4 -1 -4 \nX  0 -1 -1 -1 -2 -1 -1 -1 -1 -1 -1 -1 -1 -1 -2  0  0 -2 -1 -1 -1 -1 -1 -4 \n* -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4  1 \n")], null),cljs.core.cst$kw$blosum50,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$name,"BLOSUM50",cljs.core.cst$kw$matrix,pairwise.substitution.scoring_matrix("#\r\n#BLOSUM50 amino acid substitution matrix, February 20, 1996 14:33\r\n#\r\n#Default scoring matrix used by FASTA and TFASTA for comparison of amino acid sequences\r\n#\r\n#TFASTA ignores the gap creation and extension penalties specified in this matrix\r\n#\r\n#GAPweight: 16, LENgthweight: 4\r\n#\r\n   A  B  C  D  E  F  G  H  I  K  L  M  N  P  Q  R  S  T  V  W  X  Y  Z  * \r\nA  5 -2 -1 -2 -1 -3  0 -2 -1 -1 -2 -1 -1 -1 -1 -2  1  0  0 -3 -1 -2 -1 -8 \r\nB -2  5 -3  5  1 -4 -1  0 -4  0 -4 -3  4 -2  0 -1  0  0 -4 -5 -1 -3  2 -8\r\nC -1 -3 13 -4 -3 -2 -3 -3 -2 -3 -2 -2 -2 -4 -3 -4 -1 -1 -1 -5 -2 -3 -3 -8\r\nD -2  5 -4  8  2 -5 -1 -1 -4 -1 -4 -4  2 -1  0 -2  0 -1 -4 -5 -1 -3  1 -8\r\nE -1  1 -3  2  6 -3 -3  0 -4  1 -3 -2  0 -1  2  0 -1 -1 -3 -3 -1 -2  5 -8\r\nF -3 -4 -2 -5 -3  8 -4 -1  0 -4  1  0 -4 -4 -4 -3 -3 -2 -1  1 -2  4 -4 -8\r\nG  0 -1 -3 -1 -3 -4  8 -2 -4 -2 -4 -3  0 -2 -2 -3  0 -2 -4 -3 -2 -3 -2 -8\r\nH -2  0 -3 -1  0 -1 -2 10 -4  0 -3 -1  1 -2  1  0 -1 -2 -4 -3 -1  2  0 -8\r\nI -1 -4 -2 -4 -4  0 -4 -4  5 -3  2  2 -3 -3 -3 -4 -3 -1  4 -3 -1 -1 -3 -8\r\nK -1  0 -3 -1  1 -4 -2  0 -3  6 -3 -2  0 -1  2  3  0 -1 -3 -3 -1 -2  1 -8\r\nL -2 -4 -2 -4 -3  1 -4 -3  2 -3  5  3 -4 -4 -2 -3 -3 -1  1 -2 -1 -1 -3 -8\r\nM -1 -3 -2 -4 -2  0 -3 -1  2 -2  3  7 -2 -3  0 -2 -2 -1  1 -1 -1  0 -1 -8\r\nN -1  4 -2  2  0 -4  0  1 -3  0 -4 -2  7 -2  0 -1  1  0 -3 -4 -1 -2  0 -8\r\nP -1 -2 -4 -1 -1 -4 -2 -2 -3 -1 -4 -3 -2 10 -1 -3 -1 -1 -3 -4 -2 -3 -1 -8\r\nQ -1  0 -3  0  2 -4 -2  1 -3  2 -2  0  0 -1  7  1  0 -1 -3 -1 -1 -1  4 -8\r\nR -2 -1 -4 -2  0 -3 -3  0 -4  3 -3 -2 -1 -3  1  7 -1 -1 -3 -3 -1 -1  0 -8\r\nS  1  0 -1  0 -1 -3  0 -1 -3  0 -3 -2  1 -1  0 -1  5  2 -2 -4 -1 -2  0 -8\r\nT  0  0 -1 -1 -1 -2 -2 -2 -1 -1 -1 -1  0 -1 -1 -1  2  5  0 -3  0 -2 -1 -8\r\nV  0 -4 -1 -4 -3 -1 -4 -4  4 -3  1  1 -3 -3 -3 -3 -2  0  5 -3 -1 -1 -3 -8\r\nW -3 -5 -5 -5 -3  1 -3 -3 -3 -3 -2 -1 -4 -4 -1 -3 -4 -3 -3 15 -3  2 -2 -8\r\nX -1 -1 -2 -1 -1 -2 -2 -1 -1 -1 -1 -1 -1 -2 -1 -1 -1  0 -1 -3 -1 -1 -1 -8\r\nY -2 -3 -3 -3 -2  4 -3  2 -1 -2 -1  0 -2 -3 -1 -1 -2 -2 -1  2 -1  8 -2 -8\r\nZ -1  2 -3  1  5 -4 -2  0 -3  1 -3 -1  0 -1  4  0  0 -1 -3 -2 -1 -2  5 -8\r\n* -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8  1")], null),cljs.core.cst$kw$pam250,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$name,"PAM250",cljs.core.cst$kw$matrix,pairwise.substitution.scoring_matrix("#\n# This matrix was produced by \"pam\" Version 1.0.6 [28-Jul-93]\n#\n# PAM 250 substitution matrix, scale = ln(2)/3 = 0.231049\n#\n# Expected score = -0.844, Entropy = 0.354 bits\n#\n# Lowest score = -8, Highest score = 17\n#\n   A  R  N  D  C  Q  E  G  H  I  L  K  M  F  P  S  T  W  Y  V  B  Z  X  *\nA  2 -2  0  0 -2  0  0  1 -1 -1 -2 -1 -1 -3  1  1  1 -6 -3  0  0  0  0 -8\nR -2  6  0 -1 -4  1 -1 -3  2 -2 -3  3  0 -4  0  0 -1  2 -4 -2 -1  0 -1 -8\nN  0  0  2  2 -4  1  1  0  2 -2 -3  1 -2 -3  0  1  0 -4 -2 -2  2  1  0 -8\nD  0 -1  2  4 -5  2  3  1  1 -2 -4  0 -3 -6 -1  0  0 -7 -4 -2  3  3 -1 -8\nC -2 -4 -4 -5 12 -5 -5 -3 -3 -2 -6 -5 -5 -4 -3  0 -2 -8  0 -2 -4 -5 -3 -8\nQ  0  1  1  2 -5  4  2 -1  3 -2 -2  1 -1 -5  0 -1 -1 -5 -4 -2  1  3 -1 -8\nE  0 -1  1  3 -5  2  4  0  1 -2 -3  0 -2 -5 -1  0  0 -7 -4 -2  3  3 -1 -8\nG  1 -3  0  1 -3 -1  0  5 -2 -3 -4 -2 -3 -5  0  1  0 -7 -5 -1  0  0 -1 -8\nH -1  2  2  1 -3  3  1 -2  6 -2 -2  0 -2 -2  0 -1 -1 -3  0 -2  1  2 -1 -8\nI -1 -2 -2 -2 -2 -2 -2 -3 -2  5  2 -2  2  1 -2 -1  0 -5 -1  4 -2 -2 -1 -8\nL -2 -3 -3 -4 -6 -2 -3 -4 -2  2  6 -3  4  2 -3 -3 -2 -2 -1  2 -3 -3 -1 -8\nK -1  3  1  0 -5  1  0 -2  0 -2 -3  5  0 -5 -1  0  0 -3 -4 -2  1  0 -1 -8\nM -1  0 -2 -3 -5 -1 -2 -3 -2  2  4  0  6  0 -2 -2 -1 -4 -2  2 -2 -2 -1 -8\nF -3 -4 -3 -6 -4 -5 -5 -5 -2  1  2 -5  0  9 -5 -3 -3  0  7 -1 -4 -5 -2 -8\nP  1  0  0 -1 -3  0 -1  0  0 -2 -3 -1 -2 -5  6  1  0 -6 -5 -1 -1  0 -1 -8\nS  1  0  1  0  0 -1  0  1 -1 -1 -3  0 -2 -3  1  2  1 -2 -3 -1  0  0  0 -8\nT  1 -1  0  0 -2 -1  0  0 -1  0 -2  0 -1 -3  0  1  3 -5 -3  0  0 -1  0 -8\nW -6  2 -4 -7 -8 -5 -7 -7 -3 -5 -2 -3 -4  0 -6 -2 -5 17  0 -6 -5 -6 -4 -8\nY -3 -4 -2 -4  0 -4 -4 -5  0 -1 -1 -4 -2  7 -5 -3 -3  0 10 -2 -3 -4 -2 -8\nV  0 -2 -2 -2 -2 -2 -2 -1 -2  4  2 -2  2 -1 -1 -1  0 -6 -2  4 -2 -2 -1 -8\nB  0 -1  2  3 -4  1  3  0  1 -2 -3  1 -2 -4 -1  0  0 -5 -3 -2  3  2 -1 -8\nZ  0  0  1  3 -5  3  3  0  2 -2 -3  0 -2 -5  0  0 -1 -6 -4 -2  2  3 -1 -8\nX  0 -1  0 -1 -3 -1 -1 -1 -1 -1 -1 -1 -1 -2 -1  0  0 -4 -2 -1 -1 -1 -1 -8\n* -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8  1\n")], null),cljs.core.cst$kw$pam120,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$name,"PAM120",cljs.core.cst$kw$matrix,pairwise.substitution.scoring_matrix("#\n# This matrix was produced by \"pam\" Version 1.0.6 [28-Jul-93]\n#\n# PAM 120 substitution matrix, scale = ln(2)/2 = 0.346574\n#\n# Expected score = -1.64, Entropy = 0.979 bits\n#\n# Lowest score = -8, Highest score = 12\n#\n   A  R  N  D  C  Q  E  G  H  I  L  K  M  F  P  S  T  W  Y  V  B  Z  X  *\nA  3 -3 -1  0 -3 -1  0  1 -3 -1 -3 -2 -2 -4  1  1  1 -7 -4  0  0 -1 -1 -8\nR -3  6 -1 -3 -4  1 -3 -4  1 -2 -4  2 -1 -5 -1 -1 -2  1 -5 -3 -2 -1 -2 -8\nN -1 -1  4  2 -5  0  1  0  2 -2 -4  1 -3 -4 -2  1  0 -4 -2 -3  3  0 -1 -8\nD  0 -3  2  5 -7  1  3  0  0 -3 -5 -1 -4 -7 -3  0 -1 -8 -5 -3  4  3 -2 -8\nC -3 -4 -5 -7  9 -7 -7 -4 -4 -3 -7 -7 -6 -6 -4  0 -3 -8 -1 -3 -6 -7 -4 -8\nQ -1  1  0  1 -7  6  2 -3  3 -3 -2  0 -1 -6  0 -2 -2 -6 -5 -3  0  4 -1 -8\nE  0 -3  1  3 -7  2  5 -1 -1 -3 -4 -1 -3 -7 -2 -1 -2 -8 -5 -3  3  4 -1 -8\nG  1 -4  0  0 -4 -3 -1  5 -4 -4 -5 -3 -4 -5 -2  1 -1 -8 -6 -2  0 -2 -2 -8\nH -3  1  2  0 -4  3 -1 -4  7 -4 -3 -2 -4 -3 -1 -2 -3 -3 -1 -3  1  1 -2 -8\nI -1 -2 -2 -3 -3 -3 -3 -4 -4  6  1 -3  1  0 -3 -2  0 -6 -2  3 -3 -3 -1 -8\nL -3 -4 -4 -5 -7 -2 -4 -5 -3  1  5 -4  3  0 -3 -4 -3 -3 -2  1 -4 -3 -2 -8\nK -2  2  1 -1 -7  0 -1 -3 -2 -3 -4  5  0 -7 -2 -1 -1 -5 -5 -4  0 -1 -2 -8\nM -2 -1 -3 -4 -6 -1 -3 -4 -4  1  3  0  8 -1 -3 -2 -1 -6 -4  1 -4 -2 -2 -8\nF -4 -5 -4 -7 -6 -6 -7 -5 -3  0  0 -7 -1  8 -5 -3 -4 -1  4 -3 -5 -6 -3 -8\nP  1 -1 -2 -3 -4  0 -2 -2 -1 -3 -3 -2 -3 -5  6  1 -1 -7 -6 -2 -2 -1 -2 -8\nS  1 -1  1  0  0 -2 -1  1 -2 -2 -4 -1 -2 -3  1  3  2 -2 -3 -2  0 -1 -1 -8\nT  1 -2  0 -1 -3 -2 -2 -1 -3  0 -3 -1 -1 -4 -1  2  4 -6 -3  0  0 -2 -1 -8\nW -7  1 -4 -8 -8 -6 -8 -8 -3 -6 -3 -5 -6 -1 -7 -2 -6 12 -2 -8 -6 -7 -5 -8\nY -4 -5 -2 -5 -1 -5 -5 -6 -1 -2 -2 -5 -4  4 -6 -3 -3 -2  8 -3 -3 -5 -3 -8\nV  0 -3 -3 -3 -3 -3 -3 -2 -3  3  1 -4  1 -3 -2 -2  0 -8 -3  5 -3 -3 -1 -8\nB  0 -2  3  4 -6  0  3  0  1 -3 -4  0 -4 -5 -2  0  0 -6 -3 -3  4  2 -1 -8\nZ -1 -1  0  3 -7  4  4 -2  1 -3 -3 -1 -2 -6 -1 -1 -2 -7 -5 -3  2  4 -1 -8\nX -1 -2 -1 -2 -4 -1 -1 -2 -2 -1 -2 -2 -2 -3 -2 -1 -1 -5 -3 -1 -1 -1 -2 -8\n* -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8  1\n")], null),cljs.core.cst$kw$pam40,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$name,"PAM40",cljs.core.cst$kw$matrix,pairwise.substitution.scoring_matrix("#\n# This matrix was produced by \"pam\" Version 1.0.6 [28-Jul-93]\n#\n# PAM 40 substitution matrix, scale = ln(2)/2 = 0.346574\n#\n# Expected score = -4.27, Entropy = 2.26 bits\n#\n# Lowest score = -15, Highest score = 13\n#\n    A   R   N   D   C   Q   E   G   H   I   L   K   M   F   P   S   T   W   Y   V   B   Z   X   *\nA   6  -6  -3  -3  -6  -3  -2  -1  -6  -4  -5  -6  -4  -7  -1   0   0 -12  -7  -2  -3  -2  -3 -15\nR  -6   8  -5  -9  -7  -1  -8  -8  -1  -5  -8   1  -3  -8  -3  -2  -5  -1  -9  -7  -6  -3  -5 -15\nN  -3  -5   7   2  -9  -3  -1  -2   1  -4  -6   0  -7  -8  -5   0  -1  -7  -4  -7   6  -2  -3 -15\nD  -3  -9   2   7 -12  -2   3  -3  -3  -6 -11  -4  -9 -13  -7  -3  -4 -13 -10  -7   6   2  -5 -15\nC  -6  -7  -9 -12   9 -12 -12  -8  -7  -5 -13 -12 -12 -11  -7  -2  -7 -14  -3  -5 -11 -12  -8 -15\nQ  -3  -1  -3  -2 -12   8   2  -6   1  -7  -4  -2  -3 -11  -2  -4  -5 -11 -10  -6  -2   6  -4 -15\nE  -2  -8  -1   3 -12   2   7  -3  -4  -5  -8  -4  -6 -12  -5  -4  -5 -15  -8  -6   2   6  -4 -15\nG  -1  -8  -2  -3  -8  -6  -3   6  -8  -9  -9  -6  -7  -8  -5  -1  -5 -13 -12  -5  -2  -4  -4 -15\nH  -6  -1   1  -3  -7   1  -4  -8   9  -8  -5  -5  -9  -5  -3  -5  -6  -6  -3  -6  -1   0  -4 -15\nI  -4  -5  -4  -6  -5  -7  -5  -9  -8   8  -1  -5   0  -2  -7  -6  -2 -12  -5   2  -5  -5  -4 -15\nL  -5  -8  -6 -11 -13  -4  -8  -9  -5  -1   7  -7   1  -2  -6  -7  -6  -5  -6  -2  -8  -6  -5 -15\nK  -6   1   0  -4 -12  -2  -4  -6  -5  -5  -7   6  -1 -12  -6  -3  -2 -10  -8  -8  -2  -3  -4 -15\nM  -4  -3  -7  -9 -12  -3  -6  -7  -9   0   1  -1  11  -3  -7  -5  -3 -11 -10  -1  -8  -4  -4 -15\nF  -7  -8  -8 -13 -11 -11 -12  -8  -5  -2  -2 -12  -3   9  -9  -6  -8  -4   2  -7  -9 -12  -7 -15\nP  -1  -3  -5  -7  -7  -2  -5  -5  -3  -7  -6  -6  -7  -9   8  -1  -3 -12 -12  -5  -6  -3  -4 -15\nS   0  -2   0  -3  -2  -4  -4  -1  -5  -6  -7  -3  -5  -6  -1   6   1  -4  -6  -5  -1  -4  -2 -15\nT   0  -5  -1  -4  -7  -5  -5  -5  -6  -2  -6  -2  -3  -8  -3   1   7 -11  -6  -2  -2  -5  -3 -15\nW -12  -1  -7 -13 -14 -11 -15 -13  -6 -12  -5 -10 -11  -4 -12  -4 -11  13  -4 -14  -9 -13  -9 -15\nY  -7  -9  -4 -10  -3 -10  -8 -12  -3  -5  -6  -8 -10   2 -12  -6  -6  -4  10  -6  -6  -8  -7 -15\nV  -2  -7  -7  -7  -5  -6  -6  -5  -6   2  -2  -8  -1  -7  -5  -5  -2 -14  -6   7  -7  -6  -4 -15\nB  -3  -6   6   6 -11  -2   2  -2  -1  -5  -8  -2  -8  -9  -6  -1  -2  -9  -6  -7   6   1  -4 -15\nZ  -2  -3  -2   2 -12   6   6  -4   0  -5  -6  -3  -4 -12  -3  -4  -5 -13  -8  -6   1   6  -4 -15\nX  -3  -5  -3  -5  -8  -4  -4  -4  -4  -4  -5  -4  -4  -7  -4  -2  -3  -9  -7  -4  -4  -4  -4 -15\n* -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15 -15   1\n")], null)], null);
}
if(typeof pairwise.core.app_item_id !== 'undefined'){
} else {
pairwise.core.app_item_id = reagent.core.atom.cljs$core$IFn$_invoke$arity$1((0));
}
pairwise.core.app_results = (function pairwise$core$app_results(app_state){
var scoring_matrix = (function (){var pred__11529 = cljs.core._EQ_;
var expr__11530 = cljs.core.cst$kw$scoring_DASH_matrix_DASH_type.cljs$core$IFn$_invoke$arity$1(app_state);
if(cljs.core.truth_((function (){var G__11532 = cljs.core.cst$kw$simple;
var G__11533 = expr__11530;
return (pred__11529.cljs$core$IFn$_invoke$arity$2 ? pred__11529.cljs$core$IFn$_invoke$arity$2(G__11532,G__11533) : pred__11529.call(null,G__11532,G__11533));
})())){
return pairwise.substitution.simple_substitution_matrix.cljs$core$IFn$_invoke$arity$variadic(cljs.core.cst$kw$protein,cljs.core.array_seq([cljs.core.cst$kw$same,cljs.core.cst$kw$match_DASH_score.cljs$core$IFn$_invoke$arity$1(app_state),cljs.core.cst$kw$different,cljs.core.cst$kw$mismatch_DASH_score.cljs$core$IFn$_invoke$arity$1(app_state)], 0));
} else {
if(cljs.core.truth_((function (){var G__11534 = cljs.core.cst$kw$standard;
var G__11535 = expr__11530;
return (pred__11529.cljs$core$IFn$_invoke$arity$2 ? pred__11529.cljs$core$IFn$_invoke$arity$2(G__11534,G__11535) : pred__11529.call(null,G__11534,G__11535));
})())){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(pairwise.core.scoring_matrices,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$scoring_DASH_matrix.cljs$core$IFn$_invoke$arity$1(app_state),cljs.core.cst$kw$matrix], null));
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__11530)].join('')));
}
}
})();
return pairwise.linear.pairwise_align.cljs$core$IFn$_invoke$arity$variadic(cljs.core.cst$kw$top_DASH_seq.cljs$core$IFn$_invoke$arity$1(app_state),cljs.core.cst$kw$bottom_DASH_seq.cljs$core$IFn$_invoke$arity$1(app_state),scoring_matrix,cljs.core.cst$kw$gap_DASH_penalty.cljs$core$IFn$_invoke$arity$1(app_state),cljs.core.array_seq([cljs.core.cst$kw$type,cljs.core.cst$kw$alignment_DASH_type.cljs$core$IFn$_invoke$arity$1(app_state)], 0));
});
pairwise.core.draw_arrow = (function pairwise$core$draw_arrow(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11555 = arguments.length;
var i__7485__auto___11556 = (0);
while(true){
if((i__7485__auto___11556 < len__7484__auto___11555)){
args__7491__auto__.push((arguments[i__7485__auto___11556]));

var G__11557 = (i__7485__auto___11556 + (1));
i__7485__auto___11556 = G__11557;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((2) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((2)),(0),null)):null);
return pairwise.core.draw_arrow.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7492__auto__);
});

pairwise.core.draw_arrow.cljs$core$IFn$_invoke$arity$variadic = (function (app_state,p__11540,p__11541){
var vec__11542 = p__11540;
var r = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11542,(0),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11542,(1),null);
var map__11545 = p__11541;
var map__11545__$1 = ((((!((map__11545 == null)))?((((map__11545.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11545.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11545):map__11545);
var stroke = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11545__$1,cljs.core.cst$kw$stroke,"gray");
var stroke_width = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11545__$1,cljs.core.cst$kw$stroke_DASH_width,(2));
var x1 = ((25) + (c * (50)));
var y1 = ((25) + (r * (50)));
var from_seq = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix,r,c,cljs.core.cst$kw$from], null));
var xpos = ((function (x1,y1,from_seq,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width){
return (function (p__11547){
var vec__11548 = p__11547;
var r__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11548,(0),null);
var c__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11548,(1),null);
return ((25) + ((50) * c__$1));
});})(x1,y1,from_seq,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width))
;
var ypos = ((function (x1,y1,from_seq,xpos,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width){
return (function (p__11551){
var vec__11552 = p__11551;
var r__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11552,(0),null);
var c__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11552,(1),null);
return ((25) + ((50) * r__$1));
});})(x1,y1,from_seq,xpos,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width))
;
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (x1,y1,from_seq,xpos,ypos,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width){
return (function (p1__11536_SHARP_){
if(!((p1__11536_SHARP_ == null))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$line,new cljs.core.PersistentArrayMap(null, 6, [cljs.core.cst$kw$stroke,stroke,cljs.core.cst$kw$stroke_DASH_width,stroke_width,cljs.core.cst$kw$x1,x1,cljs.core.cst$kw$x2,xpos(p1__11536_SHARP_),cljs.core.cst$kw$y1,y1,cljs.core.cst$kw$y2,ypos(p1__11536_SHARP_)], null)], null);
} else {
return null;
}
});})(x1,y1,from_seq,xpos,ypos,vec__11542,r,c,map__11545,map__11545__$1,stroke,stroke_width))
,from_seq);
});

pairwise.core.draw_arrow.cljs$lang$maxFixedArity = (2);

pairwise.core.draw_arrow.cljs$lang$applyTo = (function (seq11537){
var G__11538 = cljs.core.first(seq11537);
var seq11537__$1 = cljs.core.next(seq11537);
var G__11539 = cljs.core.first(seq11537__$1);
var seq11537__$2 = cljs.core.next(seq11537__$1);
return pairwise.core.draw_arrow.cljs$core$IFn$_invoke$arity$variadic(G__11538,G__11539,seq11537__$2);
});

pairwise.core.draw_mask = (function pairwise$core$draw_mask(app_state,p__11558){
var vec__11562 = p__11558;
var r = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11562,(0),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11562,(1),null);
var x1 = ((25) + (c * (50)));
var y1 = ((25) + (r * (50)));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$circle,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$cx,x1,cljs.core.cst$kw$cy,y1,cljs.core.cst$kw$r,(12),cljs.core.cst$kw$fill,"white"], null)], null);
});
pairwise.core.draw_cell = (function pairwise$core$draw_cell(app_state,p__11565){
var vec__11569 = p__11565;
var r = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11569,(0),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11569,(1),null);
var x = (c * (50));
var y = (r * (50));
var score = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix,r,c,cljs.core.cst$kw$score], null));
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$g,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$rect,new cljs.core.PersistentArrayMap(null, 7, [cljs.core.cst$kw$x,x,cljs.core.cst$kw$y,y,cljs.core.cst$kw$width,(50),cljs.core.cst$kw$height,(50),cljs.core.cst$kw$fill,"none",cljs.core.cst$kw$stroke,"gray",cljs.core.cst$kw$stroke_DASH_width,0.2], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$text,new cljs.core.PersistentArrayMap(null, 7, [cljs.core.cst$kw$x,(x + (25)),cljs.core.cst$kw$y,(y + (25)),cljs.core.cst$kw$text_DASH_anchor,"middle",cljs.core.cst$kw$alignment_DASH_baseline,"middle",cljs.core.cst$kw$font_DASH_family,"Verdana",cljs.core.cst$kw$font_DASH_size,"70%",cljs.core.cst$kw$stroke,"black"], null),score], null)], null);
});
pairwise.core.draw_top_seq = (function pairwise$core$draw_top_seq(app_state){
var draw_a_letter = (function (i,x){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$text,new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$x,((25) + ((i + (1)) * (50))),cljs.core.cst$kw$y,(-25),cljs.core.cst$kw$font_DASH_size,"150%",cljs.core.cst$kw$text_DASH_anchor,"middle",cljs.core.cst$kw$alignment_DASH_baseline,"middle"], null),x], null);
});
return cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(draw_a_letter,cljs.core.seq(cljs.core.cst$kw$top_DASH_seq.cljs$core$IFn$_invoke$arity$1(app_state)));
});
pairwise.core.draw_left_seq = (function pairwise$core$draw_left_seq(app_state){
var draw_a_letter = (function (i,x){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$text,new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$y,((25) + ((i + (1)) * (50))),cljs.core.cst$kw$x,(-25),cljs.core.cst$kw$font_DASH_size,"150%",cljs.core.cst$kw$text_DASH_anchor,"middle",cljs.core.cst$kw$alignment_DASH_baseline,"middle"], null),x], null);
});
return cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(draw_a_letter,cljs.core.seq(cljs.core.cst$kw$bottom_DASH_seq.cljs$core$IFn$_invoke$arity$1(app_state)));
});
pairwise.core.svg_component = (function pairwise$core$svg_component(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11586 = arguments.length;
var i__7485__auto___11587 = (0);
while(true){
if((i__7485__auto___11587 < len__7484__auto___11586)){
args__7491__auto__.push((arguments[i__7485__auto___11587]));

var G__11588 = (i__7485__auto___11587 + (1));
i__7485__auto___11587 = G__11588;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((1) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((1)),(0),null)):null);
return pairwise.core.svg_component.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7492__auto__);
});

pairwise.core.svg_component.cljs$core$IFn$_invoke$arity$variadic = (function (app_state,args){
var ij = (function (){var iter__7189__auto__ = (function pairwise$core$iter__11575(s__11576){
return (new cljs.core.LazySeq(null,(function (){
var s__11576__$1 = s__11576;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__11576__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var cols = cljs.core.first(xs__5205__auto__);
var iterys__7185__auto__ = ((function (s__11576__$1,cols,xs__5205__auto__,temp__4657__auto__){
return (function pairwise$core$iter__11575_$_iter__11577(s__11578){
return (new cljs.core.LazySeq(null,((function (s__11576__$1,cols,xs__5205__auto__,temp__4657__auto__){
return (function (){
var s__11578__$1 = s__11578;
while(true){
var temp__4657__auto____$1 = cljs.core.seq(s__11578__$1);
if(temp__4657__auto____$1){
var s__11578__$2 = temp__4657__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__11578__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__11578__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__11580 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__11579 = (0);
while(true){
if((i__11579 < size__7188__auto__)){
var rows = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__11579);
cljs.core.chunk_append(b__11580,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null));

var G__11589 = (i__11579 + (1));
i__11579 = G__11589;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__11580),pairwise$core$iter__11575_$_iter__11577(cljs.core.chunk_rest(s__11578__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__11580),null);
}
} else {
var rows = cljs.core.first(s__11578__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null),pairwise$core$iter__11575_$_iter__11577(cljs.core.rest(s__11578__$2)));
}
} else {
return null;
}
break;
}
});})(s__11576__$1,cols,xs__5205__auto__,temp__4657__auto__))
,null,null));
});})(s__11576__$1,cols,xs__5205__auto__,temp__4657__auto__))
;
var fs__7186__auto__ = cljs.core.seq(iterys__7185__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix], null))))));
if(fs__7186__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__7186__auto__,pairwise$core$iter__11575(cljs.core.rest(s__11576__$1)));
} else {
var G__11590 = cljs.core.rest(s__11576__$1);
s__11576__$1 = G__11590;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__7189__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix,(0)], null)))));
})();
var cols = cljs.core.count(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix,(0)], null)));
var rows = cljs.core.count(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(app_state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result,cljs.core.cst$kw$dp_DASH_matrix], null)));
var draw_opt = ((function (ij,cols,rows){
return (function (paths){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (ij,cols,rows){
return (function (p1__11572_SHARP_){
return pairwise.core.draw_arrow.cljs$core$IFn$_invoke$arity$variadic(app_state,p1__11572_SHARP_,cljs.core.array_seq([cljs.core.cst$kw$stroke,"red",cljs.core.cst$kw$stroke_DASH_width,(4)], 0));
});})(ij,cols,rows))
,paths);
});})(ij,cols,rows))
;
return new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$svg,new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$width,"80%",cljs.core.cst$kw$height,"50%",cljs.core.cst$kw$viewBox,cljs.core.print_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([(-50),(-50),[cljs.core.str(((cols + (1)) * (50)))].join(''),[cljs.core.str(((rows + (1)) * (50)))].join('')], 0)),cljs.core.cst$kw$id,"canvas",cljs.core.cst$kw$style,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$background_DASH_color,"#fff"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$rect,new cljs.core.PersistentArrayMap(null, 7, [cljs.core.cst$kw$x,(0),cljs.core.cst$kw$y,(0),cljs.core.cst$kw$width,((50) * cols),cljs.core.cst$kw$height,((50) * rows),cljs.core.cst$kw$fill,"none",cljs.core.cst$kw$stroke,"black",cljs.core.cst$kw$stroke_DASH_width,(1)], null)], null),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(pairwise.core.draw_arrow,app_state),ij),cljs.core.map.cljs$core$IFn$_invoke$arity$2(draw_opt,cljs.core.cst$kw$optimal_DASH_paths.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$result.cljs$core$IFn$_invoke$arity$1(app_state))),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(pairwise.core.draw_mask,app_state),ij),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(pairwise.core.draw_cell,app_state),ij),pairwise.core.draw_top_seq(app_state),pairwise.core.draw_left_seq(app_state)], null);
});

pairwise.core.svg_component.cljs$lang$maxFixedArity = (1);

pairwise.core.svg_component.cljs$lang$applyTo = (function (seq11573){
var G__11574 = cljs.core.first(seq11573);
var seq11573__$1 = cljs.core.next(seq11573);
return pairwise.core.svg_component.cljs$core$IFn$_invoke$arity$variadic(G__11574,seq11573__$1);
});

pairwise.core.row = (function pairwise$core$row(label,input){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$col_DASH_md_DASH_4,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,label], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$col_DASH_md_DASH_8,input], null)], null);
});
pairwise.core.radio = (function pairwise$core$radio(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11598 = arguments.length;
var i__7485__auto___11599 = (0);
while(true){
if((i__7485__auto___11599 < len__7484__auto___11598)){
args__7491__auto__.push((arguments[i__7485__auto___11599]));

var G__11600 = (i__7485__auto___11599 + (1));
i__7485__auto___11599 = G__11600;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((3) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((3)),(0),null)):null);
return pairwise.core.radio.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__7492__auto__);
});

pairwise.core.radio.cljs$core$IFn$_invoke$arity$variadic = (function (label,name,value,p__11595){
var map__11596 = p__11595;
var map__11596__$1 = ((((!((map__11596 == null)))?((((map__11596.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11596.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11596):map__11596);
var checked = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11596__$1,cljs.core.cst$kw$checked,false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$field,cljs.core.cst$kw$radio,cljs.core.cst$kw$name,name,cljs.core.cst$kw$value,value,cljs.core.cst$kw$checked,checked], null)], null),label], null)], null);
});

pairwise.core.radio.cljs$lang$maxFixedArity = (3);

pairwise.core.radio.cljs$lang$applyTo = (function (seq11591){
var G__11592 = cljs.core.first(seq11591);
var seq11591__$1 = cljs.core.next(seq11591);
var G__11593 = cljs.core.first(seq11591__$1);
var seq11591__$2 = cljs.core.next(seq11591__$1);
var G__11594 = cljs.core.first(seq11591__$2);
var seq11591__$3 = cljs.core.next(seq11591__$2);
return pairwise.core.radio.cljs$core$IFn$_invoke$arity$variadic(G__11592,G__11593,G__11594,seq11591__$3);
});

pairwise.core.input = (function pairwise$core$input(label,type,id){
return pairwise.core.row(label,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$field,type,cljs.core.cst$kw$id,id], null)], null));
});
pairwise.core.form_template = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"panel panel-primary"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_heading,"Input sequences (up to 10 letters)"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_body,pairwise.core.row("TOP sequence",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$field,cljs.core.cst$kw$text,cljs.core.cst$kw$id,cljs.core.cst$kw$top_DASH_seq,cljs.core.cst$kw$max_DASH_length,(10)], null)], null)),pairwise.core.row("BOTTOM sequence",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$field,cljs.core.cst$kw$text,cljs.core.cst$kw$id,cljs.core.cst$kw$bottom_DASH_seq,cljs.core.cst$kw$max_DASH_length,(10)], null)], null))], null)], null),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"panel panel-primary"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_heading,"Alignment type"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_body,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$btn_DASH_group,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$field,cljs.core.cst$kw$single_DASH_select,cljs.core.cst$kw$id,cljs.core.cst$kw$alignment_DASH_type], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$button$btn$btn_DASH_default,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$key,cljs.core.cst$kw$global], null),"Needleman-Wunsch"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$button$btn$btn_DASH_default,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$key,cljs.core.cst$kw$local], null),"Smith-Waterman"], null)], null)], null)], null),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"panel panel-primary"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_heading,"Algorithm Parameters"], null),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_body,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$col_DASH_md_DASH_4,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$vertical_DASH_align,"middle"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,"Scoring Matrix"], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$col_DASH_md_DASH_8,pairwise.core.radio("User-defined",cljs.core.cst$kw$scoring_DASH_matrix_DASH_type,cljs.core.cst$kw$simple),pairwise.core.radio.cljs$core$IFn$_invoke$arity$variadic("Standard",cljs.core.cst$kw$scoring_DASH_matrix_DASH_type,cljs.core.cst$kw$standard,cljs.core.array_seq([cljs.core.cst$kw$checked,true], 0))], null)], null),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$form_DASH_group,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$field,cljs.core.cst$kw$container,cljs.core.cst$kw$visible_QMARK_,(function (p1__11601_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$simple,cljs.core.cst$kw$scoring_DASH_matrix_DASH_type.cljs$core$IFn$_invoke$arity$1(p1__11601_SHARP_));
})], null),pairwise.core.row(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$field,cljs.core.cst$kw$label,cljs.core.cst$kw$preamble,"match: ",cljs.core.cst$kw$id,cljs.core.cst$kw$match_DASH_score], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$field,cljs.core.cst$kw$range,cljs.core.cst$kw$min,(0),cljs.core.cst$kw$max,(15),cljs.core.cst$kw$id,cljs.core.cst$kw$match_DASH_score], null)], null)),pairwise.core.row(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$field,cljs.core.cst$kw$label,cljs.core.cst$kw$preamble,"mismatch: ",cljs.core.cst$kw$id,cljs.core.cst$kw$mismatch_DASH_score], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$field,cljs.core.cst$kw$range,cljs.core.cst$kw$min,(-10),cljs.core.cst$kw$max,(0),cljs.core.cst$kw$id,cljs.core.cst$kw$mismatch_DASH_score], null)], null))], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$select$form_DASH_control,new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$field,cljs.core.cst$kw$list,cljs.core.cst$kw$id,cljs.core.cst$kw$scoring_DASH_matrix,cljs.core.cst$kw$visible_QMARK_,(function (p1__11602_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$standard,cljs.core.cst$kw$scoring_DASH_matrix_DASH_type.cljs$core$IFn$_invoke$arity$1(p1__11602_SHARP_));
})], null),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__11603){
var vec__11604 = p__11603;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11604,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11604,(1),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$option,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$key,k], null),cljs.core.cst$kw$name.cljs$core$IFn$_invoke$arity$1(v)], null);
}),pairwise.core.scoring_matrices)], null),pairwise.core.row(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$label,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$field,cljs.core.cst$kw$label,cljs.core.cst$kw$preamble,"Linear gap penalty: ",cljs.core.cst$kw$placeholder,"N/A",cljs.core.cst$kw$id,cljs.core.cst$kw$gap_DASH_penalty], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$field,cljs.core.cst$kw$range,cljs.core.cst$kw$min,(0),cljs.core.cst$kw$max,(15),cljs.core.cst$kw$id,cljs.core.cst$kw$gap_DASH_penalty], null)], null))], null)], null)], null);
pairwise.core.display_alignment = (function pairwise$core$display_alignment(p__11607){
var map__11610 = p__11607;
var map__11610__$1 = ((((!((map__11610 == null)))?((((map__11610.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11610.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11610):map__11610);
var top = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11610__$1,cljs.core.cst$kw$top);
var bottom = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11610__$1,cljs.core.cst$kw$bottom);
return cljs.core.with_meta(new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$p,top,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$br], null),bottom,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$br], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$br], null)], null),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$key,cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(pairwise.core.app_item_id,cljs.core.inc)], null));
});
pairwise.core.summarize_alignment = (function pairwise$core$summarize_alignment(p__11612){
var map__11615 = p__11612;
var map__11615__$1 = ((((!((map__11615 == null)))?((((map__11615.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11615.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11615):map__11615);
var sequence_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11615__$1,cljs.core.cst$kw$sequence_DASH_type);
var alignment_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11615__$1,cljs.core.cst$kw$alignment_DASH_type);
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11615__$1,cljs.core.cst$kw$result);
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$span,clojure.string.capitalize(cljs.core.name(alignment_type))," ",cljs.core.name(sequence_type)," alignment score: ",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$strong,cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(result)], null)], null);
});
pairwise.core.page = (function pairwise$core$page(){
var app_state = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$gap_DASH_penalty,cljs.core.cst$kw$mismatch_DASH_score,cljs.core.cst$kw$match_DASH_score,cljs.core.cst$kw$scoring_DASH_matrix,cljs.core.cst$kw$top_DASH_seq,cljs.core.cst$kw$scoring_DASH_matrix_DASH_type,cljs.core.cst$kw$sequence_DASH_type,cljs.core.cst$kw$bottom_DASH_seq,cljs.core.cst$kw$alignment_DASH_type],[(8),(-3),(5),cljs.core.cst$kw$blosum50,"HEAGAWGHEE",cljs.core.cst$kw$standard,cljs.core.cst$kw$protein,"PAWHEAE",cljs.core.cst$kw$global]));
return ((function (app_state){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$page_DASH_header,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$h1$text_DASH_center,"Optimal pairwise sequence alignment"], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"col-md-4"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.bind_fields,pairwise.core.form_template,app_state,((function (app_state){
return (function (p__11624,value,p__11625){
var vec__11626 = p__11624;
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11626,(0),null);
var map__11629 = p__11625;
var map__11629__$1 = ((((!((map__11629 == null)))?((((map__11629.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11629.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11629):map__11629);
var doc = map__11629__$1;
var top_seq = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11629__$1,cljs.core.cst$kw$top_DASH_seq);
var bottom_seq = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11629__$1,cljs.core.cst$kw$bottom_DASH_seq);
var scoring_matrix = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11629__$1,cljs.core.cst$kw$scoring_DASH_matrix);
var gap_penalty = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11629__$1,cljs.core.cst$kw$gap_DASH_penalty);
var alignment_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11629__$1,cljs.core.cst$kw$alignment_DASH_type);
return cljs.core.assoc_in(doc,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$result], null),pairwise.core.app_results(doc));
});})(app_state))
], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,(cljs.core.truth_(cljs.core.cst$kw$result.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(app_state) : cljs.core.deref.call(null,app_state))))?new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"panel panel-info"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_heading,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"text-center"], null),pairwise.core.summarize_alignment((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(app_state) : cljs.core.deref.call(null,app_state)))], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$pre,cljs.core.map.cljs$core$IFn$_invoke$arity$2(pairwise.core.display_alignment,cljs.core.cst$kw$alignments.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$result.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(app_state) : cljs.core.deref.call(null,app_state)))))], null)], null)], null)], null):null)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$class,"col-md-8"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,(cljs.core.truth_(cljs.core.cst$kw$result.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(app_state) : cljs.core.deref.call(null,app_state))))?new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$class,"text-center",cljs.core.cst$kw$margin_DASH_left,"5%"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_heading,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$h3,"Dynamic programming matrix visualisation"], null),"Paths for optimal alignments are indicated in red"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$panel_DASH_body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$row,pairwise.core.svg_component((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(app_state) : cljs.core.deref.call(null,app_state)))], null)], null)], null):null)], null)], null)], null)], null);
});
;})(app_state))
});
var G__11631_11633 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [pairwise.core.page], null);
var G__11632_11634 = document.getElementById("app");
(reagent.core.render_component.cljs$core$IFn$_invoke$arity$2 ? reagent.core.render_component.cljs$core$IFn$_invoke$arity$2(G__11631_11633,G__11632_11634) : reagent.core.render_component.call(null,G__11631_11633,G__11632_11634));
pairwise.core.on_js_reload = (function pairwise$core$on_js_reload(){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$__figwheel_counter], null),cljs.core.inc);
});
