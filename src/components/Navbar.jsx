import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { cart } = useCart()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const getDashboardPath = () => {
        if (!user) return '/login'
        if (user.role === 'buyer') return '/buyer-dashboard'
        if (user.role === 'seller') return '/seller-dashboard'
        if (user.role === 'admin') return '/admin'
        return '/login'
    }

    const handleLogout = () => {
        logout()
        navigate('/home')
    }

    const isActive = (path) => pathname === path

    return (
        <nav style={navStyle}>
            <div style={innerStyle}>
                <span onClick={() => navigate('/home')} style={logoStyle}>VANIK</span>

                <div style={linksStyle}>
                    <span onClick={() => navigate('/marketplace')} style={linkStyle(isActive('/marketplace'))}>Marketplace</span>
                    <span onClick={() => navigate('/cart')} style={linkStyle(isActive('/cart'))}>
                        Cart {cart.length > 0 && <span style={cartBadge}>{cart.length}</span>}
                    </span>

                    {user ? (
                        <>
                            <span onClick={() => navigate(getDashboardPath())} style={linkStyle(false)}>Dashboard</span>
                            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
                        </>
                    ) : (
                        <>
                            <span onClick={() => navigate('/login')} style={linkStyle(isActive('/login'))}>Login</span>
                            <button onClick={() => navigate('/register')} style={registerBtn}>Join VANIK</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

const navStyle = { position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #eee', fontFamily: "'Poppins', sans-serif" }
const innerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const logoStyle = { fontSize: '1.5rem', fontWeight: 900, color: '#7C3E2F', cursor: 'pointer', letterSpacing: '-1px' }
const linksStyle = { display: 'flex', gap: '1.5rem', alignItems: 'center' }
const linkStyle = (active) => ({ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: active ? '#7C3E2F' : '#555', borderBottom: active ? '2px solid #7C3E2F' : '2px solid transparent', paddingBottom: '2px', position: 'relative' })
const cartBadge = { background: '#7C3E2F', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '999px', marginLeft: '0.25rem' }
const logoutBtn = { padding: '0.5rem 1.25rem', background: 'transparent', color: '#7C3E2F', border: '2px solid #7C3E2F', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }
const registerBtn = { padding: '0.5rem 1.25rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }

export default Navbar
