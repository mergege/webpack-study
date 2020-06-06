// webpack 是基于nodeJS的
// webpack配置 就是一个对象
// 1 chunk(代码块) = 1bundle(生产的资源文件)

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurifyCss = require('purify-css')
const glob = require('glob-all')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// 检测打包时间
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin()

const webpack = require('webpack')
const config = {
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
    // 会自动在构建出来的今天文件引入路径上加上，注意需要把静态文件上传到cdn服务器
    // publicPath: "http://cdn.kaikeba.com/assets/"
  },
  // 构建模式
  // none：默认production
  // production：用各种插件处理，压缩
  // development：不用插件压缩
  mode: 'development',
  // 优化相关
  // 查找优化
  resolve: {
    // 查找第三方依赖
    modules: [path.resolve(__dirname, './node_modules')],
    // 起别名
    // 减少查找过程
    alias: {
      '@': path.resolve(__dirname, './src/css')
      // "react": "./node_modules/react/umd/react.production.min.js",
      // "react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js"
    },
    // 不要滥用extensions,尽量写后缀
    extensions: ['.js', '.json', '.jsx']
  },
  // webpack不会再打包import依赖文件
  externals: {
    // jquery通过script在html模板中引入，全局就有了jquery变了，配置了这里就可以用import引入，否则不行
    // "jquery": "jQuery"
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8083,
    hot: true,
    // 即使HMR没生效，浏览器也不要自动刷新
    hotOnly: true,
    proxy: {
      api: {
        target: 'http://localhost:9092/'
      }
    },
    before(app, server) {
      app.get('/api/mock.json', (req, res) => {
        res.json({
          hello: 'express'
        })
      })
    }
  },
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
        include: path.resolve(__dirname, './src'),
        // use: ['style-loader', 'css-loader', 'postcss-loader']
        // HMR热模块替换不支持css抽离,只支持style-loader
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
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
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]',
            limit: 5 * 1024
          }
        }
      }
    ]
  },
  optimization: {
    usedExports: true, // js摇树
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        lodash: {
          test: /lodash/,
          name: 'lodash'
        },
        react: {
          test: /react|react-dom/,
          name: 'react'
        }
      }
    }, // 代码打包分割
    concatenateModules: true // 作用域提示
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '首页',
      template: path.resolve(__dirname, './src/index.html'),
      outputPath: path.resolve(__dirname, './dist'),
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCsSS: true // 压缩内联css
      }
    }),
    // 单独生成css文件，抽离：需要用MiniCssExtractPlugin.loader替换css-loader配合使用
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'), // 安装postcss-loader已经依赖下载了
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      }
    }),
    new HardSourceWebpackPlugin()
    // css摇树，去掉无用的css代码
    // new PurifyCss({
    //   paths: glob.sync([
    //     path.resolve(__dirname, "./src/*.html"),
    //     path.resolve(__dirname, "./src/*.js")
    //   ])
    // })
  ]
}

// module.exports = smp.wrap(config)
module.exports = config
