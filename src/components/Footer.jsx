import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear()

    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <div style={topSection}>
                    <div style={brandSection}>
                        <h2 style={logoStyle} onClick={() => navigate('/home')}>VANIK</h2>
                        <p style={taglineStyle}>The Exclusive Marketplace for Campus Communities.</p>
                        <div style={socialSection}>
                            {['instagram', 'twitter', 'linkedin'].map(social => (
                                <motion.div
                                    key={social}
                                    whileHover={{ y: -3, color: '#D4AF37' }}
                                    style={socialIcon}
                                >
                                    <i className={`fab fa-${social}`}></i>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div style={linksGrid}>
                        <div style={linkGroup}>
                            <h4 style={groupTitle}>Explore</h4>
                            <span style={linkItem} onClick={() => navigate('/marketplace')}>Marketplace</span>
                            <span style={linkItem} onClick={() => navigate('/buyer-dashboard')}>My Hub</span>
                            <span style={linkItem}>Categories</span>
                        </div>
                        <div style={linkGroup}>
                            <h4 style={groupTitle}>Company</h4>
                            <span style={linkItem}>About Us</span>
                            <span style={linkItem}>Guidelines</span>
                            <span style={linkItem}>Support</span>
                        </div>
                        <div style={linkGroup}>
                            <h4 style={groupTitle}>Legal</h4>
                            <span style={linkItem}>Privacy Policy</span>
                            <span style={linkItem}>Terms of Service</span>
                            <span style={linkItem}>Cookie Policy</span>
                        </div>
                    </div>
                </div>

                <div style={divider}></div>

                <div style={bottomSection}>
                    <p style={copyright}>&copy; {currentYear} VANIK. All rights reserved.</p>
                    <div style={bottomLinks}>
                        <span>Sustainability</span>
                        <span style={{ margin: '0 1rem' }}>·</span>
                        <span>Community</span>
                        <span style={{ margin: '0 1rem' }}>·</span>
                        <span>Trust & Safety</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const footerStyle = {
    background: '#1E1E1E',
    color: '#fff',
    padding: '4rem 2rem 2rem',
    fontFamily: "'Poppins', sans-serif",
}

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
}

const topSection = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '3rem',
    marginBottom: '3rem'
}

const brandSection = {
    flex: '1',
    minWidth: '250px'
}

const logoStyle = {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#D4AF37',
    margin: '0 0 1rem',
    cursor: 'pointer',
    letterSpacing: '2px'
}

const taglineStyle = {
    color: '#aaa',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    maxWidth: '300px'
}

const socialSection = {
    display: 'flex',
    gap: '1.25rem'
}

const socialIcon = {
    fontSize: '1.2rem',
    color: '#888',
    cursor: 'pointer',
    transition: 'color 0.2s'
}

const linksGrid = {
    display: 'flex',
    gap: '4rem',
    flexWrap: 'wrap'
}

const linkGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
}

const groupTitle = {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#D4AF37',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
}

const linkItem = {
    color: '#aaa',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
    '&:hover': {
        color: '#fff'
    }
}

const divider = {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    marginBottom: '2rem'
}

const bottomSection = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
}

const copyright = {
    color: '#666',
    fontSize: '0.85rem'
}

const bottomLinks = {
    color: '#666',
    fontSize: '0.85rem'
}

export default Footer
