

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  resolve: {
    modules: [path.resolve(__dirname, "./node_modules")],
    alias: {
      "@": path.resolve(__dirname, './src/css'),
      "react": "./node_modules/react/umd/react.production.min.js",
      "react-dom": "./node_modules/react/umd/react-dom.production.min.js"
    },
    extensions: ['.js', '.json', '.jsx']
  },
  externals: {
    "jquery": "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, './src'),
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.resolve(__dirname, './src'),
        // use: ["file-loader"]
        // 一般文件资源用url-loader代替,优化，小于limit的图片会被编译成base64
        use: {
          loader: "url-loader",
          options: {
            name: 'images/[name].[ext]',
            limit: 5 * 1024
          }
        }
      }
    ]
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin()
  ]
}