const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  },
  module: [
    {
      test: /\.js/,
      use: path.resolve(__dirname, './loader-plugin/myloader/index.js')
    }
  ]
}
