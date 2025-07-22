// Compiled by ClojureScript 1.9.229 {:static-fns true, :optimize-constants true}
goog.provide('reagent_forms.core');
goog.require('cljs.core');
goog.require('clojure.walk');
goog.require('clojure.string');
goog.require('goog.string');
goog.require('goog.string.format');
goog.require('reagent.core');
goog.require('reagent_forms.datepicker');
reagent_forms.core.value_of = (function reagent_forms$core$value_of(element){
return element.target.value;
});
reagent_forms.core.id__GT_path = cljs.core.memoize((function (id){
if(cljs.core.sequential_QMARK_(id)){
return id;
} else {
var segments = clojure.string.split.cljs$core$IFn$_invoke$arity$2(cljs.core.subs.cljs$core$IFn$_invoke$arity$2([cljs.core.str(id)].join(''),(1)),/\./);
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.keyword,segments);
}
}));
reagent_forms.core.set_doc_value = (function reagent_forms$core$set_doc_value(doc,id,value,events){
var path = (reagent_forms.core.id__GT_path.cljs$core$IFn$_invoke$arity$1 ? reagent_forms.core.id__GT_path.cljs$core$IFn$_invoke$arity$1(id) : reagent_forms.core.id__GT_path.call(null,id));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (path){
return (function (p1__13685_SHARP_,p2__13684_SHARP_){
var or__6409__auto__ = (p2__13684_SHARP_.cljs$core$IFn$_invoke$arity$3 ? p2__13684_SHARP_.cljs$core$IFn$_invoke$arity$3(path,value,p1__13685_SHARP_) : p2__13684_SHARP_.call(null,path,value,p1__13685_SHARP_));
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return p1__13685_SHARP_;
}
});})(path))
,cljs.core.assoc_in(doc,path,value),events);
});
reagent_forms.core.mk_save_fn = (function reagent_forms$core$mk_save_fn(doc,events){
return (function (id,value){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(doc,reagent_forms.core.set_doc_value,id,value,cljs.core.array_seq([events], 0));
});
});
reagent_forms.core.wrap_get_fn = (function reagent_forms$core$wrap_get_fn(get,wrapper){
return (function (id){
var G__13687 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
return (wrapper.cljs$core$IFn$_invoke$arity$1 ? wrapper.cljs$core$IFn$_invoke$arity$1(G__13687) : wrapper.call(null,G__13687));
});
});
reagent_forms.core.wrap_save_fn = (function reagent_forms$core$wrap_save_fn(save_BANG_,wrapper){
return (function (id,value){
var G__13690 = id;
var G__13691 = (wrapper.cljs$core$IFn$_invoke$arity$1 ? wrapper.cljs$core$IFn$_invoke$arity$1(value) : wrapper.call(null,value));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13690,G__13691) : save_BANG_.call(null,G__13690,G__13691));
});
});
reagent_forms.core.wrap_fns = (function reagent_forms$core$wrap_fns(opts,node){
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$doc,cljs.core.cst$kw$doc.cljs$core$IFn$_invoke$arity$1(opts),cljs.core.cst$kw$get,(function (){var temp__4655__auto__ = cljs.core.cst$kw$in_DASH_fn.cljs$core$IFn$_invoke$arity$1(cljs.core.second(node));
if(cljs.core.truth_(temp__4655__auto__)){
var in_fn = temp__4655__auto__;
return reagent_forms.core.wrap_get_fn(cljs.core.cst$kw$get.cljs$core$IFn$_invoke$arity$1(opts),in_fn);
} else {
return cljs.core.cst$kw$get.cljs$core$IFn$_invoke$arity$1(opts);
}
})(),cljs.core.cst$kw$save_BANG_,(function (){var temp__4655__auto__ = cljs.core.cst$kw$out_DASH_fn.cljs$core$IFn$_invoke$arity$1(cljs.core.second(node));
if(cljs.core.truth_(temp__4655__auto__)){
var out_fn = temp__4655__auto__;
return reagent_forms.core.wrap_save_fn(cljs.core.cst$kw$save_BANG_.cljs$core$IFn$_invoke$arity$1(opts),out_fn);
} else {
return cljs.core.cst$kw$save_BANG_.cljs$core$IFn$_invoke$arity$1(opts);
}
})()], null);
});
reagent_forms.core.clean_attrs = (function reagent_forms$core$clean_attrs(attrs){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(attrs,cljs.core.cst$kw$date_DASH_format,cljs.core.array_seq([cljs.core.cst$kw$fmt,cljs.core.cst$kw$event,cljs.core.cst$kw$inline,cljs.core.cst$kw$field,cljs.core.cst$kw$preamble,cljs.core.cst$kw$visible_QMARK_,cljs.core.cst$kw$auto_DASH_close_QMARK_], 0));
});
if(typeof reagent_forms.core.format_type !== 'undefined'){
} else {
reagent_forms.core.format_type = (function (){var method_table__7334__auto__ = (function (){var G__13692 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13692) : cljs.core.atom.call(null,G__13692));
})();
var prefer_table__7335__auto__ = (function (){var G__13693 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13693) : cljs.core.atom.call(null,G__13693));
})();
var method_cache__7336__auto__ = (function (){var G__13694 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13694) : cljs.core.atom.call(null,G__13694));
})();
var cached_hierarchy__7337__auto__ = (function (){var G__13695 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13695) : cljs.core.atom.call(null,G__13695));
})();
var hierarchy__7338__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("reagent-forms.core","format-type"),((function (method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__){
return (function (field_type,_){
if(cljs.core.truth_(cljs.core.some(cljs.core.PersistentHashSet.fromArray([field_type], true),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$range,cljs.core.cst$kw$numeric], null)))){
return cljs.core.cst$kw$numeric;
} else {
return field_type;
}
});})(method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__))
,cljs.core.cst$kw$default,hierarchy__7338__auto__,method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__));
})();
}
reagent_forms.core.valid_number_ending_QMARK_ = (function reagent_forms$core$valid_number_ending_QMARK_(n){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(".",cljs.core.last(cljs.core.butlast(n)))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(".",cljs.core.last(n)))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("0",cljs.core.last(n)));
});
reagent_forms.core.format_value = (function reagent_forms$core$format_value(fmt,value){
if(cljs.core.truth_((function (){var and__6397__auto__ = cljs.core.not((function (){var G__13699 = parseFloat(value);
return isNaN(G__13699);
})());
if(and__6397__auto__){
return fmt;
} else {
return and__6397__auto__;
}
})())){
return goog.string.format(fmt,value);
} else {
return value;
}
});
reagent_forms.core.format_type.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$numeric,(function (_,n){
if(cljs.core.truth_(cljs.core.not_empty(n))){
var parsed = parseFloat(n);
if(cljs.core.truth_(isNaN(parsed))){
return null;
} else {
return parsed;
}
} else {
return null;
}
}));
reagent_forms.core.format_type.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$default,(function (_,value){
return value;
}));
if(typeof reagent_forms.core.bind !== 'undefined'){
} else {
reagent_forms.core.bind = (function (){var method_table__7334__auto__ = (function (){var G__13700 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13700) : cljs.core.atom.call(null,G__13700));
})();
var prefer_table__7335__auto__ = (function (){var G__13701 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13701) : cljs.core.atom.call(null,G__13701));
})();
var method_cache__7336__auto__ = (function (){var G__13702 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13702) : cljs.core.atom.call(null,G__13702));
})();
var cached_hierarchy__7337__auto__ = (function (){var G__13703 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13703) : cljs.core.atom.call(null,G__13703));
})();
var hierarchy__7338__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("reagent-forms.core","bind"),((function (method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__){
return (function (p__13704,_){
var map__13705 = p__13704;
var map__13705__$1 = ((((!((map__13705 == null)))?((((map__13705.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13705.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13705):map__13705);
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13705__$1,cljs.core.cst$kw$field);
if(cljs.core.truth_(cljs.core.some(cljs.core.PersistentHashSet.fromArray([field], true),new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$text,cljs.core.cst$kw$numeric,cljs.core.cst$kw$password,cljs.core.cst$kw$email,cljs.core.cst$kw$tel,cljs.core.cst$kw$range,cljs.core.cst$kw$textarea], null)))){
return cljs.core.cst$kw$input_DASH_field;
} else {
return field;
}
});})(method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__))
,cljs.core.cst$kw$default,hierarchy__7338__auto__,method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__));
})();
}
reagent_forms.core.bind.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$input_DASH_field,(function (p__13708,p__13709){
var map__13710 = p__13708;
var map__13710__$1 = ((((!((map__13710 == null)))?((((map__13710.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13710.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13710):map__13710);
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13710__$1,cljs.core.cst$kw$field);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13710__$1,cljs.core.cst$kw$id);
var fmt = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13710__$1,cljs.core.cst$kw$fmt);
var map__13711 = p__13709;
var map__13711__$1 = ((((!((map__13711 == null)))?((((map__13711.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13711.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13711):map__13711);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13711__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13711__$1,cljs.core.cst$kw$save_BANG_);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13711__$1,cljs.core.cst$kw$doc);
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$value,(function (){var value = (function (){var or__6409__auto__ = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return "";
}
})();
return reagent_forms.core.format_value(fmt,value);
})(),cljs.core.cst$kw$on_DASH_change,((function (map__13710,map__13710__$1,field,id,fmt,map__13711,map__13711__$1,get,save_BANG_,doc){
return (function (p1__13707_SHARP_){
var G__13714 = id;
var G__13715 = (function (){var G__13716 = field;
var G__13717 = reagent_forms.core.value_of(p1__13707_SHARP_);
return (reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2 ? reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2(G__13716,G__13717) : reagent_forms.core.format_type.call(null,G__13716,G__13717));
})();
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13714,G__13715) : save_BANG_.call(null,G__13714,G__13715));
});})(map__13710,map__13710__$1,field,id,fmt,map__13711,map__13711__$1,get,save_BANG_,doc))
], null);
}));
reagent_forms.core.bind.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$checkbox,(function (p__13718,p__13719){
var map__13720 = p__13718;
var map__13720__$1 = ((((!((map__13720 == null)))?((((map__13720.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13720.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13720):map__13720);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13720__$1,cljs.core.cst$kw$id);
var map__13721 = p__13719;
var map__13721__$1 = ((((!((map__13721 == null)))?((((map__13721.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13721.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13721):map__13721);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13721__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13721__$1,cljs.core.cst$kw$save_BANG_);
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$checked,cljs.core.boolean$((get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id))),cljs.core.cst$kw$on_DASH_change,((function (map__13720,map__13720__$1,id,map__13721,map__13721__$1,get,save_BANG_){
return (function (){
var G__13724 = id;
var G__13725 = cljs.core.not((get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id)));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13724,G__13725) : save_BANG_.call(null,G__13724,G__13725));
});})(map__13720,map__13720__$1,id,map__13721,map__13721__$1,get,save_BANG_))
], null);
}));
reagent_forms.core.bind.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$default,(function (_,___$1){
return null;
}));
reagent_forms.core.set_attrs = (function reagent_forms$core$set_attrs(var_args){
var args__7491__auto__ = [];
var len__7484__auto___13737 = arguments.length;
var i__7485__auto___13738 = (0);
while(true){
if((i__7485__auto___13738 < len__7484__auto___13737)){
args__7491__auto__.push((arguments[i__7485__auto___13738]));

var G__13739 = (i__7485__auto___13738 + (1));
i__7485__auto___13738 = G__13739;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((2) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((2)),(0),null)):null);
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7492__auto__);
});

reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic = (function (p__13729,opts,p__13730){
var vec__13731 = p__13729;
var seq__13732 = cljs.core.seq(vec__13731);
var first__13733 = cljs.core.first(seq__13732);
var seq__13732__$1 = cljs.core.next(seq__13732);
var type = first__13733;
var first__13733__$1 = cljs.core.first(seq__13732__$1);
var seq__13732__$2 = cljs.core.next(seq__13732__$1);
var attrs = first__13733__$1;
var body = seq__13732__$2;
var vec__13734 = p__13730;
var default_attrs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13734,(0),null);
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,reagent_forms.core.clean_attrs(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([default_attrs,(reagent_forms.core.bind.cljs$core$IFn$_invoke$arity$2 ? reagent_forms.core.bind.cljs$core$IFn$_invoke$arity$2(attrs,opts) : reagent_forms.core.bind.call(null,attrs,opts)),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(attrs,cljs.core.cst$kw$checked,cljs.core.array_seq([cljs.core.cst$kw$default_DASH_checked], 0))], 0)))], null),body);
});

reagent_forms.core.set_attrs.cljs$lang$maxFixedArity = (2);

reagent_forms.core.set_attrs.cljs$lang$applyTo = (function (seq13726){
var G__13727 = cljs.core.first(seq13726);
var seq13726__$1 = cljs.core.next(seq13726);
var G__13728 = cljs.core.first(seq13726__$1);
var seq13726__$2 = cljs.core.next(seq13726__$1);
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic(G__13727,G__13728,seq13726__$2);
});

