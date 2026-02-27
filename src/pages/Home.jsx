import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const getDashboardPath = () => {
        if (!user) return '/login'
        if (user.role === 'buyer') return '/buyer-dashboard'
        if (user.role === 'seller') return '/seller-dashboard'
        if (user.role === 'admin') return '/admin'
        return '/login'
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#F5F3EF', fontFamily: "'Poppins', sans-serif",
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center'
        }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>
                    Campus Marketplace
                </h1>
                <p style={{ color: '#888', fontSize: '1.1rem', margin: '1rem 0 3rem' }}>
                    Buy and sell textbooks, lab equipment, and more — from your campus community.
                </p>

                {user && (
                    <div style={{ marginBottom: '1.5rem', background: '#fff', padding: '1rem 2rem', borderRadius: '1rem', display: 'inline-block' }}>
                        <span style={{ color: '#7C3E2F', fontWeight: 700 }}>Welcome back, </span>
                        <span style={{ color: '#D4AF37', fontWeight: 700 }}>{user.email}</span>
                        <span style={{ marginLeft: '0.75rem', background: '#7C3E2F', color: '#fff', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            {user.role}
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/marketplace')}
                        style={btnStyle('#7C3E2F')}
                    >
                        Browse Marketplace
                    </button>

                    {user ? (
                        <button
                            onClick={() => navigate(getDashboardPath())}
                            style={btnStyle('#D4AF37')}
                        >
                            My Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                style={btnStyle('#D4AF37')}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={btnStyle('#fff', '#7C3E2F')}
                            >
                                Join Now
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

const btnStyle = (bg, color = '#fff') => ({
    padding: '1rem 2.5rem', background: bg, color: color,
    border: bg === '#fff' ? '2px solid #7C3E2F' : 'none', borderRadius: '999px', fontSize: '1rem',
    fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
})

export default Home
