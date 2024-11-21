import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/logo/logo.jpg'

const userStore = defineStore('user', () => {
    const state = reactive({
        token: getToken(),
        id: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    })
    // 用户登陆方法
    const Login = (userInfo) => {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
            login(username, password, code, uuid).then(res => {
                setToken(res.token)
                state.token = res.token
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // 获取用户信息
    const GetInfo = () => {
        return new Promise((resolve, reject) => {
            getInfo().then(res => {
                let { user, avatar } = res
                if (!isHttp(avatar)) {
                    avatar = (isEmpty(avatar)) ? defAva : process.env.VUE_APP_BASE_API + avatar
                }
                if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    state.roles = res.roles
                    state.permissions = res.permissions
                } else {
                    state.roles = ['ROLE_DEFAULT']
                }
                state.id = user.userId
                state.name = user.userName
                state.avatar = avatar
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // 用户退出方法
    const LogOut = () => {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                state.token = ''
                state.roles = []
                state.permissions = []
                removeToken()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    }
    return {
        state,
        Login,
        GetInfo,
        LogOut
    }
})
export default userStore