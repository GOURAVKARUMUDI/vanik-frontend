import api from '../api/axios.js';

/**
 * Create a new order. cartItems = [{ id, title, price }]
 * type = 'buy' | 'rent'
 */
export const createOrder = async (cartItems, user, shipping = {}, type = 'buy') => {
    try {
        const orderPromises = cartItems.map(item => {
            // Calculate delivery fee for this item
            const deliveryFee = (user?.campus && item?.campus && item.campus.toLowerCase() !== user.campus.toLowerCase()) ? 50 : 0

            const orderData = {
                product: item.id || item._id,
                type: type,
                totalPrice: Number(item.price) + deliveryFee,
                shippingAddress: shipping.address || '',
                campusDetails: shipping.campus || '',
                rentalStartDate: null,
                rentalEndDate: null
            };
            return api.post('/api/orders', orderData);
        });

        // Wait for all items to be processed
        const responses = await Promise.all(orderPromises);

        // Return the first created order as a proxy for success, or combine them
        return responses.length > 0 ? responses[0].data : { success: true };
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create order';
    }
};

/**
 * Get orders for the currently logged-in user.
 */
export const getMyOrders = async (uid) => {
    try {
        const response = await api.get('/api/orders/my');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch your orders';
    }
};

/**
 * Update order status.
 */
export const updateOrderStatus = async (id, status) => {
    try {
        const response = await api.put(`/api/orders/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update order status';
    }
};
