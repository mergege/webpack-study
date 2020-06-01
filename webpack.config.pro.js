// 生成配置

const path = require('path')
const merge = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurifyCss = require('purify-css')
const glob = require("glob-all")

const baseConfig = require('./webpack.config.base.js')

const proConfig = {
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '首页',
      template: path.resolve(__dirname, './src/index.html'),
      outputPath: path.resolve(__dirname, './dist'),
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCsSS: true // 压缩内联css
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"), // 安装postcss-loader已经依赖下载了
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      }
    }),
    // css摇树
    new PurifyCss({
      paths: glob.sync([
        path.resolve(__dirname, "./src/*.js"),
        path.resolve(__dirname, "./src/*.html")
      ])
    })
  ]
}

module.exports = merge(baseConfig, proConfig)