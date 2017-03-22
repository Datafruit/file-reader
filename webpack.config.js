/**
 * Created by coin on 20/12/2016.
 */

const path = require('path')

module.exports = {
  
  entry: {
    
    'test': './test/test.js',
    'file': './test/observer/file-reader',
    'read-line-binary': './test/observer/read-line-binary',
    'read-line-string': './test/observer/read-line-string',
    'read-csv': './test/observer/read-csv',
    'read-csv-with-lines': './test/observer/read-csv-with-lines'
  },
  
  cache: true,
  
  output: {
    path: path.join(process.cwd(), 'test/dist/observer'),
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