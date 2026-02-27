import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoleProtected from '../components/RoleProtected'

// Pages
import Entrance from '../pages/Entrance'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Marketplace from '../pages/Marketplace'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import BuyerDashboard from '../pages/buyer/BuyerDashboard'
import SellerDashboard from '../pages/seller/SellerDashboard'
import AdminPanel from '../pages/admin/AdminPanel'

// Onboarding
import SelectRole from '../pages/onboarding/SelectRole'
import CompleteProfile from '../pages/onboarding/CompleteProfile'
import WaitingApproval from '../pages/onboarding/WaitingApproval'

// Layout wrapper for pages with Navbar and Footer
const WithNav = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
            {children}
        </div>
        <Footer />
    </div>
)

const AppRoutes = () => (
    <Routes>
        {/* No Navbar */}
        <Route path="/" element={<Entrance />} />

        {/* With Navbar */}
        <Route path="/home" element={<WithNav><Home /></WithNav>} />
        <Route path="/marketplace" element={<WithNav><Marketplace /></WithNav>} />
        <Route path="/login" element={<WithNav><Login /></WithNav>} />
        <Route path="/register" element={<WithNav><Register /></WithNav>} />
        <Route path="/cart" element={<WithNav><Cart /></WithNav>} />

        {/* Onboarding */}
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/waiting-approval" element={<WaitingApproval />} />

        {/* Role Protected */}
        <Route path="/checkout" element={<WithNav><RoleProtected requiredRole="buyer"><Checkout /></RoleProtected></WithNav>} />
        <Route path="/buyer-dashboard" element={<WithNav><RoleProtected requiredRole="buyer"><BuyerDashboard /></RoleProtected></WithNav>} />
        <Route path="/seller-dashboard" element={<WithNav><RoleProtected requiredRole="seller"><SellerDashboard /></RoleProtected></WithNav>} />
        <Route path="/admin" element={<WithNav><RoleProtected requiredRole="admin"><AdminPanel /></RoleProtected></WithNav>} />

        {/* Wildcard */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
)

export default AppRoutes