if(typeof reagent_forms.core.init_field !== 'undefined'){
} else {
reagent_forms.core.init_field = (function (){var method_table__7334__auto__ = (function (){var G__13740 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13740) : cljs.core.atom.call(null,G__13740));
})();
var prefer_table__7335__auto__ = (function (){var G__13741 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13741) : cljs.core.atom.call(null,G__13741));
})();
var method_cache__7336__auto__ = (function (){var G__13742 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13742) : cljs.core.atom.call(null,G__13742));
})();
var cached_hierarchy__7337__auto__ = (function (){var G__13743 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__13743) : cljs.core.atom.call(null,G__13743));
})();
var hierarchy__7338__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("reagent-forms.core","init-field"),((function (method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__){
return (function (p__13744,_){
var vec__13745 = p__13744;
var ___$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13745,(0),null);
var map__13748 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13745,(1),null);
var map__13748__$1 = ((((!((map__13748 == null)))?((((map__13748.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13748.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13748):map__13748);
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13748__$1,cljs.core.cst$kw$field);
var field__$1 = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(field);
if(cljs.core.truth_(cljs.core.some(cljs.core.PersistentHashSet.fromArray([field__$1], true),new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$range,cljs.core.cst$kw$text,cljs.core.cst$kw$password,cljs.core.cst$kw$email,cljs.core.cst$kw$tel,cljs.core.cst$kw$textarea], null)))){
return cljs.core.cst$kw$input_DASH_field;
} else {
return field__$1;
}
});})(method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__,hierarchy__7338__auto__))
,cljs.core.cst$kw$default,hierarchy__7338__auto__,method_table__7334__auto__,prefer_table__7335__auto__,method_cache__7336__auto__,cached_hierarchy__7337__auto__));
})();
}
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$container,(function (p__13751,p__13752){
var vec__13753 = p__13751;
var seq__13754 = cljs.core.seq(vec__13753);
var first__13755 = cljs.core.first(seq__13754);
var seq__13754__$1 = cljs.core.next(seq__13754);
var type = first__13755;
var first__13755__$1 = cljs.core.first(seq__13754__$1);
var seq__13754__$2 = cljs.core.next(seq__13754__$1);
var map__13756 = first__13755__$1;
var map__13756__$1 = ((((!((map__13756 == null)))?((((map__13756.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13756.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13756):map__13756);
var attrs = map__13756__$1;
var valid_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13756__$1,cljs.core.cst$kw$valid_QMARK_);
var body = seq__13754__$2;
var map__13757 = p__13752;
var map__13757__$1 = ((((!((map__13757 == null)))?((((map__13757.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13757.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13757):map__13757);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13757__$1,cljs.core.cst$kw$doc);
return ((function (vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13760 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13760) : visible__13676__auto__.call(null,G__13760));
})())){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,reagent_forms.core.clean_attrs((function (){var temp__4655__auto____$1 = (cljs.core.truth_(valid_QMARK_)?(function (){var G__13761 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (valid_QMARK_.cljs$core$IFn$_invoke$arity$1 ? valid_QMARK_.cljs$core$IFn$_invoke$arity$1(G__13761) : valid_QMARK_.call(null,G__13761));
})():null);
if(cljs.core.truth_(temp__4655__auto____$1)){
var valid_class = temp__4655__auto____$1;
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$3(attrs,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class], null),((function (valid_class,temp__4655__auto____$1,visible__13676__auto__,temp__4655__auto__,vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc){
return (function (p1__13750_SHARP_){
if(!(cljs.core.empty_QMARK_(p1__13750_SHARP_))){
return [cljs.core.str(p1__13750_SHARP_),cljs.core.str(" "),cljs.core.str(valid_class)].join('');
} else {
return valid_class;
}
});})(valid_class,temp__4655__auto____$1,visible__13676__auto__,temp__4655__auto__,vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc))
);
} else {
return attrs;
}
})())], null),body);
} else {
return null;
}
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,reagent_forms.core.clean_attrs((function (){var temp__4655__auto____$1 = (cljs.core.truth_(valid_QMARK_)?(function (){var G__13762 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (valid_QMARK_.cljs$core$IFn$_invoke$arity$1 ? valid_QMARK_.cljs$core$IFn$_invoke$arity$1(G__13762) : valid_QMARK_.call(null,G__13762));
})():null);
if(cljs.core.truth_(temp__4655__auto____$1)){
var valid_class = temp__4655__auto____$1;
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$3(attrs,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class], null),((function (valid_class,temp__4655__auto____$1,temp__4655__auto__,vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc){
return (function (p1__13750_SHARP_){
if(!(cljs.core.empty_QMARK_(p1__13750_SHARP_))){
return [cljs.core.str(p1__13750_SHARP_),cljs.core.str(" "),cljs.core.str(valid_class)].join('');
} else {
return valid_class;
}
});})(valid_class,temp__4655__auto____$1,temp__4655__auto__,vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc))
);
} else {
return attrs;
}
})())], null),body);
}
});
;})(vec__13753,seq__13754,first__13755,seq__13754__$1,type,first__13755__$1,seq__13754__$2,map__13756,map__13756__$1,attrs,valid_QMARK_,body,map__13757,map__13757__$1,doc))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$input_DASH_field,(function (p__13763,p__13764){
var vec__13765 = p__13763;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13765,(0),null);
var map__13768 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13765,(1),null);
var map__13768__$1 = ((((!((map__13768 == null)))?((((map__13768.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13768.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13768):map__13768);
var attrs = map__13768__$1;
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13768__$1,cljs.core.cst$kw$field);
var component = vec__13765;
var map__13769 = p__13764;
var map__13769__$1 = ((((!((map__13769 == null)))?((((map__13769.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13769.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13769):map__13769);
var opts = map__13769__$1;
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13769__$1,cljs.core.cst$kw$doc);
return ((function (vec__13765,_,map__13768,map__13768__$1,attrs,field,component,map__13769,map__13769__$1,opts,doc){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13772 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13772) : visible__13676__auto__.call(null,G__13772));
})())){
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic(component,opts,cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,field], null)], 0));
} else {
return null;
}
} else {
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic(component,opts,cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,field], null)], 0));
}
});
;})(vec__13765,_,map__13768,map__13768__$1,attrs,field,component,map__13769,map__13769__$1,opts,doc))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$numeric,(function (p__13775,p__13776){
var vec__13777 = p__13775;
var type = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13777,(0),null);
var map__13780 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13777,(1),null);
var map__13780__$1 = ((((!((map__13780 == null)))?((((map__13780.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13780.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13780):map__13780);
var attrs = map__13780__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13780__$1,cljs.core.cst$kw$id);
var fmt = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13780__$1,cljs.core.cst$kw$fmt);
var map__13781 = p__13776;
var map__13781__$1 = ((((!((map__13781 == null)))?((((map__13781.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13781.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13781):map__13781);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13781__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13781__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13781__$1,cljs.core.cst$kw$save_BANG_);
var input_value = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(null);
return ((function (input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13784 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13784) : visible__13676__auto__.call(null,G__13784));
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$value,(function (){var or__6409__auto__ = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(input_value) : cljs.core.deref.call(null,input_value));
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return (get.cljs$core$IFn$_invoke$arity$2 ? get.cljs$core$IFn$_invoke$arity$2(id,"") : get.call(null,id,""));
}
})(),cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_){
return (function (p1__13773_SHARP_){
var G__13785 = input_value;
var G__13786 = reagent_forms.core.value_of(p1__13773_SHARP_);
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13785,G__13786) : cljs.core.reset_BANG_.call(null,G__13785,G__13786));
});})(visible__13676__auto__,temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_blur,((function (visible__13676__auto__,temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_){
return (function (p1__13774_SHARP_){
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(input_value,null) : cljs.core.reset_BANG_.call(null,input_value,null));

var G__13787 = id;
var G__13788 = (function (){var G__13789 = cljs.core.cst$kw$numeric;
var G__13790 = reagent_forms.core.format_value(fmt,reagent_forms.core.value_of(p1__13774_SHARP_));
return (reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2 ? reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2(G__13789,G__13790) : reagent_forms.core.format_type.call(null,G__13789,G__13790));
})();
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13787,G__13788) : save_BANG_.call(null,G__13787,G__13788));
});})(visible__13676__auto__,temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_))
], null),attrs], 0))], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$value,(function (){var or__6409__auto__ = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(input_value) : cljs.core.deref.call(null,input_value));
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return (get.cljs$core$IFn$_invoke$arity$2 ? get.cljs$core$IFn$_invoke$arity$2(id,"") : get.call(null,id,""));
}
})(),cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_){
return (function (p1__13773_SHARP_){
var G__13791 = input_value;
var G__13792 = reagent_forms.core.value_of(p1__13773_SHARP_);
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13791,G__13792) : cljs.core.reset_BANG_.call(null,G__13791,G__13792));
});})(temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_blur,((function (temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_){
return (function (p1__13774_SHARP_){
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(input_value,null) : cljs.core.reset_BANG_.call(null,input_value,null));

var G__13793 = id;
var G__13794 = (function (){var G__13795 = cljs.core.cst$kw$numeric;
var G__13796 = reagent_forms.core.format_value(fmt,reagent_forms.core.value_of(p1__13774_SHARP_));
return (reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2 ? reagent_forms.core.format_type.cljs$core$IFn$_invoke$arity$2(G__13795,G__13796) : reagent_forms.core.format_type.call(null,G__13795,G__13796));
})();
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13793,G__13794) : save_BANG_.call(null,G__13793,G__13794));
});})(temp__4655__auto__,input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_))
], null),attrs], 0))], null);
}
});
;})(input_value,vec__13777,type,map__13780,map__13780__$1,attrs,id,fmt,map__13781,map__13781__$1,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$datepicker,(function (p__13800,p__13801){
var vec__13802 = p__13800;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13802,(0),null);
var map__13805 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13802,(1),null);
var map__13805__$1 = ((((!((map__13805 == null)))?((((map__13805.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13805.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13805):map__13805);
var attrs = map__13805__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13805__$1,cljs.core.cst$kw$id);
var date_format = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13805__$1,cljs.core.cst$kw$date_DASH_format);
var inline = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13805__$1,cljs.core.cst$kw$inline);
var auto_close_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13805__$1,cljs.core.cst$kw$auto_DASH_close_QMARK_);
var lang = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__13805__$1,cljs.core.cst$kw$lang,cljs.core.cst$kw$en_DASH_US);
var map__13806 = p__13801;
var map__13806__$1 = ((((!((map__13806 == null)))?((((map__13806.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13806.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13806):map__13806);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13806__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13806__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13806__$1,cljs.core.cst$kw$save_BANG_);
var fmt = reagent_forms.datepicker.parse_format(date_format);
var selected_date = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
var selected_month = (((cljs.core.cst$kw$month.cljs$core$IFn$_invoke$arity$1(selected_date) > (0)))?(cljs.core.cst$kw$month.cljs$core$IFn$_invoke$arity$1(selected_date) - (1)):cljs.core.cst$kw$month.cljs$core$IFn$_invoke$arity$1(selected_date));
var today = (new Date());
var year = (function (){var or__6409__auto__ = cljs.core.cst$kw$year.cljs$core$IFn$_invoke$arity$1(selected_date);
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return today.getFullYear();
}
})();
var month = (function (){var or__6409__auto__ = selected_month;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return today.getMonth();
}
})();
var day = (function (){var or__6409__auto__ = cljs.core.cst$kw$day.cljs$core$IFn$_invoke$arity$1(selected_date);
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return today.getDate();
}
})();
var expanded_QMARK_ = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
return ((function (fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13809 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13809) : visible__13676__auto__.call(null,G__13809));
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$datepicker_DASH_wrapper,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$input_DASH_group$date,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$read_DASH_only,true,cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$on_DASH_click,((function (visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13797_SHARP_){
p1__13797_SHARP_.preventDefault();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(expanded_QMARK_,cljs.core.not);
});})(visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$value,(function (){var temp__4655__auto____$1 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(temp__4655__auto____$1)){
var date = temp__4655__auto____$1;
return reagent_forms.datepicker.format_date(date,fmt);
} else {
return "";
}
})()], null),reagent_forms.core.clean_attrs(attrs)], 0))], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$span$input_DASH_group_DASH_addon,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$on_DASH_click,((function (visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13798_SHARP_){
p1__13798_SHARP_.preventDefault();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(expanded_QMARK_,cljs.core.not);
});})(visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$i$glyphicon$glyphicon_DASH_calendar], null)], null)], null),new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.datepicker.datepicker,year,month,day,expanded_QMARK_,auto_close_QMARK_,((function (visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (){
return (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
});})(visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,((function (visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13799_SHARP_){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,p1__13799_SHARP_) : save_BANG_.call(null,id,p1__13799_SHARP_));
});})(visible__13676__auto__,temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,inline,lang], null)], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$datepicker_DASH_wrapper,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$div$input_DASH_group$date,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input$form_DASH_control,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$read_DASH_only,true,cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$on_DASH_click,((function (temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13797_SHARP_){
p1__13797_SHARP_.preventDefault();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(expanded_QMARK_,cljs.core.not);
});})(temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$value,(function (){var temp__4655__auto____$1 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(temp__4655__auto____$1)){
var date = temp__4655__auto____$1;
return reagent_forms.datepicker.format_date(date,fmt);
} else {
return "";
}
})()], null),reagent_forms.core.clean_attrs(attrs)], 0))], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$span$input_DASH_group_DASH_addon,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$on_DASH_click,((function (temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13798_SHARP_){
p1__13798_SHARP_.preventDefault();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(expanded_QMARK_,cljs.core.not);
});})(temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$i$glyphicon$glyphicon_DASH_calendar], null)], null)], null),new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.datepicker.datepicker,year,month,day,expanded_QMARK_,auto_close_QMARK_,((function (temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (){
return (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
});})(temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,((function (temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_){
return (function (p1__13799_SHARP_){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,p1__13799_SHARP_) : save_BANG_.call(null,id,p1__13799_SHARP_));
});})(temp__4655__auto__,fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
,inline,lang], null)], null);
}
});
;})(fmt,selected_date,selected_month,today,year,month,day,expanded_QMARK_,vec__13802,_,map__13805,map__13805__$1,attrs,id,date_format,inline,auto_close_QMARK_,lang,map__13806,map__13806__$1,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$checkbox,(function (p__13810,p__13811){
var vec__13812 = p__13810;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13812,(0),null);
var map__13815 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13812,(1),null);
var map__13815__$1 = ((((!((map__13815 == null)))?((((map__13815.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13815.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13815):map__13815);
var attrs = map__13815__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13815__$1,cljs.core.cst$kw$id);
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13815__$1,cljs.core.cst$kw$field);
var checked = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13815__$1,cljs.core.cst$kw$checked);
var default_checked = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13815__$1,cljs.core.cst$kw$default_DASH_checked);
var component = vec__13812;
var map__13816 = p__13811;
var map__13816__$1 = ((((!((map__13816 == null)))?((((map__13816.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13816.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13816):map__13816);
var opts = map__13816__$1;
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13816__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13816__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13816__$1,cljs.core.cst$kw$save_BANG_);
if(cljs.core.truth_((function (){var or__6409__auto__ = checked;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return default_checked;
}
})())){
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,true) : save_BANG_.call(null,id,true));
} else {
}

return ((function (vec__13812,_,map__13815,map__13815__$1,attrs,id,field,checked,default_checked,component,map__13816,map__13816__$1,opts,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(attrs,cljs.core.cst$kw$checked,cljs.core.array_seq([cljs.core.cst$kw$default_DASH_checked], 0)));
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13819 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13819) : visible__13676__auto__.call(null,G__13819));
})())){
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic(component,opts,cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,field], null)], 0));
} else {
return null;
}
} else {
return reagent_forms.core.set_attrs.cljs$core$IFn$_invoke$arity$variadic(component,opts,cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,field], null)], 0));
}
});
;})(vec__13812,_,map__13815,map__13815__$1,attrs,id,field,checked,default_checked,component,map__13816,map__13816__$1,opts,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$label,(function (p__13820,p__13821){
var vec__13822 = p__13820;
var type = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13822,(0),null);
var map__13825 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13822,(1),null);
var map__13825__$1 = ((((!((map__13825 == null)))?((((map__13825.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13825.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13825):map__13825);
var attrs = map__13825__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13825__$1,cljs.core.cst$kw$id);
var preamble = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13825__$1,cljs.core.cst$kw$preamble);
var postamble = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13825__$1,cljs.core.cst$kw$postamble);
var placeholder = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13825__$1,cljs.core.cst$kw$placeholder);
var map__13826 = p__13821;
var map__13826__$1 = ((((!((map__13826 == null)))?((((map__13826.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13826.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13826):map__13826);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13826__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13826__$1,cljs.core.cst$kw$get);
return ((function (vec__13822,type,map__13825,map__13825__$1,attrs,id,preamble,postamble,placeholder,map__13826,map__13826__$1,doc,get){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13829 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13829) : visible__13676__auto__.call(null,G__13829));
})())){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,attrs,preamble,(function (){var temp__4655__auto____$1 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(temp__4655__auto____$1)){
var value = temp__4655__auto____$1;
return [cljs.core.str(value),cljs.core.str(postamble)].join('');
} else {
return placeholder;
}
})()], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,attrs,preamble,(function (){var temp__4655__auto____$1 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(temp__4655__auto____$1)){
var value = temp__4655__auto____$1;
return [cljs.core.str(value),cljs.core.str(postamble)].join('');
} else {
return placeholder;
}
})()], null);
}
});
;})(vec__13822,type,map__13825,map__13825__$1,attrs,id,preamble,postamble,placeholder,map__13826,map__13826__$1,doc,get))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$alert,(function (p__13830,p__13831){
var vec__13832 = p__13830;
var seq__13833 = cljs.core.seq(vec__13832);
var first__13834 = cljs.core.first(seq__13833);
var seq__13833__$1 = cljs.core.next(seq__13833);
var type = first__13834;
var first__13834__$1 = cljs.core.first(seq__13833__$1);
var seq__13833__$2 = cljs.core.next(seq__13833__$1);
var map__13835 = first__13834__$1;
var map__13835__$1 = ((((!((map__13835 == null)))?((((map__13835.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13835.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13835):map__13835);
var attrs = map__13835__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13835__$1,cljs.core.cst$kw$id);
var event = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13835__$1,cljs.core.cst$kw$event);
var touch_event = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13835__$1,cljs.core.cst$kw$touch_DASH_event);
var closeable_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__13835__$1,cljs.core.cst$kw$closeable_QMARK_,true);
var body = seq__13833__$2;
var map__13836 = p__13831;
var map__13836__$1 = ((((!((map__13836 == null)))?((((map__13836.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13836.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13836):map__13836);
var opts = map__13836__$1;
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13836__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13836__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13836__$1,cljs.core.cst$kw$save_BANG_);
return ((function (vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13839 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13839) : visible__13676__auto__.call(null,G__13839));
})())){
if(cljs.core.truth_(event)){
if(cljs.core.truth_((function (){var G__13840 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
return (event.cljs$core$IFn$_invoke$arity$1 ? event.cljs$core$IFn$_invoke$arity$1(G__13840) : event.call(null,G__13840));
})())){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(attrs,event)], null),body);
} else {
return null;
}
} else {
var temp__4655__auto____$1 = cljs.core.not_empty((get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id)));
if(cljs.core.truth_(temp__4655__auto____$1)){
var message = temp__4655__auto____$1;
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,reagent_forms.core.clean_attrs(attrs),(cljs.core.truth_(closeable_QMARK_)?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$button$close,cljs.core.PersistentArrayMap.fromArray([cljs.core.cst$kw$type,"button",cljs.core.cst$kw$aria_DASH_hidden,true,(function (){var or__6409__auto__ = touch_event;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return cljs.core.cst$kw$on_DASH_click;
}
})(),((function (message,temp__4655__auto____$1,visible__13676__auto__,temp__4655__auto__,vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_){
return (function (){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,null) : save_BANG_.call(null,id,null));
});})(message,temp__4655__auto____$1,visible__13676__auto__,temp__4655__auto__,vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_))
], true, false),"X"], null):null),message], null);
} else {
return null;
}
}
} else {
return null;
}
} else {
if(cljs.core.truth_(event)){
if(cljs.core.truth_((function (){var G__13841 = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
return (event.cljs$core$IFn$_invoke$arity$1 ? event.cljs$core$IFn$_invoke$arity$1(G__13841) : event.call(null,G__13841));
})())){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(attrs,event)], null),body);
} else {
return null;
}
} else {
var temp__4655__auto____$1 = cljs.core.not_empty((get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id)));
if(cljs.core.truth_(temp__4655__auto____$1)){
var message = temp__4655__auto____$1;
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,reagent_forms.core.clean_attrs(attrs),(cljs.core.truth_(closeable_QMARK_)?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$button$close,cljs.core.PersistentArrayMap.fromArray([cljs.core.cst$kw$type,"button",cljs.core.cst$kw$aria_DASH_hidden,true,(function (){var or__6409__auto__ = touch_event;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return cljs.core.cst$kw$on_DASH_click;
}
})(),((function (message,temp__4655__auto____$1,temp__4655__auto__,vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_){
return (function (){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,null) : save_BANG_.call(null,id,null));
});})(message,temp__4655__auto____$1,temp__4655__auto__,vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_))
], true, false),"X"], null):null),message], null);
} else {
return null;
}
}
}
});
;})(vec__13832,seq__13833,first__13834,seq__13833__$1,type,first__13834__$1,seq__13833__$2,map__13835,map__13835__$1,attrs,id,event,touch_event,closeable_QMARK_,body,map__13836,map__13836__$1,opts,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$radio,(function (p__13842,p__13843){
var vec__13844 = p__13842;
var seq__13845 = cljs.core.seq(vec__13844);
var first__13846 = cljs.core.first(seq__13845);
var seq__13845__$1 = cljs.core.next(seq__13845);
var type = first__13846;
var first__13846__$1 = cljs.core.first(seq__13845__$1);
var seq__13845__$2 = cljs.core.next(seq__13845__$1);
var map__13847 = first__13846__$1;
var map__13847__$1 = ((((!((map__13847 == null)))?((((map__13847.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13847.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13847):map__13847);
var attrs = map__13847__$1;
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13847__$1,cljs.core.cst$kw$field);
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13847__$1,cljs.core.cst$kw$name);
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13847__$1,cljs.core.cst$kw$value);
var checked = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13847__$1,cljs.core.cst$kw$checked);
var default_checked = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13847__$1,cljs.core.cst$kw$default_DASH_checked);
var body = seq__13845__$2;
var map__13848 = p__13843;
var map__13848__$1 = ((((!((map__13848 == null)))?((((map__13848.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13848.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13848):map__13848);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13848__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13848__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13848__$1,cljs.core.cst$kw$save_BANG_);
if(cljs.core.truth_((function (){var or__6409__auto__ = checked;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return default_checked;
}
})())){
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(name,value) : save_BANG_.call(null,name,value));
} else {
}

return ((function (vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13851 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13851) : visible__13676__auto__.call(null,G__13851));
})())){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(reagent_forms.core.clean_attrs(attrs),cljs.core.cst$kw$value,cljs.core.array_seq([cljs.core.cst$kw$default_DASH_checked], 0)),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,cljs.core.cst$kw$radio,cljs.core.cst$kw$checked,cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value,(get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(name) : get.call(null,name))),cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_){
return (function (){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(name,value) : save_BANG_.call(null,name,value));
});})(visible__13676__auto__,temp__4655__auto__,vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_))
], null)], 0))], null),body);
} else {
return null;
}
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(reagent_forms.core.clean_attrs(attrs),cljs.core.cst$kw$value,cljs.core.array_seq([cljs.core.cst$kw$default_DASH_checked], 0)),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,cljs.core.cst$kw$radio,cljs.core.cst$kw$checked,cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value,(get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(name) : get.call(null,name))),cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_){
return (function (){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(name,value) : save_BANG_.call(null,name,value));
});})(temp__4655__auto__,vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_))
], null)], 0))], null),body);
}
});
;})(vec__13844,seq__13845,first__13846,seq__13845__$1,type,first__13846__$1,seq__13845__$2,map__13847,map__13847__$1,attrs,field,name,value,checked,default_checked,body,map__13848,map__13848__$1,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$typeahead,(function (p__13856,p__13857){
var vec__13858 = p__13856;
var type = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13858,(0),null);
var map__13861 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13858,(1),null);
var map__13861__$1 = ((((!((map__13861 == null)))?((((map__13861.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13861.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13861):map__13861);
var attrs = map__13861__$1;
var result_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__13861__$1,cljs.core.cst$kw$result_DASH_fn,cljs.core.identity);
var item_class = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$item_DASH_class);
var input_placeholder = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$input_DASH_placeholder);
var highlight_class = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$highlight_DASH_class);
var list_class = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$list_DASH_class);
var data_source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$data_DASH_source);
var input_class = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$input_DASH_class);
var clear_on_focus_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__13861__$1,cljs.core.cst$kw$clear_DASH_on_DASH_focus_QMARK_,true);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13861__$1,cljs.core.cst$kw$id);
var choice_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__13861__$1,cljs.core.cst$kw$choice_DASH_fn,cljs.core.identity);
var map__13862 = p__13857;
var map__13862__$1 = ((((!((map__13862 == null)))?((((map__13862.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13862.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13862):map__13862);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13862__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13862__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13862__$1,cljs.core.cst$kw$save_BANG_);
var typeahead_hidden_QMARK_ = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(true);
var mouse_on_list_QMARK_ = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var selected_index = reagent.core.atom.cljs$core$IFn$_invoke$arity$1((-1));
var selections = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
var choose_selected = ((function (typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
if(cljs.core.truth_((function (){var and__6397__auto__ = cljs.core.not_empty((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)));
if(cljs.core.truth_(and__6397__auto__)){
return ((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)) > (-1));
} else {
return and__6397__auto__;
}
})())){
var choice = cljs.core.nth.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)),(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)));
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,choice) : save_BANG_.call(null,id,choice));

