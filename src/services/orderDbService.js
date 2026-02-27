import { database } from '../firebase';
import { ref, push, get, set, update, remove } from 'firebase/database';

/**
 * Create a new order.
 * Path: orders/{orderId}
 * Returns the generated orderId.
 */
export const createOrderDb = async (orderData) => {
    const ordersRef = ref(database, 'orders');
    const newRef = push(ordersRef);
    await set(newRef, { ...orderData, id: newRef.key });
    return newRef.key;
};

/**
 * Get all orders.
 * Path: orders
 */
export const getAllOrdersDb = async () => {
    const snapshot = await get(ref(database, 'orders'));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.values(data);
};

/**
 * Get a single order by ID.
 * Path: orders/{orderId}
 */
export const getOrderByIdDb = async (orderId) => {
    const snapshot = await get(ref(database, `orders/${orderId}`));
    return snapshot.exists() ? snapshot.val() : null;
};

/**
 * Get all orders belonging to a specific user (by uid).
 * Path: orders (filtered client-side by uid)
 */
export const getOrdersByUserDb = async (uid) => {
    const all = await getAllOrdersDb();
    return all.filter((o) => o.uid === uid);
};

/**
 * Update an order (e.g. status).
 * Path: orders/{orderId}
 */
export const updateOrderDb = async (orderId, updates) => {
    await update(ref(database, `orders/${orderId}`), updates);
};

/**
 * Delete an order.
 * Path: orders/{orderId}
 */
export const deleteOrderDb = async (orderId) => {
    await remove(ref(database, `orders/${orderId}`));
};
