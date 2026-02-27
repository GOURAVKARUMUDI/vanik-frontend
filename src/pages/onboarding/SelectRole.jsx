import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { database } from '../../firebase'
import { ref, set } from 'firebase/database'

const SelectRole = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // We expect the partial user object (from Google Login) to be in state or local storage
    const partialUser = location.state?.user || user

    if (!partialUser || !partialUser._id) {
        // If they somehow got here without logging in via Google first
        return (
            <div style={pageStyle}>
                <div style={cardStyle}>
                    <h2 style={{ color: '#dc2626' }}>Session not found</h2>
                    <p>Please return to login and try again.</p>
                    <button onClick={() => navigate('/login')} style={btnStyle('#7C3E2F')}>Go to Login</button>
                </div>
            </div>
        )
    }

    const handleRoleSelection = async (selectedRole) => {
        setLoading(true)
        setError('')
        try {
            const uid = partialUser._id || partialUser.uid
            if (!uid) throw new Error('Session lost. Please try logging in again.')

            const profile = {
                uid: uid,
                name: partialUser.name || '',
                email: partialUser.email || '',
                role: selectedRole,
                profileComplete: false,
                approved: selectedRole === 'buyer' ? true : false,
                createdAt: Date.now(),
            }

            // Save to RTDB
            await set(ref(database, `users/${uid}`), profile)

            // Update AuthContext user with the new role and profileComplete flag
            const updatedUser = { _id: uid, ...profile }
            if (setUser) setUser(updatedUser)
            localStorage.setItem('vanik_user', JSON.stringify(updatedUser))

            // Short delay to ensure localStorage is set before navigation
            setTimeout(() => {
                navigate('/login')
            }, 100)
        } catch (err) {
            console.error('[SelectRole] Error saving role:', err)
            setError(err.message || 'Failed to save role. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={pageStyle}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h2 style={{ color: '#7C3E2F', fontWeight: 900, fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome to VANIK</h2>
                <p style={{ color: '#888', marginBottom: '2rem', textAlign: 'center' }}>How do you plan to use the marketplace?</p>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={() => handleRoleSelection('buyer')}
                        disabled={loading}
                        style={{ ...roleBtnStyle, border: '2px solid #1d4ed8', background: '#dbeafe', color: '#1d4ed8' }}
                    >
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🛒</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>I Want to Buy</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>Browse and purchase items</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelection('seller')}
                        disabled={loading}
                        style={{ ...roleBtnStyle, border: '2px solid #D4AF37', background: '#FFF8E7', color: '#D4AF37' }}
                    >
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💰</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>I Want to Sell</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>List and manage products (Requires Admin Approval)</div>
                        </div>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: '2rem' }
const cardStyle = { background: '#fff', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }
const btnStyle = (bg) => ({ marginTop: '1rem', padding: '0.8rem 1.5rem', background: bg, color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', width: '100%' })
const roleBtnStyle = { display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '1rem', cursor: 'pointer', transition: 'transform 0.2s', width: '100%' }

export default SelectRole
