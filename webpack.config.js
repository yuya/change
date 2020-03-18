const path        = require("path");
const se          = require("play-sound")(opts = {});
const HtmlWebpack = require("html-webpack-plugin");
const LiveReload  = require("webpack-livereload-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  
  return {
    mode: argv.mode,
    entry: path.resolve(__dirname, "src/typescript/main.ts"),
    output: {
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
      filename: isProd ? "main.min.js?[hash]" : "main.js?[hash]"
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /(node_modules|misc)/
        },
        {
          test: /\.pug$/,
          use: "pug-loader"
        }
      ]
    },
    resolve: {
      extensions: [
        ".js",
        ".ts"
      ],
      modules: [
        "src/typescript",
        "node_modules"
      ]
    },
    devServer: {
      host: "0.0.0.0",
      port: 8080,
      hot: true,
      contentBase: path.resolve(__dirname, "public")
    },
    plugins: [
      new HtmlWebpack({
        template: path.resolve(__dirname, "src/pug/index.pug")
      }),
      new LiveReload(),
      function () {
        this.hooks.afterEmit.tap("watch-run", function (watching, callback) {
          se.play("/System/Library/Sounds/Purr.aiff");
        })
      }
    ]
  };
};
