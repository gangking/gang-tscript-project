/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
// 转换提交数据格式
import qs from 'qs'
// import store from '@/store'

interface User {
  phone: string
  password: string
}

/**
 * 用户登录
 * @param data
 * @returns
 */
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // (可不写qs会默认转换) headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data) // axios 默认发送 application/json 格式数据
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
