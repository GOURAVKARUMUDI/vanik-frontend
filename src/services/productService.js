import {
    createProductDb,
    getAllProductsDb,
    getProductByIdDb,
    updateProductDb,
    deleteProductDb,
} from './productDbService'

/**
 * Get all products, with optional client-side search/category filter.
 */
export const getProducts = async (filters = {}) => {
    const all = await getAllProductsDb()
    let result = all
    if (filters.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(
            (p) =>
                p.title?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
        )
    }
    if (filters.category) {
        result = result.filter((p) => p.category === filters.category)
    }
    if (filters.minPrice) {
        result = result.filter((p) => Number(p.price) >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
        result = result.filter((p) => Number(p.price) <= Number(filters.maxPrice))
    }
    return result
}

/**
 * Get a single product by its RTDB key.
 */
export const getProductById = async (id) => {
    return await getProductByIdDb(id)
}

/**
 * Create a new product listing. Accepts a FormData or plain object.
 * Images are stored in Firebase Storage separately (imageUrl is stored as a string).
 */
export const createProduct = async (formDataOrObj) => {
    let data = {}
    if (formDataOrObj instanceof FormData) {
        for (const [key, val] of formDataOrObj.entries()) {
            if (key !== 'image') data[key] = val
        }
    } else {
        data = { ...formDataOrObj }
    }
    data.status = 'Available'
    data.createdAt = Date.now()
    const productId = await createProductDb(data)
    return { id: productId, ...data }
}

/**
 * Delete a product by its RTDB key.
 */
export const deleteProduct = async (id) => {
    await deleteProductDb(id)
    return { success: true }
}

/**
 * Update a product by its RTDB key.
 */
export const updateProduct = async (id, updates) => {
    let data = {}
    if (updates instanceof FormData) {
        for (const [key, val] of updates.entries()) {
            if (key !== 'image') data[key] = val
        }
    } else {
        data = { ...updates }
    }
    await updateProductDb(id, data)
    return { id, ...data }
}
