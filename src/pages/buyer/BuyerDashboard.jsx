import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getMyOrders } from '../../services/orderService'


const BuyerDashboard = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetch = async () => {
            setLoading(true); setError('')
            try {
                const data = await getMyOrders(user?._id)

                setOrders(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('[BuyerDashboard] Error:', err)
                setError('Could not load orders. Please try again.')
                setOrders([])
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F' }}>Purchase History</h1>
                    <p style={{ color: '#888', marginBottom: '2.5rem' }}>
                        {user?.name ? `Welcome, ${user.name}` : user?.email}
                    </p>

                    {loading && <div style={emptyStyle}>Loading your orders...</div>}
                    {!loading && error && <div style={{ ...emptyStyle, color: '#dc2626' }}>⚠️ {error}</div>}

                    {!loading && !error && orders.length === 0 && (
                        <div style={emptyStyle}>No orders yet. Visit the Marketplace to start shopping.</div>
                    )}

                    {!loading && orders.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map((order, i) => (
                                <motion.div
                                    key={order._id || order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    style={cardStyle}
                                >
                                    <div>
                                        <span style={idBadge}>#{(order._id || order.id || '').slice(-8).toUpperCase()}</span>
                                        <h3 style={{ margin: '0.5rem 0 0.25rem', color: '#1E1E1E', fontWeight: 700 }}>
                                            {order.items?.map(i => i.product?.title || 'Product').join(', ') || order.title || 'Order'}
                                        </h3>
                                        <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
                                            {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#7C3E2F', margin: 0 }}>₹{order.totalPrice || order.total || order.price}</p>
                                        <span style={{ ...statusBadge, background: order.status === 'Delivered' ? '#dcfce7' : '#fef3c7', color: order.status === 'Delivered' ? '#16a34a' : '#d97706' }}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const cardStyle = { background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
const emptyStyle = { textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', color: '#888', fontSize: '1rem' }
const idBadge = { fontSize: '0.72rem', fontWeight: 700, color: '#D4AF37', background: '#FFF8E7', padding: '0.15rem 0.6rem', borderRadius: '999px', letterSpacing: '0.05em' }
const statusBadge = { display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '999px', marginTop: '0.35rem' }

export default BuyerDashboard
