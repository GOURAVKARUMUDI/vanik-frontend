import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Entrance = () => {
    const navigate = useNavigate()

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

            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                style={{
                    padding: '1rem 3rem', background: '#7C3E2F', color: '#fff',
                    border: 'none', borderRadius: '999px', fontSize: '1.1rem',
                    fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em',
                    boxShadow: '0 8px 32px rgba(124,62,47,0.3)'
                }}
            >
                Enter VANIK
            </motion.button>
        </div>
    )
}

export default Entrance
