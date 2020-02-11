const path       = require("path");
const se         = require("play-sound")(opts = {});
const LiveReload = require("webpack-livereload-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  
  return {
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [
        ".js",
        ".ts"
      ],
      modules: [
        "src",
        "node_modules"
      ]
    },
    entry: path.resolve(__dirname, "src/main.ts"),
    output: {
      path: path.resolve(__dirname, "public/js"),
      filename: isProd ? "main.min.js" : "main.js"
    },
    devServer: {
      host: "0.0.0.0",
      port: 8080,
      hot: true,
      contentBase: path.resolve(__dirname, "public")
    },
    plugins: [
      new LiveReload(),
      function () {
        this.hooks.afterEmit.tap("watch-run", function (watching, callback) {
          se.play("/System/Library/Sounds/Purr.aiff");
        })
      }
    ]
  };
};
