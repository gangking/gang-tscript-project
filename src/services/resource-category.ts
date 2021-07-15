/**
 * 资源管理请求模块
 */
import request from '@/utils/request'

/**
 * 获取资源分类列表
 * @param data
 * @returns
 */
export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
    // axios 默认发送 application/json 格式数据
  })
}
