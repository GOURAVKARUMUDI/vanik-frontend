import axios from 'axios'
import { auth } from '../firebase'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach Firebase ID token to every request securely
api.interceptors.request.use(
    async (config) => {
        if (auth.currentUser) {
            try {
                // Get fresh Firebase ID token
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`
            } catch (error) {
                console.error("Failed to get Firebase token:", error);
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
            // Don't auto-redirect immediately, let components handle it gracefully if they want, 
            // but we could uncomment this if needed.
            // window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
