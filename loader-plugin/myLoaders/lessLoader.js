const less = require('less')

module.exports = function(source) {
  console.log(source)
  less.render(source, (err, output) => {
    console.log(output.css)
    this.callback(err, output.css)
  })
}
