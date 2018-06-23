var path = require("path");

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, "source", "entry.jsx"),
    test: path.resolve(__dirname, "test", "test.js")
  },
  output: {
    path: path.join(__dirname, "release"),
    publicPath: "/",
    filename: "[name].js"
  },
  devServer: {
    contentBase: path.join(__dirname, "release")
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS
        ]
      },
      {
        test: /\.html/,
        use: ["file-loader"]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /test\/test\.js?$/,
        exclude: /node_modules/,
        use: ["mocha-loader"]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "source"),
      path.resolve(__dirname, "test"),
      "node_modules"
    ],
    extensions: [
      ".js", ".json", ".jsx", ".min.js"
    ]
  }
};
