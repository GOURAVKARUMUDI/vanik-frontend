import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const WaitingApproval = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/home')
    }

    if (!user || user.role !== 'seller') {
        return (
            <div style={pageStyle}>
                <div style={cardStyle}>
                    <h2>Not Authorized</h2>
                    <button onClick={() => navigate('/home')} style={btnStyle}>Go Home</button>
                </div>
            </div>
        )
    }

    return (
        <div style={pageStyle}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={cardStyle}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌛</div>
                <h2 style={{ color: '#7C3E2F', fontWeight: 900, fontSize: '2rem', margin: '0 0 0.5rem' }}>Awaiting Approval</h2>
                <p style={{ color: '#888', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Your seller account is currently under review by our campus admins.
                    This usually takes 1-24 hours to verify your details.
                    We will notify you once you are approved to start selling.
                </p>

                <div style={{ background: '#FFF8E7', color: '#D4AF37', padding: '1rem', borderRadius: '0.75rem', fontWeight: 700, marginBottom: '2rem' }}>
                    Status: Pending Review
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/home')} style={{ ...btnStyle, background: '#eee', color: '#555' }}>
                        Browse Marketplace
                    </button>
                    <button onClick={handleLogout} style={btnStyle}>
                        Logout
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: '2rem' }
const cardStyle = { background: '#fff', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }
const btnStyle = { padding: '0.8rem 1.5rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }

export default WaitingApproval
