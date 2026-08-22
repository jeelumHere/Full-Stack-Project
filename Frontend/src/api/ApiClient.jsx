let accessToken = null

import axios from "axios"

export const setAccessToken = (token) => {
    accessToken = token
}

export const getAccessToken = () => {
    return accessToken
}

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

// Separate instance for refresh calls — no interceptors, so a failed
// refresh can never trigger another refresh attempt (avoids infinite loop)
const refreshClient = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

// Shared in-flight promise so concurrent 401s don't fire parallel
// refresh requests (avoids refresh-token race condition)
let refreshPromise = null

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post("/auth/refreshToken")
            .then((res) => {
                const newAccessToken = res.data?.accessToken
                setAccessToken(newAccessToken)
                return newAccessToken
            })
            .catch((err) => {
                setAccessToken(null)
                throw err
            })
            .finally(() => {
                refreshPromise = null
            })
    }
    return refreshPromise
}

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },

    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response
    },

    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            error.response?.data?.message === "Access token expired" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                const newAccessToken = await refreshAccessToken()

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                return apiClient(originalRequest)
            } catch (err) {
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient