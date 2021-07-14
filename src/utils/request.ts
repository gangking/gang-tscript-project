import axios from 'axios'
import store from '@/store'
import router from '@/router'
import qs from 'qs'

import { Message } from 'element-ui'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

// 跳转登录
function redirectionLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 定义刷新token方法，解决多个接口失败，造成多次请求token问题
function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // console.log('请求进来了', config)
    // 请求成功
    // 我们可以在这里通过改写 config 配置信息来实现业务功能的统一处理
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    // 注意：这里一定要返回config，否则请求就发不出去了
    return config
  },
  function (error) {
    // 请求失败
    return Promise.reject(error)
  }
)
// 响应拦截器
let isRefreshing = false // 控制刷新 token 的状态，防止多次请求多次刷新
let requests: any[] = [] // 存储刷新 token 过来的 401 请求
request.interceptors.response.use(
  function (response) {
    // （成功）当http状态码为 2** 都会进入这里
    // console.log('请求响应成功', response)
    // 如果是自定义错误状态码，错误处理就写到这里
    return response
  },
  async function (error) {
    // （失败）超出 2** 的状态码 都会进入这里
    // 如果是http错误状态码，错误处理就写到这里
    console.log('请求响应失败', error)
    if (error.response) {
      // 请求收到响应，但是响应超出了 2** 范围
      const { status } = error.response
      // 400
      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        // token无效 （没有提供 token, 无效或者过期）
        // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
        if (!store.state.user) {
          redirectionLogin()
          return Promise.reject(error)
        }

        if (!isRefreshing) {
          isRefreshing = true // 开启刷新状态
          // 如果没有刷新token，则尝试获取新的tonken
          return refreshToken()
            .then(res => {
              if (!res.data.success) {
                // 失败抛出异常
                throw new Error('刷新 Token 失败')
              }
              // 刷新token成功
              // 把成功刷新拿到的access_token更新到容器中
              store.commit('setUser', res.data.content)
              // 成功了，把本次失败请求重新发出去
              // console.log(error.config)
              // 失败请求的配置信息
              // 把requests中请求发出去
              requests.forEach(cb => cb())
              // 重置reuests数组
              requests = []
              return request(error.config)
            })
            .catch(err => {
              console.log(err)
              // 把当前登录用户状态清除
              store.commit('setUser', null)
              // 失败了，跳转登录页面重新登录获取新的 token
              redirectionLogin()
              return Promise.reject(error)
            })
            .finally(() => {
              // 不管刷新或者失败最终都要重置为flase
              isRefreshing = false
            })
        }

        // 避免漏掉请求
        // 刷新状态下把请求挂起，放在 requests 数组中
        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else if (status >= 500) {
        Message.error('服务端错误，请联系管理员')
      }
    } else if (error.request) {
      // 请求已发出，没有收到响应
      Message.error(`请求超时：请刷新重试`)
    } else {
      // 设置请求时发生了一些错误，触发了一个错误
      Message.error(`请求失败：${error.message}`)
    }

    // 请求失败错误对象继续抛出，扔给下一个调用者
    return Promise.reject(error)
  }
)

export default request
