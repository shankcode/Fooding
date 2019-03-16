// Custom ServiceWorker to overwrite Create-React-App default serviceWorker
module.exports = {
  staticFileGlobs: [
    "build/static/css/**.css",
    "build/static/js/**.js",
    "build/static/media/**.*",
    "build/manifest.json",
    "build/asset-manifest.json",
    "build/index.html",
    "build/**.png"
  ],
  swFilePath: "./build/service-worker.js",
  templateFilePath: "./service-worker.tmpl",
  stripPrefix: "build/",
  navigateFallback: "/index.html",
  navigateFallbackWhitelist: [/\/#section2/],
  ignoreUrlParametersMatching: [/./],
  importScripts: ["push-listener.js"],
  verbose: true
};
