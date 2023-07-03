const webpack = require("webpack");
const webpackResolve = require("craco-webpack-resolve");

module.exports = {
  plugins: [
    {
      plugin: require("craco-plugin-scoped-css"),
    },
    {
      plugin: webpackResolve,
      options: {
        resolve: {
          fallback: {
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            buffer: require.resolve("buffer"),
            stream: require.resolve("stream-browserify"),
            fs: false,
          },
        },
      },
    },
  ],
};
