(ns build
  (:require [clojure.tools.build.api :as b]
            [clojure.java.io :as io])
  (:import [java.nio.file Files]
           [java.nio.file.attribute PosixFilePermissions]))

(def lib 'pairwise/pairwise)
(def version "0.1.0")
(def class-dir "target/classes")
(def basis (b/create-basis {:project "deps.edn"}))
(def uber-file (format "target/%s-%s-standalone.jar" (name lib) version))
(def jar-file (format "target/%s-%s.jar" (name lib) version))

(defn clean [_]
  (b/delete {:path "target"}))

(defn jar [_]
  (clean nil)
  (b/write-pom {:class-dir class-dir
                :lib lib
                :version version
                :basis basis
                :src-dirs ["src"]})
  (b/copy-dir {:src-dirs ["src" "resources"]
               :target-dir class-dir})
  (b/jar {:class-dir class-dir
          :jar-file jar-file}))

(defn uber [_]
  (clean nil)
  (b/copy-dir {:src-dirs ["src" "resources"]
               :target-dir class-dir})
  (b/compile-clj {:basis basis
                  :ns-compile '[pairwise.main]
                  :class-dir class-dir})
  (b/uber {:class-dir class-dir
           :uber-file uber-file
           :basis basis
           :main 'pairwise.main}))

(defn install
  "Install pairwise CLI to ~/bin"
  [_]
  (uber nil)
  (let [home     (System/getProperty "user.home")
        bin-dir  (io/file home "bin")
        jar-dest (io/file bin-dir "pairwise.jar")
        wrapper  (io/file bin-dir "pairwise")]
    (.mkdirs bin-dir)
    (io/copy (io/file uber-file) jar-dest)
    (spit wrapper (str "#!/usr/bin/env bash\n"
                       "exec java -jar \"" (.getAbsolutePath jar-dest) "\" \"$@\"\n"))
    (Files/setPosixFilePermissions (.toPath wrapper)
                                   (PosixFilePermissions/fromString "rwxr-xr-x"))
    (println "Installed to" (.getAbsolutePath bin-dir))
    (println "  " (.getAbsolutePath jar-dest))
    (println "  " (.getAbsolutePath wrapper))
    (let [path (System/getenv "PATH")]
      (when-not (some #(= (.getAbsolutePath bin-dir) %)
                      (clojure.string/split path (re-pattern (System/getProperty "path.separator"))))
        (println)
        (println "NOTE:" (.getAbsolutePath bin-dir) "is not on your PATH.")
        (println "Add this to your shell profile:")
        (println (str "  export PATH=\"" (.getAbsolutePath bin-dir) ":$PATH\""))))))
