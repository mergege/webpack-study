
import './css/index.css'
import './css/index.less'
import logo from './images/logo.jpg'
import { add } from './expo.js'

console.log(1, 10)
const img = new Image()
img.src = logo
document.getElementById('root').appendChild(img)
// import axios from 'axios'
// console.log(css)

// const html = `<div class="${css.root}">哈啊啊哈</div>`
// const root = document.getElementById('root')
// // document.write(html)
// root.append(html)
// console.log('hello webpack!')

// let btn = document.createElement('button')
// btn.innerHTML = "新增"
// document.body.appendChild(btn)

// btn.onclick = function () {
//   let div = document.createElement('div')
//   div.innerHTML = 'item'
//   document.body.appendChild(div)
// }


// axios.get('api/mock.json').then((res) => {
//   console.log(res)
// })

// js的HMR:hot module replacement热模块替换
// import number from './number.js'
// import counter from './counter.js'

// counter()
// number()

// if (module.hot) {
//   module.hot.accept('./number.js', () => {
//     document.body.removeChild(document.getElementById('number'))
//     number()
//   })
// }

// babel语法转换
// babel插件分两种：一种是语法转换，一种是语法解析
// import '@babel/polyfill'：不会转换我们的语法，而是把语法放到window.promise全局对象上---会有全局对象（变量）污染
// const arr = [new Promise(() => { }), new Promise(() => { })]

// arr.map(item => {
//   console.log(item)
// })

// preset-react解析react语法，jsx
// import React, { Component } from 'react'
// import ReactDom from 'react-dom'

// class App extends Component {
//   render () {
//     return <div>hello react</div>
//   }
// }
// ReactDom.render(<App />, document.getElementById('root'))