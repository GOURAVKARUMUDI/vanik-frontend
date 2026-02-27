import api from '../api/axios.js';

/**
 * Create a new order. cartItems = [{ id, title, price }]
 * type = 'buy' | 'rent'
 */
export const createOrder = async (cartItems, uid, type = 'buy') => {
    try {
        // The backend expects single product transactions per order payload currently based on the controller.
        // We will loop and create orders for each item if there are multiple.
        const orderPromises = cartItems.map(item => {
            const orderData = {
                product: item.id || item._id,
                type: type,
                totalPrice: Number(item.price),
                // Add rental dates if needed in the UI
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
