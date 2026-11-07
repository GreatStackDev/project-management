import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL })

// Hooks can't run inside axios, so Layout hands us Clerk's getToken once after sign-in
let getToken = null
export const setTokenGetter = (fn) => {
    getToken = fn
}

// getToken() returns a fresh short-lived token each time, so it's fetched per request rather than stored
api.interceptors.request.use(async (config) => {
    const token = await getToken?.()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
