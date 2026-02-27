import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import ErrorBoundary from '../components/ErrorBoundary'
import AppRoutes from './routes'

console.log('[App] Root mounting')

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
