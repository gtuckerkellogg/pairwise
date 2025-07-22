// Compiled by ClojureScript 1.9.229 {:static-fns true, :optimize-constants true}
goog.provide('pairwise.linear');
goog.require('cljs.core');
/**
 * Initial a dynamic programming matrix, given two sequences s1 and s2
 */
pairwise.linear.initialise_D = (function pairwise$linear$initialise_D(s1,s2){
var n = (cljs.core.count(s1) + (1));
var m = (cljs.core.count(s2) + (1));
var D = cljs.core.vec(cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(m,cljs.core.vec(cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(n,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null)))));
return cljs.core.assoc_in(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(0),cljs.core.cst$kw$score], null),(0));
});
/**
 * predicate for score
 */
pairwise.linear.has_score_QMARK_ = (function pairwise$linear$has_score_QMARK_(s){
return (cljs.core.map_QMARK_(s)) && (typeof cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(s) === 'number');
});
/**
 * return the score for a match condition
 */
pairwise.linear.score_match = (function pairwise$linear$score_match(D,i,j,s){
var vec__11398 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(i - (1)),(j - (1))], null);
var i_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11398,(0),null);
var j_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__11398,(1),null);
if(((i === (0))) && ((j === (0)))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,(0),cljs.core.cst$kw$from,null], null);
} else {
if(((i === (0))) || ((j === (0)))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$score,(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [i_SINGLEQUOTE_,j_SINGLEQUOTE_,cljs.core.cst$kw$score], null)) + s),cljs.core.cst$kw$from,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i_SINGLEQUOTE_,j_SINGLEQUOTE_], null),cljs.core.cst$kw$step,cljs.core.cst$kw$diag], null);

}
}
});
/**
 * return the score for a vertical gap condition with gap penalty d
 */
pairwise.linear.score_vertical_gap = (function pairwise$linear$score_vertical_gap(D,row,col,d){
if((row === (0))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null);
} else {
if((cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(row - (1)),col,cljs.core.cst$kw$score], null)) == null)){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$score,(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(row - (1)),col,cljs.core.cst$kw$score], null)) - d),cljs.core.cst$kw$from,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(row - (1)),col], null),cljs.core.cst$kw$step,cljs.core.cst$kw$vert], null);

}
}
});
/**
 * return the score for a horizontal gap condition with gap penalty d
 */
pairwise.linear.score_horizontal_gap = (function pairwise$linear$score_horizontal_gap(D,row,col,d){
if((col === (0))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null);
} else {
if((cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [row,(col - (1)),cljs.core.cst$kw$score], null)) == null)){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,null,cljs.core.cst$kw$from,null], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$score,(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [row,(col - (1)),cljs.core.cst$kw$score], null)) - d),cljs.core.cst$kw$from,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [row,(col - (1))], null),cljs.core.cst$kw$step,cljs.core.cst$kw$horiz], null);

}
}
});
/**
 * score a cell
 */
pairwise.linear.score_cell = (function pairwise$linear$score_cell(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11414 = arguments.length;
var i__7485__auto___11415 = (0);
while(true){
if((i__7485__auto___11415 < len__7484__auto___11414)){
args__7491__auto__.push((arguments[i__7485__auto___11415]));

var G__11416 = (i__7485__auto___11415 + (1));
i__7485__auto___11415 = G__11416;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((7) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((7)),(0),null)):null);
return pairwise.linear.score_cell.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),argseq__7492__auto__);
});

