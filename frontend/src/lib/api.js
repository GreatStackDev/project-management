import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL

// Without it, axios quietly calls the frontend's own origin and every request 404s with no obvious cause
if (!baseURL) console.warn('VITE_BASE_URL is not set: API requests will go to the frontend origin and fail. See .env.example.')

export const api = axios.create({ baseURL })

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
