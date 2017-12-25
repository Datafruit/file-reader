/**
 * Created by coin on 20/12/2016.
 */

const path = require('path')

module.exports = {

  entry: {
    'file': './__tests__/observer/file-reader',
    'read-line-binary': './__tests__/observer/read-line-binary',
    'read-line-string': './__tests__/observer/read-line-string',
    'read-csv': './__tests__/observer/read-csv',
    'read-csv-with-lines': './__tests__/observer/read-csv-with-lines'
  },

  cache: true,

  output: {
    path: path.join(process.cwd(), '__tests__/dist/observer'),
    publicPath: '/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['es2015', 'stage-0'] }
      }
    ]
  },

  devtool: 'eval-source-map'
};