(choice_fn.cljs$core$IFn$_invoke$arity$1 ? choice_fn.cljs$core$IFn$_invoke$arity$1(choice) : choice_fn.call(null,choice));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));
} else {
return null;
}
});})(typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
;
return ((function (typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13865 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13865) : visible__13676__auto__.call(null,G__13865));
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input,new cljs.core.PersistentArrayMap(null, 8, [cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$placeholder,input_placeholder,cljs.core.cst$kw$class,input_class,cljs.core.cst$kw$value,(function (){var v = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(!(cljs.core.iterable_QMARK_(v))){
return v;
} else {
return cljs.core.first(v);
}
})(),cljs.core.cst$kw$on_DASH_focus,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
if(cljs.core.truth_(clear_on_focus_QMARK_)){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,null) : save_BANG_.call(null,id,null));
} else {
return null;
}
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_blur,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
if(cljs.core.truth_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(mouse_on_list_QMARK_) : cljs.core.deref.call(null,mouse_on_list_QMARK_)))){
return null;
} else {
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(-1)) : cljs.core.reset_BANG_.call(null,selected_index,(-1)));
}
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13852_SHARP_){
var temp__4657__auto__ = clojure.string.trim(reagent_forms.core.value_of(p1__13852_SHARP_));
if(cljs.core.truth_(temp__4657__auto__)){
var value = temp__4657__auto__;
var G__13866_13888 = selections;
var G__13867_13889 = (function (){var G__13868 = value.toLowerCase();
return (data_source.cljs$core$IFn$_invoke$arity$1 ? data_source.cljs$core$IFn$_invoke$arity$1(G__13868) : data_source.call(null,G__13868));
})();
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13866_13888,G__13867_13889) : cljs.core.reset_BANG_.call(null,G__13866_13888,G__13867_13889));

