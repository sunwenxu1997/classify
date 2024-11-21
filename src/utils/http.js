// 创建axios拦截器
import axios from 'axios'
import { showToast } from 'vant'
console.log(import.meta.env);
// 创建一个axios实例
const server = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})
// request interceptor
server.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      showToast(res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    // do something with response data
    return res
  },
  (error) => {
    // do something with response error
    showToast(error.message)
    return Promise.reject(error)
  }
)
export default server
// export default {
//   install: (app) => {
//     app.config.globalProperties.$axios = server
//   }
// }
