(defproject pairwise "0.1.0-SNAPSHOT"
  :description "Pairwise alignment using Smith-Waterman and Needleman Wunsch and a linear gap penalty"
  :url "https://github.com/gtuckerkellogg/pairwise"
  :license {:name "MIT"
            :url  "https://opensource.org/licenses/MIT"}
  :profiles {
             :dev {:dependencies [[org.clojure/test.check "0.10.0"]]}
             }
  :dependencies [
                 [org.clojure/clojure "1.10.1"]
                 ;; for the clojurescript app
                 [org.clojure/clojurescript "1.10.520"]
                 [org.clojure/tools.cli "1.1.230"]
                 ;; is this really needed? 
                 [org.clojure/core.async  "0.4.500"
                  :exclusions [org.clojure/tools.reader]]
                 ; is this needed
                 [cljsjs/bootstrap "3.4.1-0"]
                 [binaryage/devtools "0.9.10"]
                 [hiccup "1.0.5"]
                 [reagent "0.8.1"]
                 [selmer "1.12.14"]
                 [reagent-forms "0.5.43"]]

  :plugins [[lein-figwheel "0.5.16"]
            [lein-cljsbuild "1.1.7" :exclusions [[org.clojure/clojure]]]]

  :source-paths ["src"]

  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]

  :cljsbuild {:builds
              [{:id           "dev"
                :source-paths ["src"]

                ;; the presence of a :figwheel configuration here
                ;; will cause figwheel to inject the figwheel client
                ;; into your build
                :figwheel {:on-jsload "pairwise.webapp/on-js-reload"
                           ;; :open-urls will pop open your application
                           ;; in the default browser once Figwheel has
                           ;; started and complied your application.
                           ;; Comment this out once it no longer serves you.
                           :open-urls ["http://localhost:3449/index.html"]}

                :compiler {:main                 pairwise.webapp
                           :asset-path           "js/compiled/out"
                           :output-to            "resources/public/js/compiled/pairwise.js"
                           :output-dir           "resources/public/js/compiled/out"
                           :source-map-timestamp true
                           ;; To console.log CLJS data-structures make sure you enable devtools in Chrome
                           ;; https://github.com/binaryage/cljs-devtools
                           :preloads             [devtools.preload]
                           }}
               ;; This next build is an compressed minified build for
               ;; production. You can build this with:
               ;; lein cljsbuild once min
               {:id           "min"
                :source-paths ["src"]
                :compiler     {:output-to     "resources/public/js/compiled/pairwise.js"
                               :main          pairwise.webapp
                               :optimizations :advanced
                               :pretty-print  false}}
               {:id           "demo"
                :source-paths ["src"]
                :compiler     {:output-to     "demo/js/compiled/pairwise.js"
                               :output-dir    "demo/js/compiled/out"
                               :main          pairwise.webapp
                               :optimizations :advanced
                               :pretty-print  false}}

               ]
              }
  :figwheel {;; :http-server-root "public" ;; default and assumes "resources"
             ;; :server-port 3449 ;; default
             ;; :server-ip "127.0.0.1"

             :css-dirs ["resources/public/css"] ;; watch and update CSS

             ;; Start an nREPL server into the running figwheel process
             ;; :nrepl-port 7888

             ;; Server Ring Handler (optional)
             ;; if you want to embed a ring handler into the figwheel http-kit
             ;; server, this is for simple ring servers, if this

             ;; doesn't work for you just run your own server :) (see lein-ring)

             ;; :ring-handler hello_world.server/handler

             ;; To be able to open files in your editor from the heads up display
             ;; you will need to put a script on your path.
             ;; that script will have to take a file path and a line number
             ;; ie. in  ~/bin/myfile-opener
             ;; #! /bin/sh
             ;; emacsclient -n +$2 $1
             ;;
             ;; :open-file-command "myfile-opener"

             ;; if you are using emacsclient you can just use
             ;; :open-file-command "emacsclient"

             ;; if you want to disable the REPL
             ;; :repl false

             ;; to configure a different figwheel logfile path
             ;; :server-logfile "tmp/logs/figwheel-logfile.log"
             }

  

  )
