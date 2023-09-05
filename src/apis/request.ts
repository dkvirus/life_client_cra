/**
 * 封装网络请求库
 * 
 * - 取消上一次未完成的请求
 * 
 * updateTk() 
 */

import axios, { AxiosRequestConfig } from 'axios'
import { apiPrefix } from 'configs'
import { storage } from 'utils/storage'

// 设置全局参数
axios.defaults.baseURL = apiPrefix

// ******************************** 取消上一次未完成的请求 Start ***************************************
// 是否取消重复请求开关
const cancelDuplicated = true

// 存储每个请求中的map
const pendingXHRMap = new Map()

// 取消请求类型定义 便于后期对此类型不做异常处理
const REQUEST_TYPE = {
    DUPLICATED_REQUEST: 'duplicatedRequest',
}

// 设置重复标记的函数
const duplicatedKeyFn = config =>
    // 可在此设置用户自定义其他唯一标识 默认按请求方式 + 请求地址
    `${config.method}-${(config.url || '').split('?')[0]}`

// 添加到请求记录
const addPendingXHR = config => {
    // disable `Cancel Request` or not
    if (judgeDisabledCancelRequestFn(config.data)) return

    if (!cancelDuplicated) {
        return
    }
    const duplicatedKey = JSON.stringify({
        duplicatedKey: duplicatedKeyFn(config),
        type: REQUEST_TYPE.DUPLICATED_REQUEST,
    })
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        if (duplicatedKey && !pendingXHRMap.has(duplicatedKey)) {
            pendingXHRMap.set(duplicatedKey, cancel)
        }
    })
}

// 删除请求记录
const removePendingXHR = config => {
    // disable `Cancel Request` or not
    if (judgeDisabledCancelRequestFn(config.data)) return

    if (!cancelDuplicated) {
        return
    }
    const duplicatedKey = JSON.stringify({
        duplicatedKey: duplicatedKeyFn(config),
        type: REQUEST_TYPE.DUPLICATED_REQUEST,
    })
    if (duplicatedKey && pendingXHRMap.has(duplicatedKey)) {
        const cancel = pendingXHRMap.get(duplicatedKey)
        cancel(duplicatedKey)
        pendingXHRMap.delete(duplicatedKey)
    }
}

const handleUrl = config => {
    if (!cancelDuplicated) {
        return
    }
    const urls = [ 'metadata' ]
    const duplicatedKey = JSON.stringify({
        duplicatedKey: duplicatedKeyFn(config),
        type: REQUEST_TYPE.DUPLICATED_REQUEST,
    })
    const token = storage.getAccessToken()
    const url = config?.url

    if (!token && urls.some(u => url.startsWith(u)) && pendingXHRMap.has(duplicatedKey)) {
        const cancel = pendingXHRMap.get(duplicatedKey)
        cancel(duplicatedKey)
        pendingXHRMap.delete(duplicatedKey)
    }
}

// 拦截请求
axios.interceptors.request.use(
    config => {
        removePendingXHR(config)
        addPendingXHR(config)
        /**
         * 目前在登录页面会发三个请求，而这三个请求都需要 token 才能拿到数据
         * 能跳转到登录页通常是因为 token 过期或不存在
         * 这样就会造成这三个接口一直报错 401，后台会疯狂记录错误日志
         * 暂时先对这三个接口特殊处理，后面考虑登录成功后再发出这三个请求
         */
        handleUrl(config)
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// 拦截响应
axios.interceptors.response.use(response => {
    removePendingXHR(response.config)
    return response
}, error => {
    // 如果是取消请求类型则忽略异常处理
    let isDuplicatedType
    try {
        const errorType = (JSON.parse(error.message) || {}).type
        isDuplicatedType = errorType === REQUEST_TYPE.DUPLICATED_REQUEST
    } catch (error) {
        isDuplicatedType = false
    }
    if (!isDuplicatedType) {
        // 其他异常处理
        console.error(error.message)
    }
    return Promise.reject(error)
})

const judgeDisabledCancelRequestFn = (data: any = {}) => data?.DISABLE_CANCEL_REQUEST

// ******************************** 取消上一次未完成的请求 End ***************************************

export default function request(opts: AxiosRequestConfig) {
    const token = storage.getAccessToken()
    if (token && opts?.url !== '/login') {
        axios.defaults.headers.common.Authorization = 'Bearer ' + token
    } else {
        delete axios.defaults.headers.common.Authorization
        storage.setAccessToken('')
    }
    return axios.request(opts)
        .then(response => {
            return response.data
        })
        .catch(error => {
            if (error instanceof axios.Cancel) {
                return null
            } else {
                const resp = error.response || { data: {} }

                // 401 和 403 时清空缓存, 自动跳转登录页面
                if (resp.status === 401 || resp.status === 403) {
                    localStorage.setItem('email', '')
                    const { pathname } = window.location
                    if (![ '/login' ].includes(pathname)) {
                        window.location.href = '/login'
                    }
                }
                return null
            }
        })
}