pairwise.linear.score_cell.cljs$core$IFn$_invoke$arity$variadic = (function (D,S,gap_penalty,s1,s2,row,col,p__11411){
var map__11412 = p__11411;
var map__11412__$1 = ((((!((map__11412 == null)))?((((map__11412.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11412.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11412):map__11412);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11412__$1,cljs.core.cst$kw$type);
var L1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(cljs.core.seq(s1)),(col - (1)));
var L2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(cljs.core.seq(s2)),(row - (1)));
var s = cljs.core.get.cljs$core$IFn$_invoke$arity$2(S,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [L1,L2], null));
var score_vec = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [pairwise.linear.score_match(D,row,col,s),pairwise.linear.score_horizontal_gap(D,row,col,gap_penalty),pairwise.linear.score_vertical_gap(D,row,col,gap_penalty),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$local))?new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,(0),cljs.core.cst$kw$from,null], null):null)], null));
var score_vec__$1 = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(pairwise.linear.has_score_QMARK_,score_vec);
var max_score = cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.max_key,cljs.core.cst$kw$score,score_vec__$1));
var score_vec__$2 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$local))?cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (L1,L2,s,score_vec,score_vec__$1,max_score,map__11412,map__11412__$1,type){
return (function (p1__11401_SHARP_){
if((cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(p1__11401_SHARP_) === (0))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$score,(0),cljs.core.cst$kw$from,null], null);
} else {
return p1__11401_SHARP_;
}
});})(L1,L2,s,score_vec,score_vec__$1,max_score,map__11412,map__11412__$1,type))
,score_vec__$1):score_vec__$1);
var score_vec__$3 = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (L1,L2,s,score_vec,score_vec__$1,max_score,score_vec__$2,map__11412,map__11412__$1,type){
return (function (p1__11402_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(p1__11402_SHARP_),max_score);
});})(L1,L2,s,score_vec,score_vec__$1,max_score,score_vec__$2,map__11412,map__11412__$1,type))
,score_vec__$2));
return cljs.core.assoc_in(D,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [row,col], null),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$score,max_score,cljs.core.cst$kw$from,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$from,score_vec__$3),cljs.core.cst$kw$step,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$step,score_vec__$3)], null));
});

pairwise.linear.score_cell.cljs$lang$maxFixedArity = (7);

pairwise.linear.score_cell.cljs$lang$applyTo = (function (seq11403){
var G__11404 = cljs.core.first(seq11403);
var seq11403__$1 = cljs.core.next(seq11403);
var G__11405 = cljs.core.first(seq11403__$1);
var seq11403__$2 = cljs.core.next(seq11403__$1);
var G__11406 = cljs.core.first(seq11403__$2);
var seq11403__$3 = cljs.core.next(seq11403__$2);
var G__11407 = cljs.core.first(seq11403__$3);
var seq11403__$4 = cljs.core.next(seq11403__$3);
var G__11408 = cljs.core.first(seq11403__$4);
var seq11403__$5 = cljs.core.next(seq11403__$4);
var G__11409 = cljs.core.first(seq11403__$5);
var seq11403__$6 = cljs.core.next(seq11403__$5);
var G__11410 = cljs.core.first(seq11403__$6);
var seq11403__$7 = cljs.core.next(seq11403__$6);
return pairwise.linear.score_cell.cljs$core$IFn$_invoke$arity$variadic(G__11404,G__11405,G__11406,G__11407,G__11408,G__11409,G__11410,seq11403__$7);
});

/**
 * build the dynamic programming matrix for Needleman Wunsch or Smith-Waterman
 */
pairwise.linear.build_dp_matrix = (function pairwise$linear$build_dp_matrix(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11438 = arguments.length;
var i__7485__auto___11439 = (0);
while(true){
if((i__7485__auto___11439 < len__7484__auto___11438)){
args__7491__auto__.push((arguments[i__7485__auto___11439]));

var G__11440 = (i__7485__auto___11439 + (1));
i__7485__auto___11439 = G__11440;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((4) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((4)),(0),null)):null);
return pairwise.linear.build_dp_matrix.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),argseq__7492__auto__);
});

