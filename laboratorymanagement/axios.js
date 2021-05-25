import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
Vue.use(VueAxios, axios)
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.withCredentials = true //带cookie
axios.interceptors.request.use(
    config => {
        if (config.method === 'post' && config.headers.post['Content-Type'] === 'application/json;charset=UTF-8') {
            console.log(config.data);
        } else if (config.method === 'get') {
            config.params = {
                ...config.params
            }
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http 响应 拦截器
axios.interceptors.response.use(
    res => {
        // console.log(response)
        // // console.log(res)
        return res.data
    },
    err => {
        // console.log(err)
        return Promise.reject(err)
    }
)

export default axios