const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: "./lib/abi",
  output: {
    filename: "jcc-ethereum-abi.min.js",
    path: path.resolve(__dirname, "./dist"),
    library: "jcc_ethereum_abi",
    libraryTarget: "umd",
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
      inherits: path.resolve(__dirname, "node_modules/inherits"),
      utf8: path.resolve(__dirname, "node_modules/utf8"),
    },
  },
  mode: process.env.MODE === "dev" ? "development" : "production",
  node: {
    fs: "empty",
    tls: "empty",
    child_process: "empty",
    net: "empty",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(cjs|mjs|js|jsx)$/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new DuplicatePackageCheckerPlugin()],
};

if (process.env.REPORT === "true") {
  config.plugins.push(new BundleAnalyzerPlugin());
}

if (process.env.MODE !== "dev") {
  config.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          sequences: true,
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
          unused: true,
        },
      },
      sourceMap: false,
      parallel: true,
    })
  );
  // config.plugins.push(new TerserPlugin({
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //     output: {
  //       comments: false, // 移除注释
  //     },
  //   },
  //   parallel: true, // 启用多线程压缩
  // }));
}

module.exports = config;