pairwise.linear.build_dp_matrix.cljs$core$IFn$_invoke$arity$variadic = (function (scoring_matrix,gap_penalty,s1,s2,p__11424){
var map__11425 = p__11424;
var map__11425__$1 = ((((!((map__11425 == null)))?((((map__11425.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11425.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11425):map__11425);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__11425__$1,cljs.core.cst$kw$type);
var D = pairwise.linear.initialise_D(s1,s2);
var ij = (function (){var iter__7189__auto__ = ((function (D,map__11425,map__11425__$1,type){
return (function pairwise$linear$iter__11427(s__11428){
return (new cljs.core.LazySeq(null,((function (D,map__11425,map__11425__$1,type){
return (function (){
var s__11428__$1 = s__11428;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__11428__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var cols = cljs.core.first(xs__5205__auto__);
var iterys__7185__auto__ = ((function (s__11428__$1,cols,xs__5205__auto__,temp__4657__auto__,D,map__11425,map__11425__$1,type){
return (function pairwise$linear$iter__11427_$_iter__11429(s__11430){
return (new cljs.core.LazySeq(null,((function (s__11428__$1,cols,xs__5205__auto__,temp__4657__auto__,D,map__11425,map__11425__$1,type){
return (function (){
var s__11430__$1 = s__11430;
while(true){
var temp__4657__auto____$1 = cljs.core.seq(s__11430__$1);
if(temp__4657__auto____$1){
var s__11430__$2 = temp__4657__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__11430__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__11430__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__11432 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__11431 = (0);
while(true){
if((i__11431 < size__7188__auto__)){
var rows = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__11431);
cljs.core.chunk_append(b__11432,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null));

var G__11441 = (i__11431 + (1));
i__11431 = G__11441;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__11432),pairwise$linear$iter__11427_$_iter__11429(cljs.core.chunk_rest(s__11430__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__11432),null);
}
} else {
var rows = cljs.core.first(s__11430__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null),pairwise$linear$iter__11427_$_iter__11429(cljs.core.rest(s__11430__$2)));
}
} else {
return null;
}
break;
}
});})(s__11428__$1,cols,xs__5205__auto__,temp__4657__auto__,D,map__11425,map__11425__$1,type))
,null,null));
});})(s__11428__$1,cols,xs__5205__auto__,temp__4657__auto__,D,map__11425,map__11425__$1,type))
;
var fs__7186__auto__ = cljs.core.seq(iterys__7185__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((cljs.core.count(s2) + (1)))));
if(fs__7186__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__7186__auto__,pairwise$linear$iter__11427(cljs.core.rest(s__11428__$1)));
} else {
var G__11442 = cljs.core.rest(s__11428__$1);
s__11428__$1 = G__11442;
continue;
}
} else {
return null;
}
break;
}
});})(D,map__11425,map__11425__$1,type))
,null,null));
});})(D,map__11425,map__11425__$1,type))
;
return iter__7189__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((cljs.core.count(s1) + (1))));
})();
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (D,ij,map__11425,map__11425__$1,type){
return (function (p1__11417_SHARP_,p2__11418_SHARP_){
return pairwise.linear.score_cell.cljs$core$IFn$_invoke$arity$variadic(p1__11417_SHARP_,scoring_matrix,gap_penalty,s1,s2,cljs.core.first(p2__11418_SHARP_),cljs.core.second(p2__11418_SHARP_),cljs.core.array_seq([cljs.core.cst$kw$type,type], 0));
});})(D,ij,map__11425,map__11425__$1,type))
,D,ij);
});

pairwise.linear.build_dp_matrix.cljs$lang$maxFixedArity = (4);

pairwise.linear.build_dp_matrix.cljs$lang$applyTo = (function (seq11419){
var G__11420 = cljs.core.first(seq11419);
var seq11419__$1 = cljs.core.next(seq11419);
var G__11421 = cljs.core.first(seq11419__$1);
var seq11419__$2 = cljs.core.next(seq11419__$1);
var G__11422 = cljs.core.first(seq11419__$2);
var seq11419__$3 = cljs.core.next(seq11419__$2);
var G__11423 = cljs.core.first(seq11419__$3);
var seq11419__$4 = cljs.core.next(seq11419__$3);
return pairwise.linear.build_dp_matrix.cljs$core$IFn$_invoke$arity$variadic(G__11420,G__11421,G__11422,G__11423,seq11419__$4);
});

/**
 * transform a DP matrix into a graph with cells as keys
 */