var G__13869_13890 = id;
var G__13870_13891 = reagent_forms.core.value_of(p1__13852_SHARP_);
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13869_13890,G__13870_13891) : save_BANG_.call(null,G__13869_13890,G__13870_13891));

(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,false) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,false));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(-1)) : cljs.core.reset_BANG_.call(null,selected_index,(-1)));
} else {
return null;
}
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_key_DASH_down,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13853_SHARP_){
var G__13871 = p1__13853_SHARP_.which;
switch (G__13871) {
case (38):
p1__13853_SHARP_.preventDefault();

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),(0))){
return null;
} else {
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,cljs.core.dec);
}

break;
case (40):
p1__13853_SHARP_.preventDefault();

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),(cljs.core.count((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections))) - (1)))){
return null;
} else {
var G__13872_13893 = id;
var G__13873_13894 = reagent_forms.core.value_of(p1__13853_SHARP_);
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13872_13893,G__13873_13894) : save_BANG_.call(null,G__13872_13893,G__13873_13894));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,cljs.core.inc);
}

break;
case (9):
return choose_selected();

break;
case (13):
p1__13853_SHARP_.preventDefault();

return choose_selected();

break;
case (27):
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(0)) : cljs.core.reset_BANG_.call(null,selected_index,(0)));

break;
default:
return "default";

}
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ul,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$style,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$display,(cljs.core.truth_((function (){var or__6409__auto__ = cljs.core.empty_QMARK_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)));
if(or__6409__auto__){
return or__6409__auto__;
} else {
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(typeahead_hidden_QMARK_) : cljs.core.deref.call(null,typeahead_hidden_QMARK_));
}
})())?cljs.core.cst$kw$none:cljs.core.cst$kw$block)], null),cljs.core.cst$kw$class,list_class,cljs.core.cst$kw$on_DASH_mouse_DASH_enter,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(mouse_on_list_QMARK_,true) : cljs.core.reset_BANG_.call(null,mouse_on_list_QMARK_,true));
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_mouse_DASH_leave,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(mouse_on_list_QMARK_,false) : cljs.core.reset_BANG_.call(null,mouse_on_list_QMARK_,false));
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null),cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (index,result){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$li,new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$tab_DASH_index,index,cljs.core.cst$kw$key,index,cljs.core.cst$kw$class,((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),index))?highlight_class:item_class),cljs.core.cst$kw$on_DASH_mouse_DASH_over,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13854_SHARP_){
var G__13874 = selected_index;
var G__13875 = (function (){var G__13876 = p1__13854_SHARP_.target.getAttribute("tabIndex");
return parseInt(G__13876);
})();
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13874,G__13875) : cljs.core.reset_BANG_.call(null,G__13874,G__13875));
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_click,((function (visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13855_SHARP_){
p1__13855_SHARP_.preventDefault();

(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,result) : save_BANG_.call(null,id,result));

return (choice_fn.cljs$core$IFn$_invoke$arity$1 ? choice_fn.cljs$core$IFn$_invoke$arity$1(result) : choice_fn.call(null,result));
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null),(result_fn.cljs$core$IFn$_invoke$arity$1 ? result_fn.cljs$core$IFn$_invoke$arity$1(result) : result_fn.call(null,result))], null);
});})(visible__13676__auto__,temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections))))], null)], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$input,new cljs.core.PersistentArrayMap(null, 8, [cljs.core.cst$kw$type,cljs.core.cst$kw$text,cljs.core.cst$kw$placeholder,input_placeholder,cljs.core.cst$kw$class,input_class,cljs.core.cst$kw$value,(function (){var v = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(!(cljs.core.iterable_QMARK_(v))){
return v;
} else {
return cljs.core.first(v);
}
})(),cljs.core.cst$kw$on_DASH_focus,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
if(cljs.core.truth_(clear_on_focus_QMARK_)){
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,null) : save_BANG_.call(null,id,null));
} else {
return null;
}
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_blur,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
if(cljs.core.truth_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(mouse_on_list_QMARK_) : cljs.core.deref.call(null,mouse_on_list_QMARK_)))){
return null;
} else {
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(-1)) : cljs.core.reset_BANG_.call(null,selected_index,(-1)));
}
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13852_SHARP_){
var temp__4657__auto__ = clojure.string.trim(reagent_forms.core.value_of(p1__13852_SHARP_));
if(cljs.core.truth_(temp__4657__auto__)){
var value = temp__4657__auto__;
var G__13877_13895 = selections;
var G__13878_13896 = (function (){var G__13879 = value.toLowerCase();
return (data_source.cljs$core$IFn$_invoke$arity$1 ? data_source.cljs$core$IFn$_invoke$arity$1(G__13879) : data_source.call(null,G__13879));
})();
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13877_13895,G__13878_13896) : cljs.core.reset_BANG_.call(null,G__13877_13895,G__13878_13896));

