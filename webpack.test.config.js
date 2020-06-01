const devConfig = require('./webpack.config.dev.js')
const proConfig = require('./webpack.config.pro.js')
const baseConfig = require('./webpack.config.base.js')
const merge = require('webpack-merge')

console.log(process.env.NODE_ENV)
module.exports = (env) => {
  console.log(env)
  if (env && env.production) {
    return merge(baseConfig, proConfig)
  } else {
    return merge(baseConfig, devConfig)
  }
}