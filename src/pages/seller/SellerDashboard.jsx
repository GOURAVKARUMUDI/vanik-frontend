import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getProducts, createProduct, deleteProduct } from '../../services/productService'
import { getMyOrders } from '../../services/orderService'

const SellerDashboard = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        price: '',
        category: 'Books',
        description: '',
        type: 'sell',
        kind: 'Used',
        area: '',
        campus: user?.campus || ''
    })
    const [image, setImage] = useState(null)

    // Fetch seller's own products by searching (or all and filter by seller)
    const fetchData = async () => {
        setLoading(true)
        try {
            const [allProducts, myOrders] = await Promise.all([
                getProducts({ status: 'all' }),
                getMyOrders()
            ])
            const mine = allProducts.filter(p => p.seller?.uid === user?._id || p.sellerUid === user?._id || p.seller === user?._id)
            setProducts(mine)
            setOrders(myOrders)
        } catch (err) {
            console.error('[SellerDashboard] Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 15000)
        return () => clearInterval(interval)
    }, [])

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.price) { setError('Title and price are required.'); return }
        if (!image) { setError('Please select a product image.'); return }
        setError(''); setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('title', form.title)
            fd.append('price', form.price)
            fd.append('category', form.category)
            fd.append('description', form.description)
            fd.append('type', form.type)
            fd.append('kind', form.kind)
            fd.append('area', form.area)
            fd.append('campus', form.campus)
            fd.append('image', image)

            await createProduct(fd)
            setForm({
                title: '', price: '', category: 'Books', description: '',
                type: 'sell', kind: 'Used', area: '', campus: user?.campus || ''
            })
            setImage(null)
            await fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        const reason = window.prompt('Please enter the reason for deleting this listing:')
        if (reason === null) return // Canceled
        if (!reason.trim()) { alert('Delete reason is required.'); return }

        try {
            await deleteProduct(id)
            setProducts(prev => prev.filter(p => (p.id || p._id) !== id))
            alert(`Listing removed. Reason: ${reason}`)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete.')
        }
    }

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>📦 Seller Panel</h1>
                            <p style={{ color: '#888', margin: '0.25rem 0 0' }}>Manage your inventory and fulfill campus orders</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, color: '#D4AF37', fontWeight: 700 }}>📍 {user?.campus}</p>
                            <span style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600 }}>REAL-TIME SYNC ACTIVE</span>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div style={metricsRow}>
                        <div style={metricCard}>
                            <span style={metricValue}>₹{products.filter(p => p.status === 'Sold').reduce((sum, p) => sum + (p.price || 0), 0)}</span>
                            <span style={metricLabel}>Total Revenue</span>
                        </div>
                        <div style={metricCard}>
                            <span style={metricValue}>{products.filter(p => p.status === 'Sold').length}</span>
                            <span style={metricLabel}>Items Sold</span>
                        </div>
                        <div style={metricCard}>
                            <span style={metricValue}>{products.filter(p => p.status === 'Available').length}</span>
                            <span style={metricLabel}>Current Items</span>
                        </div>
                        <div style={metricCard}>
                            <span style={metricValue}>{orders.length}</span>
                            <span style={metricLabel}>Total Orders</span>
                        </div>
                    </div>

                    {error && <div style={errorStyle}>{error}</div>}

                    {/* Add listing form */}
                    <form onSubmit={handleAdd} style={formStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
                            <input name="title" placeholder="Product name *" value={form.title} onChange={handleChange} style={inputStyle} />
                            <input name="price" type="number" placeholder="Price ₹ *" value={form.price} onChange={handleChange} style={inputStyle} />
                            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                                {['Books', 'Electronics', 'Apparel', 'Stationery', 'Other'].map(c => <option key={c}>{c}</option>)}
                            </select>
                            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                                <option value="sell">For Sale</option>
                                <option value="rent">For Rent</option>
                            </select>
                            <select name="kind" value={form.kind} onChange={handleChange} style={inputStyle}>
                                <option value="New">Brand New</option>
                                <option value="Used">Second Hand</option>
                            </select>
                            <input name="area" placeholder="Area (e.g. Block B)" value={form.area} onChange={handleChange} style={inputStyle} />
                            <input name="campus" placeholder="Campus *" value={form.campus} onChange={handleChange} style={inputStyle} />
                            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: '#666' }}>Product Photo:</label>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ fontSize: '0.85rem' }} />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting} style={{ ...primaryBtn, marginTop: '1rem', width: '100%', opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? 'Posting...' : 'Post Listing'}
                        </button>
                    </form>

                    {/* Listings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                        {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading listings...</div>}
                        <AnimatePresence>
                            {products.map(p => (
                                <motion.div key={p.id || p._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={cardStyle}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {p.imageUrl && (
                                            <img src={p.imageUrl} alt={p.title} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                        )}
                                        <div>
                                            <span style={catBadge}>{p.category}</span>
                                            <h3 style={{ margin: '0.3rem 0 0', color: '#1E1E1E', fontWeight: 700 }}>{p.title}</h3>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#7C3E2F' }}>₹{p.price}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: p.status === 'Available' ? '#dcfce7' : '#fef3c7', color: p.status === 'Available' ? '#16a34a' : '#d97706', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{p.status || 'Available'}</span>
                                        <button onClick={() => handleDelete(p.id || p._id)} style={deleteBtn}>Delete</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {!loading && products.length === 0 && <div style={emptyStyle}>No listings yet. Use the form above to create one.</div>}
                    </div>

                    {/* Orders to Send */}
                    <div style={{ marginTop: '3rem' }}>
                        <h2 style={{ color: '#7C3E2F', fontWeight: 900, marginBottom: '1.5rem' }}>Orders to Send</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.filter(o => o.status === 'Pending').length === 0 ? (
                                <div style={emptyStyle}>No pending orders to fulfill.</div>
                            ) : (
                                orders.filter(o => o.status === 'Pending').map(order => (
                                    <motion.div key={order.id} style={orderCard}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 0.5rem', color: '#1E1E1E' }}>{order.product?.title || 'Unknown Product'}</h4>
                                            <div style={shippingInfo}>
                                                <p style={shippingTitle}>📦 Shipping To:</p>
                                                <p style={shippingDetail}><strong>Address:</strong> {order.shippingAddress || 'Not provided'}</p>
                                                <p style={shippingDetail}><strong>Campus:</strong> {order.campusDetails || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 900, fontSize: '1.2rem', color: '#7C3E2F', margin: '0 0 0.5rem' }}>₹{order.totalPrice}</p>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Mark this order as Delivered?')) {
                                                        try {
                                                            await updateOrderStatus(order.id, 'Delivered')
                                                            await fetchData()
                                                        } catch (err) {
                                                            alert('Failed to update status.')
                                                        }
                                                    }
                                                }}
                                                style={deliverBtn}
                                            >
                                                Mark Delivered
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const metricsRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }
const metricCard = { background: '#fff', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderBottom: '4px solid #D4AF37' }
const metricValue = { fontSize: '1.8rem', fontWeight: 900, color: '#7C3E2F' }
const metricLabel = { fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginTop: '0.25rem' }
const formStyle = { background: '#fff', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '2px solid #eee', fontSize: '0.95rem', fontFamily: 'inherit', width: '100%' }
const primaryBtn = { padding: '0.8rem 2rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }
const cardStyle = { background: '#fff', borderRadius: '1rem', padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '5px solid #D4AF37', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
const catBadge = { fontSize: '0.7rem', fontWeight: 700, background: '#FFF8E7', color: '#D4AF37', padding: '0.1rem 0.5rem', borderRadius: '999px' }
const deleteBtn = { padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }
const emptyStyle = { textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '1rem', color: '#888' }
const orderCard = { background: '#fff', borderRadius: '1rem', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #16a34a' }
const shippingInfo = { background: '#f8f9fa', padding: '1rem', borderRadius: '0.75rem', marginTop: '0.5rem' }
const shippingTitle = { margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 800, color: '#7C3E2F', textTransform: 'uppercase' }
const shippingDetail = { margin: '0.2rem 0', fontSize: '0.85rem', color: '#555' }
const deliverBtn = { padding: '0.5rem 1rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }
const errorStyle = { background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', width: '100%', textAlign: 'center' }

export default SellerDashboard
