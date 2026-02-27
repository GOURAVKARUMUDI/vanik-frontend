import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('vanik_cart')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('vanik_cart', JSON.stringify(cart))
    }, [cart])

    // Logout logic: Clear cart if user logs out
    useEffect(() => {
        if (!user) {
            setCart([])
            localStorage.removeItem('vanik_cart')
        }
    }, [user])

    const addToCart = (product) => {
        setCart(prev => [...prev, { ...product, cartId: Date.now() }])
    }

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId))
    }

    const clearCart = () => setCart([])

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used inside CartProvider')
    return ctx
}
