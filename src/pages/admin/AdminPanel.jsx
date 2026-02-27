import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { updateUserProfile } from '../../services/userDbService'
import { database } from '../../firebase'
import { ref, get, push, set } from 'firebase/database'

const AdminPanel = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const snapshot = await get(ref(database, 'users'))
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setUsers(Object.values(data))
                } else {
                    setUsers([])
                }
            } catch (e) {
                console.error('[AdminPanel] Failed to load users:', e)
                setUsers([])
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const changeRole = async (uid, newRole) => {
        try {
            await updateUserProfile(uid, { role: newRole })
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u))
        } catch (e) {
            alert('Failed to update role: ' + e.message)
        }
    }

    const approveSeller = async (uid) => {
        try {
            await updateUserProfile(uid, { approved: true })
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, approved: true } : u))
        } catch (e) {
            alert('Failed to approve seller: ' + e.message)
        }
    }

    const injectFakeData = async () => {
        const dummyProducts = [
            { title: 'Engineering Mathematics Vol 2', price: 450, category: 'Books', description: 'Almost brand new, used for one semester. No highlights inside.', seller: { name: 'Rahul S.', college: 'Main Campus', phone: '9876543210' }, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', status: 'Available', createdAt: Date.now() },
            { title: 'Scientific Calculator fx-991EX', price: 800, category: 'Electronics', description: 'Casio ClassWiz in perfect working condition. Solar powered.', seller: { name: 'Priya K.', college: 'North Campus', phone: '9876543211' }, image: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&w=400&q=80', status: 'Available', createdAt: Date.now() },
            { title: 'Drafting Table & Tools', price: 1200, category: 'Stationery', description: 'Full architecture drafting kit including mini drafter and A3 board.', seller: { name: 'Arjun M.', college: 'South Campus', phone: '9876543212' }, image: 'https://images.unsplash.com/photo-1611314986427-46dc02334816?auto=format&fit=crop&w=400&q=80', status: 'Available', createdAt: Date.now() },
            { title: 'Campus Hoodie (Size L)', price: 300, category: 'Apparel', description: 'Official university hoodie, dark blue. Washed and clean.', seller: { name: 'Sneha R.', college: 'Main Campus', phone: '9876543213' }, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80', status: 'Available', createdAt: Date.now() },
        ];

        try {
            for (const p of dummyProducts) {
                const newRef = push(ref(database, 'products'));
                await set(newRef, { ...p, id: newRef.key });
            }
            alert('4 Dummy Products injected successfully! Go check the Marketplace.');
        } catch (e) {
            alert('Failed to inject data: ' + e.message);
        }
    }

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3E2F', margin: 0 }}>System Oversight</h1>
                        <button onClick={injectFakeData} style={{ padding: '0.6rem 1.25rem', background: '#D4AF37', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                            + Inject Fake Products
                        </button>
                    </div>
                    <p style={{ color: '#888', marginBottom: '2.5rem' }}>Manage campus user roles and access levels.</p>

                    {loading && <div style={emptyStyle}>Loading users from Firebase...</div>}

                    {!loading && users.length === 0 ? (
                        <div style={emptyStyle}>No users found.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {users.map((u, i) => (
                                <motion.div
                                    key={u.uid || u.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={cardStyle}
                                >
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1E1E1E', fontWeight: 700 }}>{u.name}</h3>
                                        <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.85rem' }}>{u.email}</p>
                                        <p style={{ margin: '0.2rem 0 0', color: '#aaa', fontSize: '0.78rem' }}>
                                            {u.college} {u.phone && `• ${u.phone}`}
                                        </p>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ ...roleBadge, ...roleColor[u.role] }}>{(u.role || 'buyer').toUpperCase()}</span>
                                            {u.role === 'seller' && (
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: u.approved ? '#dcfce7' : '#fef3c7', color: u.approved ? '#166534' : '#92400e' }}>
                                                    {u.approved ? 'Approved' : 'Pending'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {u.role === 'seller' && !u.approved && (
                                            <button
                                                onClick={() => approveSeller(u.uid)}
                                                style={{ padding: '0.45rem 1rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginRight: '0.5rem' }}
                                            >
                                                ✓ Approve Seller
                                            </button>
                                        )}
                                        {['buyer', 'seller', 'admin'].map(r => (
                                            <button
                                                key={r}
                                                disabled={u.role === r}
                                                onClick={() => changeRole(u.uid, r)}
                                                style={{ ...roleBtn, opacity: u.role === r ? 0.4 : 1, background: u.role === r ? '#ccc' : '#7C3E2F' }}
                                            >
                                                → {r}
                                            </button>
                                        ))}
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
const emptyStyle = { textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', color: '#888' }
const roleBadge = { fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.7rem', borderRadius: '999px', letterSpacing: '0.08em' }
const roleColor = { buyer: { background: '#dbeafe', color: '#1d4ed8' }, seller: { background: '#FFF8E7', color: '#D4AF37' }, admin: { background: '#fee2e2', color: '#dc2626' } }
const roleBtn = { padding: '0.45rem 1rem', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }

export default AdminPanel
