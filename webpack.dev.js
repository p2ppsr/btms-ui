const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    open: true,
    port: 8088, // you can change the port
    client: {
      overlay: true // Show application errors
    },
    historyApiFallback: {
      index: 'index.html'
    },
    static: './public'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ],
  },
  devtool: 'inline-source-map'
})
