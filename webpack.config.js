const path = require("path");
const se   = require("play-sound")(opts = {});

module.exports = (mode = "development", argv) => {
  const isDev = (mode === "development");

  return {
    mode: mode,
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
        "node_modules"
      ]
    },
    entry: path.resolve(__dirname, "src/main.ts"),
    output: {
      path: path.resolve(__dirname, "public/js"),
      filename: isDev ? "main.js" : "main.min.js"
    },
    devServer: {
      host: "0.0.0.0",
      port: 8080,
      hot: true,
      contentBase: path.resolve(__dirname, "public")
    },
    plugins: [
      function () {
        this.hooks.afterEmit.tap("watch-run", function (watching, callback) {
          se.play("/System/Library/Sounds/Purr.aiff");
        })
      }
    ]
  };
};
