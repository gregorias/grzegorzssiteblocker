const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "src", "background.js"),
    options: path.resolve(__dirname, "src", "options.jsx"),
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.m?tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /tests/, /playwright\.config\.ts/],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
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
  // This is a Chrome extension, where thee content is loaded from the local
  // machine. We don’t need to worry about file sizes as much. 4 MB is
  // reasonable.
  performance: {
    maxAssetSize: 4_000_000,
    maxEntrypointSize: 4_000_000,
  },
};
