const path = require("path");

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
      port: 8000,
      contentBase: path.resolve(__dirname, "public")
    }
  };
};
