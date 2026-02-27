import { database } from '../firebase';
import { ref, push, get, set, update, remove } from 'firebase/database';

/**
 * Create a new product.
 * Path: products/{productId}
 * Returns the generated productId.
 */
export const createProductDb = async (productData) => {
    const productsRef = ref(database, 'products');
    const newRef = push(productsRef);
    await set(newRef, { ...productData, id: newRef.key });
    return newRef.key;
};

/**
 * Get all products.
 * Path: products
 */
export const getAllProductsDb = async () => {
    const snapshot = await get(ref(database, 'products'));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.values(data);
};

/**
 * Get a single product by ID.
 * Path: products/{productId}
 */
export const getProductByIdDb = async (productId) => {
    const snapshot = await get(ref(database, `products/${productId}`));
    return snapshot.exists() ? snapshot.val() : null;
};

/**
 * Update a product.
 * Path: products/{productId}
 */
export const updateProductDb = async (productId, updates) => {
    await update(ref(database, `products/${productId}`), updates);
};

/**
 * Delete a product.
 * Path: products/{productId}
 */
export const deleteProductDb = async (productId) => {
    await remove(ref(database, `products/${productId}`));
};
