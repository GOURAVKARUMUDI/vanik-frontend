import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile } from '../../services/userDbService'

const CompleteProfile = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: '',
        city: '',
        campus: user?.college || '',
    })

    const handleFinalRedirect = useCallback(() => {
        if (!user) return;
        if (user.role === 'buyer') navigate('/buyer-dashboard')
        else if (user.role === 'seller') navigate('/seller-dashboard')
        else if (user.role === 'admin') navigate('/admin')
        else navigate('/home')
    }, [user, navigate])

    // If suddenly logged out, or already complete
    useEffect(() => {
        if (!user) {
            navigate('/login')
        } else if (user.profileComplete) {
            handleFinalRedirect()
        }
    }, [user, navigate, handleFinalRedirect])

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation to avoid "invalid input"
        if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.campus.trim()) {
            setError('Please complete all fields with valid information.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const userId = user._id || user.uid
            if (!userId) throw new Error('User session lost. Please log in again.')

            const updates = {
                name: form.name.trim(),
                phone: form.phone.trim(),
                city: form.city.trim(),
                campus: form.campus.trim(),
                college: form.campus.trim(),
                region: form.city.trim(),
                profileComplete: true,
            }
            // Update RTDB
            await updateUserProfile(userId, updates)

            // Explicitly sync state
            const updatedUser = { ...user, ...updates }
            if (setUser) setUser(updatedUser)
            localStorage.setItem('vanik_user', JSON.stringify(updatedUser))

            // Short delay to ensure state reflects
            setTimeout(() => {
                handleFinalRedirect()
            }, 100)
        } catch (err) {
            console.error('[CompleteProfile] Error:', err)
            setError(err.message || 'Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Return empty if redirecting
    if (!user || user.profileComplete) return null

    return (
        <div style={pageStyle}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h2 style={{ color: '#7C3E2F', fontWeight: 900, fontSize: '2rem', marginBottom: '0.5rem' }}>Almost There</h2>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Complete your profile to access your dashboard.</p>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Full Name</label>
                        <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Phone Number</label>
                        <input name="phone" placeholder="e.g. +91 9876543210" value={form.phone} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>City</label>
                        <input name="city" placeholder="e.g. Delhi, Mumbai" value={form.city} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Campus</label>
                        <input name="campus" placeholder="e.g. North Campus, Main University" value={form.campus} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}>
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: '2rem' }
const cardStyle = { background: '#fff', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }
const inputStyle = { padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '2px solid #eee', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }
const btnStyle = { padding: '1rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }

export default CompleteProfile
