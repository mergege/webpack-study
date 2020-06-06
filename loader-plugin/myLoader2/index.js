module.exports = function(source, sourceMap, ast) {
  const result = source.replace('kkb', 'hahahahaha')
  console.log(result)
  // 1、一定要有返回值
  return result
}
