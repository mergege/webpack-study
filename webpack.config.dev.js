// 测试配置

const path = require('path')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const baseConfig = require("./webpack.config.base.js")
const devConfig = {
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8083,
    hot: true,
    // 即使HMR没生效，浏览器也不要自动刷新
    hotOnly: true,
    proxy: {
      'api': {
        target: 'http://localhost:9092/'
      }
    },
    before (app, server) {
      app.get('/api/mock.json', (req, res) => {
        res.json({
          'hello': 'express'
        })
      })
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
    ]
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      title: '首页',
      template: path.resolve(__dirname, './src/index.html'),
      outputPath: path.resolve(__dirname, './dist')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}


module.exports = merge(baseConfig, devConfig)