pairwise.linear.graph_of = (function pairwise$linear$graph_of(D){
var ij = (function (){var iter__7189__auto__ = (function pairwise$linear$graph_of_$_iter__11454(s__11455){
return (new cljs.core.LazySeq(null,(function (){
var s__11455__$1 = s__11455;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__11455__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var rows = cljs.core.first(xs__5205__auto__);
var iterys__7185__auto__ = ((function (s__11455__$1,rows,xs__5205__auto__,temp__4657__auto__){
return (function pairwise$linear$graph_of_$_iter__11454_$_iter__11456(s__11457){
return (new cljs.core.LazySeq(null,((function (s__11455__$1,rows,xs__5205__auto__,temp__4657__auto__){
return (function (){
var s__11457__$1 = s__11457;
while(true){
var temp__4657__auto____$1 = cljs.core.seq(s__11457__$1);
if(temp__4657__auto____$1){
var s__11457__$2 = temp__4657__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__11457__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__11457__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__11459 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__11458 = (0);
while(true){
if((i__11458 < size__7188__auto__)){
var cols = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__11458);
cljs.core.chunk_append(b__11459,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null));

var G__11465 = (i__11458 + (1));
i__11458 = G__11465;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__11459),pairwise$linear$graph_of_$_iter__11454_$_iter__11456(cljs.core.chunk_rest(s__11457__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__11459),null);
}
} else {
var cols = cljs.core.first(s__11457__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rows,cols], null),pairwise$linear$graph_of_$_iter__11454_$_iter__11456(cljs.core.rest(s__11457__$2)));
}
} else {
return null;
}
break;
}
});})(s__11455__$1,rows,xs__5205__auto__,temp__4657__auto__))
,null,null));
});})(s__11455__$1,rows,xs__5205__auto__,temp__4657__auto__))
;
var fs__7186__auto__ = cljs.core.seq(iterys__7185__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(cljs.core.first(D)))));
if(fs__7186__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__7186__auto__,pairwise$linear$graph_of_$_iter__11454(cljs.core.rest(s__11455__$1)));
} else {
var G__11466 = cljs.core.rest(s__11455__$1);
s__11455__$1 = G__11466;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__7189__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(D)));
})();
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (ij){
return (function (idx){
return cljs.core.PersistentArrayMap.fromArray([idx,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,idx)], true, false);
});})(ij))
,cljs.core.reverse(ij)));
});
/**
 * return a function that returns true if reached the goal cell
 */
pairwise.linear.get_goalfn = (function pairwise$linear$get_goalfn(D,type){
var goal = cljs.core.set(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$global))?cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(0)], null)):((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$local))?cljs.core.keys(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__11467_SHARP_){
return (cljs.core.cst$kw$score.cljs$core$IFn$_invoke$arity$1(cljs.core.second(p1__11467_SHARP_)) === (0));
}),pairwise.linear.graph_of(D))):((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$semiglobal))?cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__11468_SHARP_){
return ((cljs.core.first(p1__11468_SHARP_) === (0))) || ((cljs.core.second(p1__11468_SHARP_) === (0)));
}),cljs.core.keys(pairwise.linear.graph_of(D))):null))));
return ((function (goal){
return (function (p1__11469_SHARP_){
return cljs.core.contains_QMARK_(goal,p1__11469_SHARP_);
});
;})(goal))
});
/**
 * doc-string
 */