var G__13880_13897 = id;
var G__13881_13898 = reagent_forms.core.value_of(p1__13852_SHARP_);
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13880_13897,G__13881_13898) : save_BANG_.call(null,G__13880_13897,G__13881_13898));

(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,false) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,false));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(-1)) : cljs.core.reset_BANG_.call(null,selected_index,(-1)));
} else {
return null;
}
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_key_DASH_down,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13853_SHARP_){
var G__13882 = p1__13853_SHARP_.which;
switch (G__13882) {
case (38):
p1__13853_SHARP_.preventDefault();

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),(0))){
return null;
} else {
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,cljs.core.dec);
}

break;
case (40):
p1__13853_SHARP_.preventDefault();

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),(cljs.core.count((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections))) - (1)))){
return null;
} else {
var G__13883_13900 = id;
var G__13884_13901 = reagent_forms.core.value_of(p1__13853_SHARP_);
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13883_13900,G__13884_13901) : save_BANG_.call(null,G__13883_13900,G__13884_13901));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,cljs.core.inc);
}

break;
case (9):
return choose_selected();

break;
case (13):
p1__13853_SHARP_.preventDefault();

return choose_selected();

break;
case (27):
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(selected_index,(0)) : cljs.core.reset_BANG_.call(null,selected_index,(0)));

break;
default:
return "default";

}
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ul,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$style,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$display,(cljs.core.truth_((function (){var or__6409__auto__ = cljs.core.empty_QMARK_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)));
if(or__6409__auto__){
return or__6409__auto__;
} else {
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(typeahead_hidden_QMARK_) : cljs.core.deref.call(null,typeahead_hidden_QMARK_));
}
})())?cljs.core.cst$kw$none:cljs.core.cst$kw$block)], null),cljs.core.cst$kw$class,list_class,cljs.core.cst$kw$on_DASH_mouse_DASH_enter,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(mouse_on_list_QMARK_,true) : cljs.core.reset_BANG_.call(null,mouse_on_list_QMARK_,true));
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_mouse_DASH_leave,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (){
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(mouse_on_list_QMARK_,false) : cljs.core.reset_BANG_.call(null,mouse_on_list_QMARK_,false));
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null),cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (index,result){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$li,new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$tab_DASH_index,index,cljs.core.cst$kw$key,index,cljs.core.cst$kw$class,((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selected_index) : cljs.core.deref.call(null,selected_index)),index))?highlight_class:item_class),cljs.core.cst$kw$on_DASH_mouse_DASH_over,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13854_SHARP_){
var G__13885 = selected_index;
var G__13886 = (function (){var G__13887 = p1__13854_SHARP_.target.getAttribute("tabIndex");
return parseInt(G__13887);
})();
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13885,G__13886) : cljs.core.reset_BANG_.call(null,G__13885,G__13886));
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,cljs.core.cst$kw$on_DASH_click,((function (temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_){
return (function (p1__13855_SHARP_){
p1__13855_SHARP_.preventDefault();

(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(typeahead_hidden_QMARK_,true) : cljs.core.reset_BANG_.call(null,typeahead_hidden_QMARK_,true));

(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(id,result) : save_BANG_.call(null,id,result));

return (choice_fn.cljs$core$IFn$_invoke$arity$1 ? choice_fn.cljs$core$IFn$_invoke$arity$1(result) : choice_fn.call(null,result));
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
], null),(result_fn.cljs$core$IFn$_invoke$arity$1 ? result_fn.cljs$core$IFn$_invoke$arity$1(result) : result_fn.call(null,result))], null);
});})(temp__4655__auto__,typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections))))], null)], null);
}
});
;})(typeahead_hidden_QMARK_,mouse_on_list_QMARK_,selected_index,selections,choose_selected,vec__13858,type,map__13861,map__13861__$1,attrs,result_fn,item_class,input_placeholder,highlight_class,list_class,data_source,input_class,clear_on_focus_QMARK_,id,choice_fn,map__13862,map__13862__$1,doc,get,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$file,(function (p__13903,p__13904){
var vec__13905 = p__13903;
var type = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13905,(0),null);
var map__13908 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13905,(1),null);
var map__13908__$1 = ((((!((map__13908 == null)))?((((map__13908.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13908.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13908):map__13908);
var attrs = map__13908__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13908__$1,cljs.core.cst$kw$id);
var map__13909 = p__13904;
var map__13909__$1 = ((((!((map__13909 == null)))?((((map__13909.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13909.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13909):map__13909);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13909__$1,cljs.core.cst$kw$doc);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13909__$1,cljs.core.cst$kw$save_BANG_);
return ((function (vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13912 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13912) : visible__13676__auto__.call(null,G__13912));
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,cljs.core.cst$kw$file,cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_){
return (function (p1__13902_SHARP_){
var G__13913 = id;
var G__13914 = cljs.core.first(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(p1__13902_SHARP_.target.files));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13913,G__13914) : save_BANG_.call(null,G__13913,G__13914));
});})(visible__13676__auto__,temp__4655__auto__,vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_))
], null),reagent_forms.core.clean_attrs(attrs)], 0))], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,cljs.core.cst$kw$file,cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_){
return (function (p1__13902_SHARP_){
var G__13915 = id;
var G__13916 = cljs.core.first(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(p1__13902_SHARP_.target.files));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13915,G__13916) : save_BANG_.call(null,G__13915,G__13916));
});})(temp__4655__auto__,vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_))
], null),reagent_forms.core.clean_attrs(attrs)], 0))], null);
}
});
;})(vec__13905,type,map__13908,map__13908__$1,attrs,id,map__13909,map__13909__$1,doc,save_BANG_))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$files,(function (p__13918,p__13919){
var vec__13920 = p__13918;
var type = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13920,(0),null);
var map__13923 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__13920,(1),null);
var map__13923__$1 = ((((!((map__13923 == null)))?((((map__13923.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13923.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13923):map__13923);
var attrs = map__13923__$1;
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13923__$1,cljs.core.cst$kw$id);
var map__13924 = p__13919;
var map__13924__$1 = ((((!((map__13924 == null)))?((((map__13924.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13924.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13924):map__13924);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13924__$1,cljs.core.cst$kw$doc);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13924__$1,cljs.core.cst$kw$save_BANG_);
return ((function (vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__13927 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__13927) : visible__13676__auto__.call(null,G__13927));
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,cljs.core.cst$kw$file,cljs.core.cst$kw$multiple,true,cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_){
return (function (p1__13917_SHARP_){
var G__13928 = id;
var G__13929 = p1__13917_SHARP_.target.files;
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13928,G__13929) : save_BANG_.call(null,G__13928,G__13929));
});})(visible__13676__auto__,temp__4655__auto__,vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_))
], null),reagent_forms.core.clean_attrs(attrs)], 0))], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,cljs.core.cst$kw$file,cljs.core.cst$kw$multiple,true,cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_){
return (function (p1__13917_SHARP_){
var G__13930 = id;
var G__13931 = p1__13917_SHARP_.target.files;
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13930,G__13931) : save_BANG_.call(null,G__13930,G__13931));
});})(temp__4655__auto__,vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_))
], null),reagent_forms.core.clean_attrs(attrs)], 0))], null);
}
});
;})(vec__13920,type,map__13923,map__13923__$1,attrs,id,map__13924,map__13924__$1,doc,save_BANG_))
}));
reagent_forms.core.group_item = (function reagent_forms$core$group_item(p__13932,p__13933,selections,field,id){
var vec__13965 = p__13932;
var seq__13966 = cljs.core.seq(vec__13965);
var first__13967 = cljs.core.first(seq__13966);
var seq__13966__$1 = cljs.core.next(seq__13966);
var type = first__13967;
var first__13967__$1 = cljs.core.first(seq__13966__$1);
var seq__13966__$2 = cljs.core.next(seq__13966__$1);
var map__13968 = first__13967__$1;
var map__13968__$1 = ((((!((map__13968 == null)))?((((map__13968.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13968.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13968):map__13968);
var attrs = map__13968__$1;
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13968__$1,cljs.core.cst$kw$key);
var touch_event = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13968__$1,cljs.core.cst$kw$touch_DASH_event);
var body = seq__13966__$2;
var map__13969 = p__13933;
var map__13969__$1 = ((((!((map__13969 == null)))?((((map__13969.cljs$lang$protocol_mask$partition0$ & (64))) || (map__13969.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__13969):map__13969);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13969__$1,cljs.core.cst$kw$save_BANG_);
var multi_select = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__13969__$1,cljs.core.cst$kw$multi_DASH_select);
var handle_click_BANG_ = ((function (vec__13965,seq__13966,first__13967,seq__13966__$1,type,first__13967__$1,seq__13966__$2,map__13968,map__13968__$1,attrs,key,touch_event,body,map__13969,map__13969__$1,save_BANG_,multi_select){
return (function reagent_forms$core$group_item_$_handle_click_BANG_(){
if(cljs.core.truth_(multi_select)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(selections,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [key], null),cljs.core.not);

var G__13990 = id;
var G__13991 = cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.first,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.second,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections))));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13990,G__13991) : save_BANG_.call(null,G__13990,G__13991));
} else {
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)),key);
var G__13992_13996 = selections;
var G__13993_13997 = cljs.core.PersistentArrayMap.fromArray([key,cljs.core.not(value)], true, false);
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__13992_13996,G__13993_13997) : cljs.core.reset_BANG_.call(null,G__13992_13996,G__13993_13997));

var G__13994 = id;
var G__13995 = (cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)),key))?key:null);
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__13994,G__13995) : save_BANG_.call(null,G__13994,G__13995));
}
});})(vec__13965,seq__13966,first__13967,seq__13966__$1,type,first__13967__$1,seq__13966__$2,map__13968,map__13968__$1,attrs,key,touch_event,body,map__13969,map__13969__$1,save_BANG_,multi_select))
;
return ((function (vec__13965,seq__13966,first__13967,seq__13966__$1,type,first__13967__$1,seq__13966__$2,map__13968,map__13968__$1,attrs,key,touch_event,body,map__13969,map__13969__$1,save_BANG_,multi_select){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.PersistentArrayMap.fromArray([cljs.core.cst$kw$class,(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selections) : cljs.core.deref.call(null,selections)),key))?"active":null),(function (){var or__6409__auto__ = touch_event;
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return cljs.core.cst$kw$on_DASH_click;
}
})(),handle_click_BANG_], true, false),reagent_forms.core.clean_attrs(attrs)], 0)),body], null);
});
;})(vec__13965,seq__13966,first__13967,seq__13966__$1,type,first__13967__$1,seq__13966__$2,map__13968,map__13968__$1,attrs,key,touch_event,body,map__13969,map__13969__$1,save_BANG_,multi_select))
});
reagent_forms.core.mk_selections = (function reagent_forms$core$mk_selections(id,selectors,p__13998){
var map__14007 = p__13998;
var map__14007__$1 = ((((!((map__14007 == null)))?((((map__14007.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14007.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14007):map__14007);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14007__$1,cljs.core.cst$kw$get);
var multi_select = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14007__$1,cljs.core.cst$kw$multi_DASH_select);
var value = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (value,map__14007,map__14007__$1,get,multi_select){
return (function (m,p__14009){
var vec__14010 = p__14009;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14010,(0),null);
var map__14013 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14010,(1),null);
var map__14013__$1 = ((((!((map__14013 == null)))?((((map__14013.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14013.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14013):map__14013);
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14013__$1,cljs.core.cst$kw$key);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,key,cljs.core.boolean$(cljs.core.some(cljs.core.PersistentHashSet.fromArray([key], true),(cljs.core.truth_(multi_select)?value:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [value], null)))));
});})(value,map__14007,map__14007__$1,get,multi_select))
,cljs.core.PersistentArrayMap.EMPTY,selectors);
});
/**
 * selectors might be passed in inline or as a collection
 */
