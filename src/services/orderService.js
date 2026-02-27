import {
    createOrderDb,
    getOrdersByUserDb,
    getAllOrdersDb,
    updateOrderDb,
} from './orderDbService'

/**
 * Create a new order. cartItems = [{ id, title, price }]
 * uid is the Firebase Auth UID of the buyer.
 */
export const createOrder = async (cartItems, uid) => {
    const items = cartItems.map((item) => ({
        productId: item.id || item._id,
        title: item.title || 'Product',
        price: item.price,
        quantity: 1,
    }))
    const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    const orderData = {
        uid: uid || null,
        items,
        totalPrice: total,
        status: 'Pending',
        createdAt: Date.now(),
    }
    const orderId = await createOrderDb(orderData)
    return { id: orderId, ...orderData }
}

/**
 * Get orders for the currently logged-in user.
 * uid = Firebase Auth UID
 */
export const getMyOrders = async (uid) => {
    if (!uid) return []
    return await getOrdersByUserDb(uid)
}

/**
 * Get all orders (admin use).
 */
export const getAllOrders = async () => {
    return await getAllOrdersDb()
}

/**
 * Update order status.
 */
export const updateOrderStatus = async (id, status) => {
    await updateOrderDb(id, { status })
    return { id, status }
}
