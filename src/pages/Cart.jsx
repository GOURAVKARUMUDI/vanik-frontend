import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart()
    const navigate = useNavigate()
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', marginBottom: '2rem' }}>Your Cart</h1>

                    {cart.length === 0 ? (
                        <div style={emptyStyle}>
                            <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                            <button onClick={() => navigate('/marketplace')} style={primaryBtn}>Browse Marketplace</button>
                        </div>
                    ) : (
                        <>
                            {cart.map(item => (
                                <motion.div key={item.cartId} layout style={itemStyle}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1E1E1E', fontWeight: 700 }}>{item.title}</h3>
                                        <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.85rem' }}>{item.category} · {item.seller}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#7C3E2F' }}>₹{item.price}</span>
                                        <button onClick={() => removeFromCart(item.cartId)} style={removeBtn}>Remove</button>
                                    </div>
                                </motion.div>
                            ))}

                            <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ color: '#888', margin: 0 }}>{cart.length} item(s)</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>Total: ₹{total}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={clearCart} style={ghostBtn}>Clear Cart</button>
                                    <button onClick={() => navigate('/checkout')} style={primaryBtn}>Checkout →</button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const itemStyle = { background: '#fff', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }
const emptyStyle = { textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem' }
const primaryBtn = { padding: '0.75rem 1.75rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }
const ghostBtn = { padding: '0.75rem 1.5rem', background: 'transparent', color: '#7C3E2F', border: '2px solid #7C3E2F', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }
const removeBtn = { padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }

export default Cart