pairwise.linear.alignment_score = (function pairwise$linear$alignment_score(D,type){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$global)){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.count(D) - (1)),(cljs.core.count(cljs.core.first(D)) - (1)),cljs.core.cst$kw$score], null));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$local)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__11470_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$score,p1__11470_SHARP_);
}),D)));
} else {
return null;
}
}
});
pairwise.linear.get_starting = (function pairwise$linear$get_starting(D,type){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$global)){
var x__7243__auto__ = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.count(D) - (1)),(cljs.core.count(cljs.core.first(D)) - (1))], null);
return cljs.core._conj(cljs.core.List.EMPTY,x__7243__auto__);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$local)){
var top_score = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__11471_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$score,p1__11471_SHARP_);
}),D)));
var starting = (function (){var iter__7189__auto__ = ((function (top_score){
return (function pairwise$linear$get_starting_$_iter__11483(s__11484){
return (new cljs.core.LazySeq(null,((function (top_score){
return (function (){
var s__11484__$1 = s__11484;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__11484__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var r = cljs.core.first(xs__5205__auto__);
var iterys__7185__auto__ = ((function (s__11484__$1,r,xs__5205__auto__,temp__4657__auto__,top_score){
return (function pairwise$linear$get_starting_$_iter__11483_$_iter__11485(s__11486){
return (new cljs.core.LazySeq(null,((function (s__11484__$1,r,xs__5205__auto__,temp__4657__auto__,top_score){
return (function (){
var s__11486__$1 = s__11486;
while(true){
var temp__4657__auto____$1 = cljs.core.seq(s__11486__$1);
if(temp__4657__auto____$1){
var s__11486__$2 = temp__4657__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__11486__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__11486__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__11488 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__11487 = (0);
while(true){
if((i__11487 < size__7188__auto__)){
var c = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__11487);
cljs.core.chunk_append(b__11488,((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(top_score,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [r,c,cljs.core.cst$kw$score], null))))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [r,c], null):null));

var G__11494 = (i__11487 + (1));
i__11487 = G__11494;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__11488),pairwise$linear$get_starting_$_iter__11483_$_iter__11485(cljs.core.chunk_rest(s__11486__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__11488),null);
}
} else {
var c = cljs.core.first(s__11486__$2);
return cljs.core.cons(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(top_score,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(D,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [r,c,cljs.core.cst$kw$score], null))))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [r,c], null):null),pairwise$linear$get_starting_$_iter__11483_$_iter__11485(cljs.core.rest(s__11486__$2)));
}
} else {
return null;
}
break;
}
});})(s__11484__$1,r,xs__5205__auto__,temp__4657__auto__,top_score))
,null,null));
});})(s__11484__$1,r,xs__5205__auto__,temp__4657__auto__,top_score))
;
var fs__7186__auto__ = cljs.core.seq(iterys__7185__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(cljs.core.first(D)))));
if(fs__7186__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__7186__auto__,pairwise$linear$get_starting_$_iter__11483(cljs.core.rest(s__11484__$1)));
} else {
var G__11495 = cljs.core.rest(s__11484__$1);
s__11484__$1 = G__11495;
continue;
}
} else {
return null;
}
break;
}
});})(top_score))
,null,null));
});})(top_score))
;
return iter__7189__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(cljs.core.count(D)));
})();
return cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,starting);
} else {
return null;
}
}
});
pairwise.linear.dfs = (function pairwise$linear$dfs(graph,met_goal_QMARK_){
return (function pairwise$linear$dfs_$_search(path,visited){
var current = cljs.core.peek(path);
if(cljs.core.truth_((met_goal_QMARK_.cljs$core$IFn$_invoke$arity$1 ? met_goal_QMARK_.cljs$core$IFn$_invoke$arity$1(current) : met_goal_QMARK_.call(null,current)))){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [path], null);
} else {
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(((function (current){
return (function (p1__11496_SHARP_){
return pairwise$linear$dfs_$_search(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,p1__11496_SHARP_),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(visited,p1__11496_SHARP_));
});})(current))
,cljs.core.array_seq([cljs.core.remove.cljs$core$IFn$_invoke$arity$2(visited,cljs.core.cst$kw$from.cljs$core$IFn$_invoke$arity$1((graph.cljs$core$IFn$_invoke$arity$1 ? graph.cljs$core$IFn$_invoke$arity$1(current) : graph.call(null,current))))], 0));
}
});
});
/**
 * Returns a lazy sequence of all directed paths from starts to goals
 *   within graph.
 */
pairwise.linear.findpaths = (function pairwise$linear$findpaths(D,type){
var met_goal_QMARK_ = pairwise.linear.get_goalfn(D,type);
var start_cells = pairwise.linear.get_starting(D,type);
var graph = pairwise.linear.graph_of(D);
var search = pairwise.linear.dfs(graph,met_goal_QMARK_);
var start_cell = cljs.core.first(start_cells);
var all_paths = cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(((function (met_goal_QMARK_,start_cells,graph,search,start_cell){
return (function (p1__11501_SHARP_){
var G__11505 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__11501_SHARP_], null);
var G__11506 = cljs.core.PersistentHashSet.fromArray([p1__11501_SHARP_], true);
return (search.cljs$core$IFn$_invoke$arity$2 ? search.cljs$core$IFn$_invoke$arity$2(G__11505,G__11506) : search.call(null,G__11505,G__11506));
});})(met_goal_QMARK_,start_cells,graph,search,start_cell))
,cljs.core.array_seq([start_cells], 0));
var internal_cells = cljs.core.set(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.concat,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.rest,all_paths)));
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (met_goal_QMARK_,start_cells,graph,search,start_cell,all_paths,internal_cells){
return (function (p1__11502_SHARP_){
return cljs.core.complement(cljs.core.contains_QMARK_).call(null,internal_cells,cljs.core.first(p1__11502_SHARP_));
});})(met_goal_QMARK_,start_cells,graph,search,start_cell,all_paths,internal_cells))
,all_paths);
});
/**
 * Take as input a path of nodes and two input sequences. Generate an alignment
 */
