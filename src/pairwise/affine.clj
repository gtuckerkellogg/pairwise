(ns pairwise.affine
  (:require   [pairwise.substitution :refer :all]))


(defn initialise-D
  "the initial dynamic programming matrix"
  [n m] (let [D (vec (repeat
                      (inc n) (vec (repeat (inc m) {
                                                    :V'M nil
                                                    :V'X nil
                                                    :V'Y nil}))))]
                                                    
          (assoc-in D [0 0 :V'M] 0)))

(defn score-M "
  This is the V^M recurrence relationship in equation 7.8 on the top of p 183 of Durbin et al 
  i,j ranges from 0,0 to n,m for two sequences of length n,m
  "
  [D S s1 s2 i j]
  (let [x_i (get (vec (seq s1)) (dec i)) 
        y_j (get (vec (seq s2)) (dec j))
        s (S [x_i y_j])]
    (if  (and (zero? i) (zero? j))
      0
      (when-not (nil? s)
        (print "got here")
        (+ (first (min  (remove nil? 
                              [(get-in D [(max 0 (dec i)) (max 0 (dec j)) :V'M])
                               (get-in D [(max 0 (dec i)) (max 0 (dec j)) :V'X])
                               (get-in D [(max 0 (dec i)) (max 0 (dec j)) :V'Y])]))))))))
                        
           

 

 
 

(defn score-X "
  This is the V^X recurrence relationship in equation 7.8 on the top of p 183 of Durbin et al
"
  [D d e i j]
  (when-not (and (zero? i) (zero? j)))
  (let [i' (max 0 (dec i))]
      (first (min (remove nil?
                      [(when-not (nil? (get-in D [i' j :V'M]))
                         (- (get-in D [i' j :V'M]) d))
                       (when-not (nil? (get-in D [i' j :V'X]))
                         (- (get-in D [i' j :V'X]) e))])))))
    

(defn score-Y "
  This is the V^Y recurrence relationship in equation 7.8 on the top of p 183 of Durbin et al
"
  [D d e i j]
  (when-not (and (zero? i) (zero? j))
    (let [j' (max 0 (dec j))]
      (first (min (remove nil?
                      [(when-not (nil? (get-in D [i j' :V'M]))
                         (- (get-in D [i j' :V'M]) d))
                       (when-not (nil? (get-in D [i j' :V'Y]))
                         (- (get-in D [i j' :V'Y]) e))]))))))
    


(defn score-one
  "build the scores for a single cell"
  [D S d e s1 s2 i j]
  (assoc-in D [i j]
              {:V'M (score-M D S s1 s2 i j)
               :V'X (score-X D d e i j)
               :V'Y (score-Y D d e i j)}))





