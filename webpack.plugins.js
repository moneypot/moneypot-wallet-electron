const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin({
    async: false
  }),
    new CopyPlugin([
      { from: './static', to: './static' },
    
    ]),
];