reagent_forms.core.extract_selectors = (function reagent_forms$core$extract_selectors(selectors){
if((cljs.core.ffirst(selectors) instanceof cljs.core.Keyword)){
return selectors;
} else {
return cljs.core.first(selectors);
}
});
reagent_forms.core.selection_group = (function reagent_forms$core$selection_group(p__14017,p__14018){
var vec__14032 = p__14017;
var seq__14033 = cljs.core.seq(vec__14032);
var first__14034 = cljs.core.first(seq__14033);
var seq__14033__$1 = cljs.core.next(seq__14033);
var type = first__14034;
var first__14034__$1 = cljs.core.first(seq__14033__$1);
var seq__14033__$2 = cljs.core.next(seq__14033__$1);
var map__14035 = first__14034__$1;
var map__14035__$1 = ((((!((map__14035 == null)))?((((map__14035.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14035.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14035):map__14035);
var attrs = map__14035__$1;
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14035__$1,cljs.core.cst$kw$field);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14035__$1,cljs.core.cst$kw$id);
var selection_items = seq__14033__$2;
var map__14036 = p__14018;
var map__14036__$1 = ((((!((map__14036 == null)))?((((map__14036.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14036.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14036):map__14036);
var opts = map__14036__$1;
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14036__$1,cljs.core.cst$kw$get);
var selection_items__$1 = reagent_forms.core.extract_selectors(selection_items);
var selections = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(reagent_forms.core.mk_selections(id,selection_items__$1,opts));
var selectors = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (selection_items__$1,selections,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get){
return (function (item){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$visible_QMARK_,cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(cljs.core.second(item)),cljs.core.cst$kw$selector,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.group_item(item,opts,selections,field,id)], null)], null);
});})(selection_items__$1,selections,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get))
,selection_items__$1);
return ((function (selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get){
return (function (){
if(cljs.core.truth_((get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id)))){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(selections,((function (selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get){
return (function (p1__14015_SHARP_){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get){
return (function (p__14039){
var vec__14040 = p__14039;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14040,(0),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,false], null);
});})(selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get))
,p1__14015_SHARP_));
});})(selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get))
);
}

return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,attrs], null),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$selector,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get){
return (function (p1__14016_SHARP_){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(p1__14016_SHARP_);
if(cljs.core.truth_(temp__4655__auto__)){
var visible_QMARK_ = temp__4655__auto__;
var G__14043 = (function (){var G__14044 = cljs.core.cst$kw$doc.cljs$core$IFn$_invoke$arity$1(opts);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__14044) : cljs.core.deref.call(null,G__14044));
})();
return (visible_QMARK_.cljs$core$IFn$_invoke$arity$1 ? visible_QMARK_.cljs$core$IFn$_invoke$arity$1(G__14043) : visible_QMARK_.call(null,G__14043));
} else {
return true;
}
});})(selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get))
,selectors)));
});
;})(selection_items__$1,selections,selectors,vec__14032,seq__14033,first__14034,seq__14033__$1,type,first__14034__$1,seq__14033__$2,map__14035,map__14035__$1,attrs,field,id,selection_items,map__14036,map__14036__$1,opts,get))
});
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$single_DASH_select,(function (p__14045,p__14046){
var vec__14047 = p__14045;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14047,(0),null);
var attrs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14047,(1),null);
var field = vec__14047;
var map__14050 = p__14046;
var map__14050__$1 = ((((!((map__14050 == null)))?((((map__14050.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14050.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14050):map__14050);
var opts = map__14050__$1;
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14050__$1,cljs.core.cst$kw$doc);
return ((function (vec__14047,_,attrs,field,map__14050,map__14050__$1,opts,doc){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__14052 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__14052) : visible__13676__auto__.call(null,G__14052));
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.selection_group,field,opts], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.selection_group,field,opts], null);
}
});
;})(vec__14047,_,attrs,field,map__14050,map__14050__$1,opts,doc))
}));
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$multi_DASH_select,(function (p__14053,p__14054){
var vec__14055 = p__14053;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14055,(0),null);
var attrs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14055,(1),null);
var field = vec__14055;
var map__14058 = p__14054;
var map__14058__$1 = ((((!((map__14058 == null)))?((((map__14058.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14058.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14058):map__14058);
var opts = map__14058__$1;
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14058__$1,cljs.core.cst$kw$doc);
return ((function (vec__14055,_,attrs,field,map__14058,map__14058__$1,opts,doc){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__14060 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__14060) : visible__13676__auto__.call(null,G__14060));
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.selection_group,field,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(opts,cljs.core.cst$kw$multi_DASH_select,true)], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagent_forms.core.selection_group,field,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(opts,cljs.core.cst$kw$multi_DASH_select,true)], null);
}
});
;})(vec__14055,_,attrs,field,map__14058,map__14058__$1,opts,doc))
}));
reagent_forms.core.map_options = (function reagent_forms$core$map_options(options){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__7189__auto__ = (function reagent_forms$core$map_options_$_iter__14087(s__14088){
return (new cljs.core.LazySeq(null,(function (){
var s__14088__$1 = s__14088;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__14088__$1);
if(temp__4657__auto__){
var s__14088__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(s__14088__$2)){
var c__7187__auto__ = cljs.core.chunk_first(s__14088__$2);
var size__7188__auto__ = cljs.core.count(c__7187__auto__);
var b__14090 = cljs.core.chunk_buffer(size__7188__auto__);
if((function (){var i__14089 = (0);
while(true){
if((i__14089 < size__7188__auto__)){
var vec__14103 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7187__auto__,i__14089);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14103,(0),null);
var map__14106 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14103,(1),null);
var map__14106__$1 = ((((!((map__14106 == null)))?((((map__14106.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14106.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14106):map__14106);
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14106__$1,cljs.core.cst$kw$key);
var label = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14103,(2),null);
cljs.core.chunk_append(b__14090,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [[cljs.core.str(label)].join(''),key], null));

var G__14113 = (i__14089 + (1));
i__14089 = G__14113;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__14090),reagent_forms$core$map_options_$_iter__14087(cljs.core.chunk_rest(s__14088__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__14090),null);
}
} else {
var vec__14108 = cljs.core.first(s__14088__$2);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14108,(0),null);
var map__14111 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14108,(1),null);
var map__14111__$1 = ((((!((map__14111 == null)))?((((map__14111.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14111.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14111):map__14111);
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14111__$1,cljs.core.cst$kw$key);
var label = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__14108,(2),null);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [[cljs.core.str(label)].join(''),key], null),reagent_forms$core$map_options_$_iter__14087(cljs.core.rest(s__14088__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__7189__auto__(options);
})());
});
reagent_forms.core.default_selection = (function reagent_forms$core$default_selection(options,v){
return cljs.core.last(cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__14114_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(p1__14114_SHARP_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),cljs.core.cst$kw$key], null)));
}),options)));
});
reagent_forms.core.init_field.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$list,(function (p__14117,p__14118){
var vec__14119 = p__14117;
var seq__14120 = cljs.core.seq(vec__14119);
var first__14121 = cljs.core.first(seq__14120);
var seq__14120__$1 = cljs.core.next(seq__14120);
var type = first__14121;
var first__14121__$1 = cljs.core.first(seq__14120__$1);
var seq__14120__$2 = cljs.core.next(seq__14120__$1);
var map__14122 = first__14121__$1;
var map__14122__$1 = ((((!((map__14122 == null)))?((((map__14122.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14122.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14122):map__14122);
var attrs = map__14122__$1;
var field = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14122__$1,cljs.core.cst$kw$field);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14122__$1,cljs.core.cst$kw$id);
var options = seq__14120__$2;
var map__14123 = p__14118;
var map__14123__$1 = ((((!((map__14123 == null)))?((((map__14123.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14123.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14123):map__14123);
var doc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14123__$1,cljs.core.cst$kw$doc);
var get = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14123__$1,cljs.core.cst$kw$get);
var save_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14123__$1,cljs.core.cst$kw$save_BANG_);
var options__$1 = reagent_forms.core.extract_selectors(options);
var options_lookup = reagent_forms.core.map_options(options__$1);
var selection = reagent.core.atom.cljs$core$IFn$_invoke$arity$1((function (){var or__6409__auto__ = (get.cljs$core$IFn$_invoke$arity$1 ? get.cljs$core$IFn$_invoke$arity$1(id) : get.call(null,id));
if(cljs.core.truth_(or__6409__auto__)){
return or__6409__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.first(options__$1),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),cljs.core.cst$kw$key], null));
}
})());
var G__14126_14135 = id;
var G__14127_14136 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selection) : cljs.core.deref.call(null,selection));
(save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__14126_14135,G__14127_14136) : save_BANG_.call(null,G__14126_14135,G__14127_14136));

