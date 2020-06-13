module.exports = [
  {
    test: /\.node$/,
    use: "node-loader"
  },
  {
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: {
      loader: "file-loader",
      options: {
        outputPath: "fonts",
        publicPath: "../fonts"

      },
    },
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules"
      }
    }
  },
  {
    test: /\.(tsx?|ts)$/,
    exclude: /(node_modules|.webpack)/,
    loaders: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      }
    ]
  }
];


