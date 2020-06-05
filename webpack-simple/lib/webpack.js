const fs = require("fs")
const path = require("path")
const parser = require("@babel/parser")
// 分析模块
const traverse = require("@babel/traverse").default
// 解析代码语法
const { transformFromAst } = require("@babel/core")


module.exports = class Webpack {
  constructor(options) {
    // console.log(options)
    // 分析路口文件和出口
    const { entry, output } = options
    this.entry = entry
    this.output = output
    // 缓存入口文件的依赖，用于递归遍历
    this.modules = []
  }
  run () {
    const info = this.parse(this.entry)
    // console.log(info)
    this.modules.push(info)
    // 递归遍历其他模块：通过修改数组长度
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i]
      const { dependencies } = item
      if (dependencies) {
        for (let j in dependencies) {
          this.modules.push(this.parse(dependencies[j]))
        }
      }
    }
    // 数组需要转成对象
    const obj = {}
    this.modules.forEach(item => {
      obj[item.entryPath] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    console.log(obj)
    this.file(obj)

  }
  // 从入口文件开始分析代码
  parse (entryPath) {
    // console.log(entryPath)
    const entryContent = fs.readFileSync(entryPath, 'utf-8')
    // parse方法可以分析传入的模块内容
    const ast = parser.parse(entryContent, {
      sourceType: "module"
    })
    // console.log(ast.program.body)
    const dependencies = {}
    traverse(ast, {
      // 这个方法名是ast中的type
      ImportDeclaration ({ node }) {
        const newPathname = ".\\" + path.join(path.dirname(entryPath), node.source.value)
        // console.log(newPathname)
        dependencies[node.source.value] = newPathname
      }
    })
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    })
    // console.log(code)
    return {
      entryPath,
      dependencies,
      code
    }
  }
  // 生成buddle.js文件
  file (code) {
    // 创建自运行函数，处理require,module,exports
    // 生成main.js => dist/main.js
    const newCode = JSON.stringify(code)
    const filePath = path.join(this.output.path, this.output.filename)
    // console.log(filePath)
    // require("./a.js")
    const buddle = `(function(graph){
      function require(module) {
        function reRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require,exports, code){
          eval(code)
        })(reRequire, exports, graph[module].code);
        return exports
      }
      require('${this.entry}')
    })(${newCode})`
    fs.writeFileSync(filePath, buddle, 'utf-8')
  }
}