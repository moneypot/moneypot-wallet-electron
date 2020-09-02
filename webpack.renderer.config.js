const rules = require('./webpack.rules');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

rules.push({
  test: /\.(s*)css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, {loader: 'sass-loader'}]
});


module.exports = {
 // Put your normal webpack config below here
  mode: 'production',
  module: {
    rules,
  },
  plugins: [new ForkTsCheckerWebpackPlugin, ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
    },
    
};