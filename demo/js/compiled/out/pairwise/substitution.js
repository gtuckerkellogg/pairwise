// Compiled by ClojureScript 1.9.229 {:static-fns true, :optimize-constants true}
goog.provide('pairwise.substitution');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('cljs.reader');
goog.require('pairwise.cljsmacros');
/**
 * Create a simple substitution matrix instead of a full substitution matrix
 */
pairwise.substitution.simple_substitution_matrix = (function pairwise$substitution$simple_substitution_matrix(var_args){
var args__7491__auto__ = [];
var len__7484__auto___11385 = arguments.length;
var i__7485__auto___11386 = (0);
while(true){
if((i__7485__auto___11386 < len__7484__auto___11385)){
args__7491__auto__.push((arguments[i__7485__auto___11386]));

var G__11387 = (i__7485__auto___11386 + (1));
i__7485__auto___11386 = G__11387;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((1) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((1)),(0),null)):null);
return pairwise.substitution.simple_substitution_matrix.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7492__auto__);
});

pairwise.substitution.simple_substitution_matrix.cljs$core$IFn$_invoke$arity$variadic = (function (seq_type,p__11371){
var map__11372 = p__11371;
var map__11372__$1 = ((((!((map__11372 == null)))?((((map__11372.cljs$lang$protocol_mask$partition0$ & (64))) || (map__11372.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__11372):map__11372);
var same = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11372__$1,cljs.core.cst$kw$same,(1));
var different = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__11372__$1,cljs.core.cst$kw$different,(-2));
var s = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(seq_type,cljs.core.cst$kw$dna))?"ACGT":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(seq_type,cljs.core.cst$kw$protein))?"ARNDCQEGHILKMFPSTWYVBZX":null));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (s,map__11372,map__11372__$1,same,different){
return (function (keys){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(keys),cljs.core.second(keys))){
return cljs.core.PersistentArrayMap.fromArray([keys,same], true, false);
} else {
return cljs.core.PersistentArrayMap.fromArray([keys,different], true, false);
}
});})(s,map__11372,map__11372__$1,same,different))
,(function (){var iter__7189__auto__ = ((function (s,map__11372,map__11372__$1,same,different){
return (function pairwise$substitution$iter__11374(s__11375){
return (new cljs.core.LazySeq(null,((function (s,map__11372,map__11372__$1,same,different){
return (function (){
var s__11375__$1 = s__11375;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__11375__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var s1 = cljs.core.first(xs__5205__auto__);
var iterys__7185__auto__ = ((function (s__11375__$1,s1,xs__5205__auto__,temp__4657__auto__,s,map__11372,map__11372__$1,same,different){
return (function pairwise$substitution$iter__11374_$_iter__11376(s__11377){
return (new cljs.core.LazySeq(null,((function (s__11375__$1,s1,xs__5205__auto__,temp__4657__auto__,s,map__11372,map__11372__$1,same,different){
return (function (){
var s__11377__$1 = s__11377;
while(true){
var temp__4657__auto____$1 = cljs.core.seq(s__11377__$1);
if(temp__4657__auto____$1){
var s__11377__$2 = temp__4657__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__11377__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__11377__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__11379 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__11378 = (0);
while(true){
if((i__11378 < size__7188__auto__)){
var s2 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__11378);
cljs.core.chunk_append(b__11379,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [s1,s2], null));

var G__11388 = (i__11378 + (1));
i__11378 = G__11388;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__11379),pairwise$substitution$iter__11374_$_iter__11376(cljs.core.chunk_rest(s__11377__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__11379),null);
}
} else {
var s2 = cljs.core.first(s__11377__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [s1,s2], null),pairwise$substitution$iter__11374_$_iter__11376(cljs.core.rest(s__11377__$2)));
}
} else {
return null;
}
break;
}
});})(s__11375__$1,s1,xs__5205__auto__,temp__4657__auto__,s,map__11372,map__11372__$1,same,different))
,null,null));
});})(s__11375__$1,s1,xs__5205__auto__,temp__4657__auto__,s,map__11372,map__11372__$1,same,different))
;
var fs__7186__auto__ = cljs.core.seq(iterys__7185__auto__(cljs.core.seq(s)));
if(fs__7186__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__7186__auto__,pairwise$substitution$iter__11374(cljs.core.rest(s__11375__$1)));
} else {
var G__11389 = cljs.core.rest(s__11375__$1);
s__11375__$1 = G__11389;
continue;
}
} else {
return null;
}
break;
}
});})(s,map__11372,map__11372__$1,same,different))
,null,null));
});})(s,map__11372,map__11372__$1,same,different))
;
return iter__7189__auto__(cljs.core.seq(s));
})()));
});

pairwise.substitution.simple_substitution_matrix.cljs$lang$maxFixedArity = (1);

pairwise.substitution.simple_substitution_matrix.cljs$lang$applyTo = (function (seq11369){
var G__11370 = cljs.core.first(seq11369);
var seq11369__$1 = cljs.core.next(seq11369);
return pairwise.substitution.simple_substitution_matrix.cljs$core$IFn$_invoke$arity$variadic(G__11370,seq11369__$1);
});

/**
 * This gets a substitution matrix from a file
 */
pairwise.substitution.scoring_matrix = (function pairwise$substitution$scoring_matrix(contents){
var contents__$1 = clojure.string.split_lines(contents);
var contents__$2 = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (contents__$1){
return (function (p1__11390_SHARP_){
return cljs.core.not(cljs.core.re_find(/#/,p1__11390_SHARP_));
});})(contents__$1))
,contents__$1);
var aa1 = cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.seq,cljs.core.rest(clojure.string.split.cljs$core$IFn$_invoke$arity$2(cljs.core.first(contents__$2),/\s+/))));
var matrix = cljs.core.rest(contents__$2);
var scoremap = ((function (contents__$1,contents__$2,aa1,matrix){
return (function (scores){
var scores__$1 = clojure.string.split.cljs$core$IFn$_invoke$arity$2(scores,/\s+/);
var aa2 = cljs.core.first(cljs.core.seq(cljs.core.first(scores__$1)));
var scores__$2 = cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.reader.read_string,cljs.core.rest(scores__$1));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(((function (scores__$1,aa2,scores__$2,contents__$1,contents__$2,aa1,matrix){
return (function (p1__11392_SHARP_,p2__11391_SHARP_){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p2__11391_SHARP_,aa2], null)],[cljs.core.nth.cljs$core$IFn$_invoke$arity$2(scores__$2,p1__11392_SHARP_)]);
});})(scores__$1,aa2,scores__$2,contents__$1,contents__$2,aa1,matrix))
,aa1));
});})(contents__$1,contents__$2,aa1,matrix))
;
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(scoremap,matrix));
});