return ((function (options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_){
return (function (){
var temp__4655__auto__ = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(attrs);
if(cljs.core.truth_(temp__4655__auto__)){
var visible__13676__auto__ = temp__4655__auto__;
if(cljs.core.truth_((function (){var G__14128 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible__13676__auto__.cljs$core$IFn$_invoke$arity$1 ? visible__13676__auto__.cljs$core$IFn$_invoke$arity$1(G__14128) : visible__13676__auto__.call(null,G__14128));
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([reagent_forms.core.clean_attrs(attrs),new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$default_DASH_value,reagent_forms.core.default_selection(options__$1,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selection) : cljs.core.deref.call(null,selection))),cljs.core.cst$kw$on_DASH_change,((function (visible__13676__auto__,temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_){
return (function (p1__14115_SHARP_){
var G__14129 = id;
var G__14130 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options_lookup,reagent_forms.core.value_of(p1__14115_SHARP_));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__14129,G__14130) : save_BANG_.call(null,G__14129,G__14130));
});})(visible__13676__auto__,temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_))
], null)], 0)),cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (visible__13676__auto__,temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_){
return (function (p1__14116_SHARP_){
var temp__4655__auto____$1 = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(cljs.core.second(p1__14116_SHARP_));
if(cljs.core.truth_(temp__4655__auto____$1)){
var visible_QMARK_ = temp__4655__auto____$1;
var G__14131 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible_QMARK_.cljs$core$IFn$_invoke$arity$1 ? visible_QMARK_.cljs$core$IFn$_invoke$arity$1(G__14131) : visible_QMARK_.call(null,G__14131));
} else {
return true;
}
});})(visible__13676__auto__,temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_))
,options__$1))], null);
} else {
return null;
}
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [type,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([reagent_forms.core.clean_attrs(attrs),new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$default_DASH_value,reagent_forms.core.default_selection(options__$1,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(selection) : cljs.core.deref.call(null,selection))),cljs.core.cst$kw$on_DASH_change,((function (temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_){
return (function (p1__14115_SHARP_){
var G__14132 = id;
var G__14133 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options_lookup,reagent_forms.core.value_of(p1__14115_SHARP_));
return (save_BANG_.cljs$core$IFn$_invoke$arity$2 ? save_BANG_.cljs$core$IFn$_invoke$arity$2(G__14132,G__14133) : save_BANG_.call(null,G__14132,G__14133));
});})(temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_))
], null)], 0)),cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_){
return (function (p1__14116_SHARP_){
var temp__4655__auto____$1 = cljs.core.cst$kw$visible_QMARK_.cljs$core$IFn$_invoke$arity$1(cljs.core.second(p1__14116_SHARP_));
if(cljs.core.truth_(temp__4655__auto____$1)){
var visible_QMARK_ = temp__4655__auto____$1;
var G__14134 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc));
return (visible_QMARK_.cljs$core$IFn$_invoke$arity$1 ? visible_QMARK_.cljs$core$IFn$_invoke$arity$1(G__14134) : visible_QMARK_.call(null,G__14134));
} else {
return true;
}
});})(temp__4655__auto__,options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_))
,options__$1))], null);
}
});
;})(options__$1,options_lookup,selection,vec__14119,seq__14120,first__14121,seq__14120__$1,type,first__14121__$1,seq__14120__$2,map__14122,map__14122__$1,attrs,field,id,options,map__14123,map__14123__$1,doc,get,save_BANG_))
}));
reagent_forms.core.field_QMARK_ = (function reagent_forms$core$field_QMARK_(node){
return (cljs.core.coll_QMARK_(node)) && (cljs.core.map_QMARK_(cljs.core.second(node))) && (cljs.core.contains_QMARK_(cljs.core.second(node),cljs.core.cst$kw$field));
});
/**
 * creates data bindings between the form fields and the supplied atom
 * form - the form template with the fields
 * doc - the document that the fields will be bound to
 * events - any events that should be triggered when the document state changes
 */
reagent_forms.core.bind_fields = (function reagent_forms$core$bind_fields(var_args){
var args__7491__auto__ = [];
var len__7484__auto___14141 = arguments.length;
var i__7485__auto___14142 = (0);
while(true){
if((i__7485__auto___14142 < len__7484__auto___14141)){
args__7491__auto__.push((arguments[i__7485__auto___14142]));

var G__14143 = (i__7485__auto___14142 + (1));
i__7485__auto___14142 = G__14143;
continue;
} else {
}
break;
}

var argseq__7492__auto__ = ((((2) < args__7491__auto__.length))?(new cljs.core.IndexedSeq(args__7491__auto__.slice((2)),(0),null)):null);
return reagent_forms.core.bind_fields.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7492__auto__);
});

reagent_forms.core.bind_fields.cljs$core$IFn$_invoke$arity$variadic = (function (form,doc,events){
var opts = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$doc,doc,cljs.core.cst$kw$get,(function (p1__14137_SHARP_){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(doc) : cljs.core.deref.call(null,doc)),(reagent_forms.core.id__GT_path.cljs$core$IFn$_invoke$arity$1 ? reagent_forms.core.id__GT_path.cljs$core$IFn$_invoke$arity$1(p1__14137_SHARP_) : reagent_forms.core.id__GT_path.call(null,p1__14137_SHARP_)));
}),cljs.core.cst$kw$save_BANG_,reagent_forms.core.mk_save_fn(doc,events)], null);
var form__$1 = clojure.walk.postwalk(((function (opts){
return (function (node){
if(cljs.core.truth_(reagent_forms.core.field_QMARK_(node))){
var opts__$1 = reagent_forms.core.wrap_fns(opts,node);
var field = (reagent_forms.core.init_field.cljs$core$IFn$_invoke$arity$2 ? reagent_forms.core.init_field.cljs$core$IFn$_invoke$arity$2(node,opts__$1) : reagent_forms.core.init_field.call(null,node,opts__$1));
if(cljs.core.fn_QMARK_(field)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [field], null);
} else {
return field;
}
} else {
return node;
}
});})(opts))
,form);
return ((function (opts,form__$1){
return (function (){
return form__$1;
});
;})(opts,form__$1))
});

reagent_forms.core.bind_fields.cljs$lang$maxFixedArity = (2);

reagent_forms.core.bind_fields.cljs$lang$applyTo = (function (seq14138){
var G__14139 = cljs.core.first(seq14138);
var seq14138__$1 = cljs.core.next(seq14138);
var G__14140 = cljs.core.first(seq14138__$1);
var seq14138__$2 = cljs.core.next(seq14138__$1);
return reagent_forms.core.bind_fields.cljs$core$IFn$_invoke$arity$variadic(G__14139,G__14140,seq14138__$2);
});

