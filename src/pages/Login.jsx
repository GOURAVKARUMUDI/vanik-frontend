import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth, googleProvider } from '../firebase'
import { sendEmailVerification } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { login, googleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showResend, setShowResend] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) { setError('Please fill in all fields.'); return }
        setError(''); setLoading(true); setShowResend(false);
        try {
            const user = await login(email, password)
            console.log('[Login] User role:', user.role)
            if (!user.profileComplete) navigate('/complete-profile')
            else if (user.role === 'buyer') navigate('/buyer-dashboard')
            else if (user.role === 'seller') navigate('/seller-dashboard')
            else if (user.role === 'admin') navigate('/admin')
            else navigate('/home')
        } catch (err) {
            if (err.code === 'auth/unverified-email') {
                setError(err.message)
                setShowResend(true)
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.')
            } else {
                setError(err.message || 'Login failed. Please check your credentials.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendVerification = async () => {
        if (!auth.currentUser) return;
        try {
            await sendEmailVerification(auth.currentUser);
            alert('Verification email sent! Please check your inbox.');
            setShowResend(false);
        } catch (err) {
            setError('Failed to resend verification: ' + err.message);
        }
    }

    const handleGoogleLogin = async () => {
        setError(''); setLoading(true)
        try {
            const user = await googleLogin(googleProvider)
            if (user.isNewUser) {
                navigate('/select-role', { state: { user } })
            } else if (!user.profileComplete) {
                navigate('/complete-profile')
            } else if (user.role === 'buyer') {
                navigate('/buyer-dashboard')
            } else if (user.role === 'seller') {
                navigate('/seller-dashboard')
            } else if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/home')
            }
        } catch (err) {
            setError(err.message || 'Google Sign-In failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={pageStyle}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h2 style={{ color: '#7C3E2F', fontWeight: 900, fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ color: '#888', marginBottom: '2.5rem', textAlign: 'center' }}>Sign in to your VANIK account using your campus mail</p>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{ ...googleBtnStyle, opacity: loading ? 0.7 : 1 }}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
                        Continue with Google
                    </button>

                    <p style={{ color: '#aaa', fontSize: '0.85rem', maxWidth: '300px', textAlign: 'center', lineHeight: 1.4 }}>
                        By continuing, you agree to VANIK's terms of service and campus community guidelines.
                    </p>
                </div>

                <p style={{ marginTop: '2.5rem', color: '#888', textAlign: 'center', fontSize: '0.95rem' }}>
                    New to VANIK?{' '}
                    <span onClick={() => navigate('/register')} style={{ color: '#7C3E2F', cursor: 'pointer', fontWeight: 800 }}>
                        Join Now
                    </span>
                </p>
            </motion.div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }
const cardStyle = { background: '#fff', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }
const inputStyle = { padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '2px solid #eee', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }
const btnStyle = { padding: '1rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }
const googleBtnStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.85rem', background: '#fff', color: '#444', border: '2px solid #eee', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', width: '100%' }
const errorStyle = { background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem' }

export default Login
