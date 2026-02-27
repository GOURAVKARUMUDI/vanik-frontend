import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/orderService'
import { useState } from 'react'

const Checkout = () => {
    const { cart, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleOrder = async () => {
        if (cart.length === 0) return
        setError(''); setLoading(true)
        try {
            await createOrder(cart, user?._id)
            clearCart()
            alert('Order placed successfully! Thank you for shopping on VANIK.')
            navigate('/buyer-dashboard')
        } catch (err) {
            console.error('[Checkout]', err)
            setError(err.message || 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                <h2 style={{ color: '#7C3E2F' }}>Your cart is empty</h2>
                <button onClick={() => navigate('/marketplace')} style={primaryBtn}>Go to Marketplace</button>
            </div>
        )
    }

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', marginBottom: '2rem' }}>Checkout</h1>

                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

                    {cart.map(item => (
                        <div key={item.cartId} style={itemStyle}>
                            <div>
                                <span style={{ fontWeight: 600 }}>{item.title}</span>
                                {item.seller?.name && <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#888' }}>by {item.seller.name}</p>}
                            </div>
                            <span style={{ fontWeight: 800, color: '#7C3E2F' }}>₹{item.price}</span>
                        </div>
                    ))}

                    <div style={{ background: '#7C3E2F', borderRadius: '1rem', padding: '1.5rem 2rem', marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 0.5rem' }}>{cart.length} item(s)</p>
                        <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 1.5rem' }}>Total: ₹{total}</p>
                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            style={{ padding: '1rem 3rem', background: '#D4AF37', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const itemStyle = { background: '#fff', borderRadius: '0.75rem', padding: '1rem 1.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
const primaryBtn = { marginTop: '1.5rem', padding: '1rem 2.5rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }

export default Checkout
