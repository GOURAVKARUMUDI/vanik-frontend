import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyOrders } from '../../services/orderService'


const BuyerDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

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
        const interval = setInterval(fetch, 15000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>🛍️ Buyer Hub</h1>
                            <p style={{ color: '#888', margin: '0.25rem 0 0' }}>
                                Track your purchases and campus exchange status
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                                <p style={{ margin: 0, color: '#D4AF37', fontWeight: 700, fontSize: '0.9rem' }}>📍 {user?.campus}</p>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>{user?.city}</p>
                            </div>
                            <button onClick={() => navigate('/marketplace')} style={secondaryBtn}>Marketplace</button>
                            <button onClick={() => navigate('/cart')} style={primaryBtn}>My Cart</button>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div style={metricsRow}>
                        <div style={metricCard}>
                            <span style={metricValue}>₹{totalSpent}</span>
                            <span style={metricLabel}>Total Spent</span>
                        </div>
                        <div style={metricCard}>
                            <span style={metricValue}>{orders.length}</span>
                            <span style={metricLabel}>Orders Placed</span>
                        </div>
                        <div style={metricCard}>
                            <span style={metricValue}>{orders.filter(o => o.status === 'Delivered').length}</span>
                            <span style={metricLabel}>Items Received</span>
                        </div>
                    </div>

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
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#7C3E2F', margin: 0 }}>₹{order.totalPrice || order.total || order.price}</p>
                                            <span style={{ ...statusBadge, background: order.status === 'Delivered' ? '#dcfce7' : '#fef3c7', color: order.status === 'Delivered' ? '#16a34a' : '#d97706' }}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>
                                        {order.shippingAddress && (
                                            <div style={trackingBox}>
                                                <p style={trackingText}>📍 {order.campusDetails || 'Main Campus'}</p>
                                                <p style={{ ...trackingText, fontSize: '0.65rem', opacity: 0.7 }}>{order.shippingAddress}</p>
                                            </div>
                                        )}
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
const metricsRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }
const metricCard = { background: '#fff', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #7C3E2F' }
const metricValue = { fontSize: '1.8rem', fontWeight: 900, color: '#7C3E2F' }
const metricLabel = { fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginTop: '0.25rem' }
const cardStyle = { background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
const emptyStyle = { textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', color: '#888', fontSize: '1rem' }
const idBadge = { fontSize: '0.72rem', fontWeight: 700, color: '#D4AF37', background: '#FFF8E7', padding: '0.15rem 0.6rem', borderRadius: '999px', letterSpacing: '0.05em' }
const statusBadge = { display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '999px', marginTop: '0.35rem' }
const trackingBox = { background: '#f8f9fa', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', borderLeft: '3px solid #7C3E2F', textAlign: 'left', minWidth: '150px' }
const trackingText = { margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#444' }
const primaryBtn = { padding: '0.6rem 1.25rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }
const secondaryBtn = { padding: '0.6rem 1.25rem', background: 'transparent', color: '#7C3E2F', border: '2px solid #7C3E2F', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }

export default BuyerDashboard
