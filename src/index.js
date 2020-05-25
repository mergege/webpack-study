
import './css/index.css'
import css from './css/index.less'
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
import number from './number.js'
import counter from './counter.js'

counter()
number()

if (module.hot) {
  module.hot.accept('./number.js', () => {
    document.body.removeChild(document.getElementById('number'))
    number()
  })
}