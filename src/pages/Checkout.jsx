import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/orderService'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Checkout = () => {
    const { cart, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { deliveryFee = 0, total: totalFromCart = 0 } = location.state || {}

    const total = totalFromCart || cart.reduce((sum, item) => sum + (item.price || 0), 0)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [step, setStep] = useState('shipping') // shipping | payment

    // Shipping form state
    const [shippingForm, setShippingForm] = useState({
        address: '',
        campus: user?.campus || ''
    })

    const handleOrder = async () => {
        if (cart.length === 0) return
        if (!shippingForm.address.trim() || !shippingForm.campus.trim()) {
            setError('Please provide shipping and campus details.')
            setStep('shipping')
            return
        }

        setError(''); setLoading(true)
        try {
            await createOrder(cart, user, {
                address: shippingForm.address,
                campus: shippingForm.campus
            })
            clearCart()
            setShowSuccess(true)
        } catch (err) {
            console.error('[Checkout]', err)
            setError(err.message || 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0 && !showSuccess) {
        return (
            <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                <h2 style={{ color: '#7C3E2F' }}>Your cart is empty</h2>
                <button onClick={() => navigate('/marketplace')} style={primaryBtn}>Go to Marketplace</button>
            </div>
        )
    }

    return (
        <div style={pageStyle}>
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={modalOverlay}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={modalContent}
                        >
                            <div style={successIcon}>✓</div>
                            <h2 style={{ color: '#7C3E2F', fontWeight: 900, marginBottom: '1rem' }}>Payment Successful!</h2>
                            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                                Tracking details will be updated soon.<br />
                                You can check your product tracking in your dashboard.
                            </p>
                            <button
                                onClick={() => navigate('/buyer-dashboard')}
                                style={modalBtn}
                            >
                                Go to My Purchases
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', marginBottom: '1.5rem' }}>Checkout</h1>

                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

                    {step === 'shipping' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', border: '2px solid #EEE' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#1E1E1E' }}>Step 1: Shipping Details</h3>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Detailed Delivery Address</label>
                                <textarea
                                    placeholder="e.g. Block A, Room 402, North Hostel"
                                    value={shippingForm.address}
                                    onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Campus / College Name</label>
                                <input
                                    placeholder="e.g. SRM Kattankulathur"
                                    value={shippingForm.campus}
                                    onChange={(e) => setShippingForm(prev => ({ ...prev, campus: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (shippingForm.address.trim() && shippingForm.campus.trim()) setStep('payment')
                                    else setError('Please fill in all shipping details.')
                                }}
                                style={{ ...primaryBtn, width: '100%', marginTop: '1rem' }}
                            >
                                Proceed to Payment
                            </button>
                        </motion.div>
                    )}

                    {step === 'payment' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', border: '2px solid #7C3E2F' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, color: '#1E1E1E' }}>Step 2: Payment</h3>
                                    <span onClick={() => setStep('shipping')} style={{ color: '#888', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Edit Shipping</span>
                                </div>
                                <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.9rem' }}>
                                    Secure payment enabled via VANIK Gateway.
                                </p>
                            </div>

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
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 0.25rem', fontSize: '0.85rem' }}>{cart.length} item(s)</p>
                                    {deliveryFee > 0 && (
                                        <p style={{ color: '#D4AF37', margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 700 }}>Transport Fee: ₹{deliveryFee}</p>
                                    )}
                                </div>
                                <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 1.5rem' }}>Total: ₹{total}</p>
                                <button
                                    onClick={handleOrder}
                                    disabled={loading}
                                    style={{ padding: '1rem 3rem', background: '#D4AF37', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1, width: '100%' }}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const itemStyle = { background: '#fff', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
const primaryBtn = { padding: '1rem 2.5rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }
const labelStyle = { fontSize: '0.85rem', fontWeight: 700, color: '#555' }
const inputStyle = { padding: '0.85rem 1rem', borderRadius: '0.6rem', border: '2px solid #EEE', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }

// Modal Styles
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }
const modalContent = { background: '#fff', borderRadius: '2rem', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }
const successIcon = { width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }
const modalBtn = { padding: '1rem 2rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }

export default Checkout
