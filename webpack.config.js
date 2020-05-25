// webpack 是基于nodeJS的
// webpack配置 就是一个对象
// 1 chunk(代码块) = 1bundle(生产的资源文件)

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  // 上下文：项目打包的相对路径，很少改 必须是绝对路径
  // context: process.cwd(),默认值
  // 入口 执行构建的入口 项目入口
  // 支持3中类型：字符串 数组 对象
  entry: './src/index.js',
  // entry: ['./src/index.js', './src/other.js'],
  // entry: {
  //   index: './src/index.js',
  //   other: './src/other.js'
  // },
  // 出口
  output: {
    // 构建的文件资源放在哪？必须是绝对路径
    path: path.resolve(__dirname, './dist'),
    // 构建的文件资源叫啥 无论是多出口还是单出口 都推荐使用占位符
    // filename: 'main.js'
    filename: '[name].js'
    // filename: '[name]-[chunkhash:6].js'

    // 占位符
    // hash 整个项目的hash值，每构建一次，就会有一个新的hash值
    // chunkhash 根据不同入口entry进行依赖解析，构建对应的chunkhash,只要组成entry的模块没有内容改动，则对应的hash不变
    // name
  },
  // 构建模式
  // none：默认production
  // production：用各种插件处理，压缩
  // development：不用插件压缩
  mode: 'development',
  // 处理 不认识的 模块,webpack默认只认识.js和.json
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader 模块转换 模块处理
        // use: {
        //   // loader: '' // 单独一个loader
        // }
        // 如果多个用数组的形式:执行顺序是从左往右
        // css-loader:言简意赅是把css模块的内容 加入到 js模块中去
        // css in js方式

        // style-loader 从js中提取css的loader 在html中创建style标签
        // post-loader:配合autoprefixer自动加css前缀
        use: ['style-loader', 'css-loader', 'postcss-loader']
        // HMR热模块替换不支持css抽离,只支持style-loader
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  // 插件
  plugins: [new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: '首页',
    template: path.resolve(__dirname, './src/index.html'),
    outputPath: path.resolve(__dirname, './dist')
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name].css'
  }),
  new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    hot: true,
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
  }
}