pairwise.linear.path_to_alignment = (function pairwise$linear$path_to_alignment(path,s1,s2){
var res1 = cljs.core.seq(s1);
var res2 = cljs.core.seq(s2);
var to_aln = ((function (res1,res2){
return (function (idx1,idx2){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.second(idx1),cljs.core.second(idx2)))?"-":cljs.core.get.cljs$core$IFn$_invoke$arity$2(s1,cljs.core.second(idx2))),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(idx1),cljs.core.first(idx2)))?"-":cljs.core.get.cljs$core$IFn$_invoke$arity$2(s2,cljs.core.first(idx2)))], null);
});})(res1,res2))
;
var aln_chars = cljs.core.flatten(cljs.core.reverse(cljs.core.map.cljs$core$IFn$_invoke$arity$3(to_aln,path,cljs.core.rest(path))));
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,cljs.core.interleave.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$top,cljs.core.cst$kw$bottom], null),cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (res1,res2,to_aln,aln_chars){
return (function (p1__11507_SHARP_){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,p1__11507_SHARP_);
});})(res1,res2,to_aln,aln_chars))
,cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.map,cljs.core.list,cljs.core.partition.cljs$core$IFn$_invoke$arity$2((2),aln_chars)))));
});
/**
 * doc-string
 */
pairwise.linear.pairwise_align = (function pairwise$linear$pairwise_align(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11517 = arguments.length;
var i__7485__auto___11518 = (0);
while(true){
if((i__7485__auto___11518 < len__7484__auto___11517)){
args__7491__auto__.push((arguments[i__7485__auto___11518]));

var G__11519 = (i__7485__auto___11518 + (1));
i__7485__auto___11518 = G__11519;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((4) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((4)),(0),null)):null);
return pairwise.linear.pairwise_align.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),argseq__7492__auto__);
});

pairwise.linear.pairwise_align.cljs$core$IFn$_invoke$arity$variadic = (function (s1,s2,S,gap_penalty,p__11514){
var map__11515 = p__11514;
var map__11515__$1 = ((((!((map__11515 == null)))?((((map__11515.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11515.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11515):map__11515);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11515__$1,cljs.core.cst$kw$type,cljs.core.cst$kw$global);
var D = pairwise.linear.initialise_D(s1,s2);
var D__$1 = pairwise.linear.build_dp_matrix.cljs$core$IFn$_invoke$arity$variadic(S,gap_penalty,s1,s2,cljs.core.array_seq([cljs.core.cst$kw$type,type], 0));
var paths = pairwise.linear.findpaths(D__$1,type);
return cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$gap_DASH_penalty,cljs.core.cst$kw$scoring_DASH_matrix,cljs.core.cst$kw$dp_DASH_matrix,cljs.core.cst$kw$sequence_DASH_2,cljs.core.cst$kw$rows,cljs.core.cst$kw$cols,cljs.core.cst$kw$score,cljs.core.cst$kw$alignments,cljs.core.cst$kw$sequence_DASH_1,cljs.core.cst$kw$optimal_DASH_paths],[gap_penalty,S,D__$1,s2,cljs.core.count(cljs.core.seq(s2)),cljs.core.count(cljs.core.seq(s1)),pairwise.linear.alignment_score(D__$1,type),cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (D,D__$1,paths,map__11515,map__11515__$1,type){
return (function (p1__11508_SHARP_){
return pairwise.linear.path_to_alignment(p1__11508_SHARP_,s1,s2);
});})(D,D__$1,paths,map__11515,map__11515__$1,type))
,paths),s1,paths]);
});

pairwise.linear.pairwise_align.cljs$lang$maxFixedArity = (4);

pairwise.linear.pairwise_align.cljs$lang$applyTo = (function (seq11509){
var G__11510 = cljs.core.first(seq11509);
var seq11509__$1 = cljs.core.next(seq11509);
var G__11511 = cljs.core.first(seq11509__$1);
var seq11509__$2 = cljs.core.next(seq11509__$1);
var G__11512 = cljs.core.first(seq11509__$2);
var seq11509__$3 = cljs.core.next(seq11509__$2);
var G__11513 = cljs.core.first(seq11509__$3);
var seq11509__$4 = cljs.core.next(seq11509__$3);
return pairwise.linear.pairwise_align.cljs$core$IFn$_invoke$arity$variadic(G__11510,G__11511,G__11512,G__11513,seq11509__$4);
});

