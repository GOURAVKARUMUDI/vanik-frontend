import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('vanik_user')
        if (user) {
            try {
                const parsed = JSON.parse(user)
                if (parsed?.token) {
                    config.headers.Authorization = `Bearer ${parsed.token}`
                }
            } catch {
                // Malformed storage — ignore
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle 401 globally — clear stale session
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('vanik_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
