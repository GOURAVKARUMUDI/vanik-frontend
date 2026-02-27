import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getProducts } from '../services/productService'
import { seedProductsIfEmpty } from '../services/seedService'

const Marketplace = () => {
    const { user } = useAuth()
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [nearMe, setNearMe] = useState(false)

    const fetchProducts = async () => {
        setLoading(true); setError('')
        try {
            const data = await getProducts({ search, category })
            setProducts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('[Marketplace] Fetch error:', err)
            setError(`Could not load products: ${err.message}`)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        seedProductsIfEmpty().then(() => fetchProducts())

        // Polling for marketplace updates every 30 seconds
        const interval = setInterval(fetchProducts, 30000)
        return () => clearInterval(interval)
    }, [search, category])

    const displayedProducts = nearMe && user?.campus
        ? products.filter(p => p.campus?.toLowerCase() === user.campus.toLowerCase())
        : products

    const handleBuy = (product) => {
        if (!user) { navigate('/login'); return }
        addToCart(product)
        navigate('/cart')
    }

    const imageUrl = (img) => {
        if (!img) return null
        if (img.startsWith('http')) return img
        return `http://localhost:5001${img}`
    }

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F' }}>Marketplace</h1>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0 2.5rem', flexWrap: 'wrap' }}>
                        <input
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '2px solid #eee', flex: 1, minWidth: '200px', fontFamily: 'inherit' }}
                        />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '2px solid #eee', fontFamily: 'inherit' }}
                        >
                            <option value="">All Categories</option>
                            {['Books', 'Electronics', 'Apparel', 'Stationery', 'Other'].map(c => <option key={c}>{c}</option>)}
                        </select>
                        {user && (
                            <button
                                onClick={() => setNearMe(!nearMe)}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '0.6rem',
                                    border: '2px solid #7C3E2F',
                                    background: nearMe ? '#7C3E2F' : 'transparent',
                                    color: nearMe ? '#fff' : '#7C3E2F',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {nearMe ? '📍 Near Me: ON' : '📍 Show All Campus'}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* States */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #7C3E2F', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                        Loading products...
                    </div>
                )}

                {!loading && error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && displayedProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', color: '#888' }}>
                        No products found {nearMe && 'near your campus'}. {user?.role === 'seller' && <span>Be the first to <span onClick={() => navigate('/seller-dashboard')} style={{ color: '#7C3E2F', cursor: 'pointer', fontWeight: 700 }}>list something!</span></span>}
                    </div>
                )}

                {!loading && displayedProducts.length > 0 && (
                    <div style={gridStyle}>
                        {displayedProducts.map((product, i) => (
                            <motion.div
                                key={product.id || product._id}

                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
                                style={cardStyle}
                            >
                                {imageUrl(product.image) && (
                                    <img
                                        src={imageUrl(product.image)}
                                        alt={product.title}
                                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1rem' }}
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={categoryBadge}>{product.category}</span>
                                        <span style={campusTag}>{product.campus || 'Main Campus'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1E1E', margin: '0.5rem 0 0.25rem' }}>{product.title}</h3>
                                    {product.description && <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 0.5rem' }}>{product.description.slice(0, 80)}{product.description.length > 80 ? '…' : ''}</p>}
                                    {product.seller?.name && <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>by {product.seller.name} · {product.seller.college}</p>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7C3E2F' }}>₹{product.price}</span>
                                    <button onClick={() => handleBuy(product)} style={buyBtnStyle}>
                                        {user ? 'Add to Cart' : 'Login to Buy'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const pageStyle = { minHeight: '100vh', background: '#F5F3EF', padding: '4rem 2rem', fontFamily: "'Poppins', sans-serif" }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }
const cardStyle = { background: '#fff', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.2s ease' }
const categoryBadge = { background: '#FFF8E7', color: '#D4AF37', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }
const campusTag = { background: '#f3f4f6', color: '#666', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }
const buyBtnStyle = { padding: '0.6rem 1.25rem', background: '#7C3E2F', color: '#fff', border: 'none', borderRadius: '0.6rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }

export default Marketplace
