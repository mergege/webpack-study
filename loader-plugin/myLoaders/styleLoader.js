module.exports = function(source) {
  console.log(source)
  const result = `const ele = document.createElement("style")
    ele.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(ele)
  `
  this.callback(null, result)
}
