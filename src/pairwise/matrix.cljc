(ns pairwise.matrix)

(defn matrix-dimensions
  "Returns [rows cols] dimensions of a DP matrix."
  [dp-matrix]
  [(count dp-matrix) (count (first dp-matrix))])

(defn cell-coordinates
  "Returns sequence of [row col] pairs for all cells in a DP matrix."
  [dp-matrix]
  (let [[rows cols] (matrix-dimensions dp-matrix)]
    (for [c (range cols) r (range rows)] [r c])))

(defn direction-between
  "Returns the direction (:diag, :horiz, :vert) between two [r c] coordinates."
  [[r1 c1] [r2 c2]]
  (cond
    (= r1 r2) :horiz
    (= c1 c2) :vert
    :else      :diag))
