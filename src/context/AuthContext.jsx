import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { loginUser, registerUser, loginWithGoogle } from '../services/authService'
import { getUserProfile } from '../services/userDbService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('vanik_user')
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })

    // Sync Firebase Auth state — handles page refreshes & token expiry
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Try restoring from localStorage first (fast path)
                const saved = localStorage.getItem('vanik_user')
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved)
                        if (parsed._id === firebaseUser.uid) {
                            setUser(parsed)
                            return
                        }
                    } catch { /* fall through */ }
                }
                // Fallback: fetch profile from RTDB
                try {
                    const profile = await getUserProfile(firebaseUser.uid)
                    if (profile) {
                        const userData = { _id: firebaseUser.uid, ...profile }
                        localStorage.setItem('vanik_user', JSON.stringify(userData))
                        setUser(userData)
                    }
                } catch (e) {
                    console.error('[AuthContext] Could not restore profile:', e)
                }
            } else {
                // Firebase session gone — clear local state
                localStorage.removeItem('vanik_user')
                setUser(null)
            }
        })
        return () => unsubscribe()
    }, [])

    const login = async (email, password) => {
        const data = await loginUser(email, password)
        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            college: data.college,
        }
        localStorage.setItem('vanik_user', JSON.stringify(userData))
        setUser(userData)
        console.log('[AuthContext] Login success:', userData.email, '→', userData.role)
        return userData
    }

    const register = async (name, email, password, college, role) => {
        const data = await registerUser({ name, email, password, college, role })
        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            college: data.college,
        }
        localStorage.setItem('vanik_user', JSON.stringify(userData))
        setUser(userData)
        console.log('[AuthContext] Register success:', userData.email, '→', userData.role)
        return userData
    }

    const googleLogin = async (googleProvider) => {
        const data = await loginWithGoogle(auth, googleProvider)

        if (data.isNewUser) {
            // Do NOT save to localStorage/context yet. Let SelectRole set it.
            return data;
        }

        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            college: data.college,
            profileComplete: data.profileComplete || false,
        }
        localStorage.setItem('vanik_user', JSON.stringify(userData))
        setUser(userData)
        console.log('[AuthContext] Google Login success:', userData.email, '→', userData.role)
        return userData
    }

    const logout = async () => {
        await signOut(auth)
        localStorage.removeItem('vanik_user')
        setUser(null)
        console.log('[AuthContext] Logged out')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
