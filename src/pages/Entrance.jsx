import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Entrance = () => {
    const navigate = useNavigate()
    const { googleLogin } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)
        try {
            const user = await googleLogin(googleProvider)
            if (user.isNewUser) {
                // If new user, go to select role
                navigate('/select-role', { state: { user } })
            } else if (!user.profileComplete) {
                // If existing but profile not done
                navigate('/complete-profile')
            } else {
                // Already registered and complete
                if (user.role === 'buyer') navigate('/buyer-dashboard')
                else if (user.role === 'seller') navigate('/seller-dashboard')
                else if (user.role === 'admin') navigate('/admin')
                else navigate('/home')
            }
        } catch (err) {
            console.error('[Entrance] Google Login Error:', err)
            setError(err.message || 'Google Sign-In failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#F5F3EF',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ fontSize: '6rem', fontWeight: 900, color: '#7C3E2F', margin: 0, letterSpacing: '-2px' }}
            >
                VANIK
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{ color: '#D4AF37', fontWeight: 600, letterSpacing: '0.3em', fontSize: '0.85rem', marginBottom: '3rem' }}
            >
                SMART CAMPUS EXCHANGE
            </motion.p>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: '#dc2626', background: '#fee2e2', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                >
                    {error}
                </motion.div>
            )}

            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 2.5rem', background: '#fff', color: '#444',
                    border: '2px solid #eee', borderRadius: '999px', fontSize: '1.1rem',
                    fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                    opacity: loading ? 0.7 : 1
                }}
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
                {loading ? 'Joining...' : 'Join with Google'}
            </motion.button>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{ marginTop: '2rem', color: '#888', fontSize: '0.9rem' }}
            >
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#7C3E2F', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Sign In</span>
            </motion.p>
        </div>
    )
}

export default Entrance
