import api from '../api/axios.js';

/**
 * Get all products, with optional client-side search/category filter.
 */
export const getProducts = async (filters = {}) => {
    try { console.log('FETCHING PRODUCTS...');
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await api.get(`/api/products?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch products';
    }
};

/**
 * Get a single product by its ID.
 */
export const getProductById = async (id) => {
    try { console.log('FETCHING PRODUCTS...');
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch product';
    }
};

/**
 * Create a new product listing. Accepts a FormData because of image uploads.
 */
export const createProduct = async (formData) => {
    try { console.log('FETCHING PRODUCTS...');
        const response = await api.post('/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || 'Failed to create product';
    }
};

/**
 * Delete a product by its ID.
 */
export const deleteProduct = async (id) => {
    try { console.log('FETCHING PRODUCTS...');
        const response = await api.delete(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete product';
    }
};

/**
 * Update a product by its ID.
 */
export const updateProduct = async (id, data) => {
    try { console.log('FETCHING PRODUCTS...');
        // Assume data could be FormData or JSON based on whether image is updated
        let headers = {};
        if (data instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.put(`/api/products/${id}`, data, { headers });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update product';
    }
};
