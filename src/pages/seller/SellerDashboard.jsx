import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getProducts, createProduct, deleteProduct } from '../../services/productService'

const SellerDashboard = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ title: '', price: '', category: 'Books', description: '' })
    const [image, setImage] = useState(null)

    // Fetch seller's own products by searching (or all and filter by seller)
    const fetchMyProducts = async () => {
        setLoading(true)
        try {
            const all = await getProducts()
            // Filter to only show products by this seller
            const mine = all.filter(p => p.sellerUid === user?._id || p.seller === user?._id)
            setProducts(Array.isArray(mine) ? mine : [])
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMyProducts() }, [])

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
            fd.append('type', 'sell')
            fd.append('sellerUid', user?._id || '')
            fd.append('sellerName', user?.name || user?.email || '')
            fd.append('image', image)
            await createProduct(fd)
            setForm({ title: '', price: '', category: 'Books', description: '' })
            setImage(null)
            await fetchMyProducts()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this listing?')) return
        try {
            await deleteProduct(id)
            setProducts(prev => prev.filter(p => (p.id || p._id) !== id))
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete.')
        }
    }

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>Seller Studio</h1>
                            <p style={{ color: '#888', margin: '0.5rem 0 0' }}>{user?.name || user?.email}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37', margin: 0 }}>{products.length}</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', margin: 0, textTransform: 'uppercase' }}>Listings</p>
                        </div>
                    </div>

                    {error && <div style={errorStyle}>{error}</div>}

                    {/* Add listing form */}
                    <form onSubmit={handleAdd} style={formStyle}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
                            <input name="title" placeholder="Product name *" value={form.title} onChange={handleChange} style={{ ...inputStyle, flex: 2, minWidth: '160px' }} />
                            <input name="price" type="number" placeholder="Price ₹ *" value={form.price} onChange={handleChange} style={{ ...inputStyle, width: '120px' }} />
                            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                                {['Books', 'Electronics', 'Apparel', 'Stationery', 'Other'].map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, flex: 2, minWidth: '200px' }} />
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ fontSize: '0.85rem', alignSelf: 'center' }} />
                        </div>
                        <button type="submit" disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>
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
                </motion.div>
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const formStyle = { background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '2px solid #eee', fontSize: '0.95rem', fontFamily: 'inherit' }
const primaryBtn = { padding: '0.75rem 1.75rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }
const cardStyle = { background: '#fff', borderRadius: '1rem', padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '5px solid #D4AF37', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
const catBadge = { fontSize: '0.7rem', fontWeight: 700, background: '#FFF8E7', color: '#D4AF37', padding: '0.1rem 0.5rem', borderRadius: '999px' }
const deleteBtn = { padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }
const emptyStyle = { textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '1rem', color: '#888' }
const errorStyle = { background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }

export default SellerDashboard
