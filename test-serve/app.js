const express = require('express')
const app = express()
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

// app.get('/', (req, res) => {
//   res.send('hello')
// })

// 托管了 dist 目录
// 当访问 / 的时候， 默认会返回托管目录中的 index.html 文件
app.use(express.static(path.join(__dirname, '../dist')))

// 配置以 /boss 开头的接口代理
app.use(
  '/boss',
  createProxyMiddleware({
    target: 'http://eduboss.lagou.com',
    changeOrigin: true
  })
)
// 配置以 /front 开头的接口代理
app.use(
  '/front',
  createProxyMiddleware({
    target: 'http://edufront.lagou.com',
    changeOrigin: true
  })
)

app.listen(3000, () => {
  console.log('runing....')
})
