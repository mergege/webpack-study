module.exports = function(source, sourceMap, ast) {
  // console.log(this.query, source)
  // const result = source.replace('hello', this.query.name)
  // console.log(result)
  // 1、一定要有返回值
  // return result
  // 2、也可以用this.callBack返回
  // this.callback(null, result)
  // 3、如果有异步，用this.async
  const callback = this.async()
  setTimeout(() => {
    console.log(this.query, source)
    const result = source.replace('hello', this.query.name)
    console.log(result)
    callback(null, result)
  }, 3000)
}
