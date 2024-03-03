const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    background: path.resolve(__dirname, "src", "background.js"),
    options: path.resolve(__dirname, "src", "options.js"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
