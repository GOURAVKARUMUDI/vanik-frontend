import { database } from '../firebase'
import { ref, get, set, push } from 'firebase/database'
import { mockProducts } from './mockData'

/**
 * Seeds the RTDB with mock products if the products node is empty.
 */
export const seedProductsIfEmpty = async () => {
    try {
        const productsRef = ref(database, 'products')
        const snapshot = await get(productsRef)

        if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
            console.log('[Seed] Seeding mock products to RTDB...')

            for (const product of mockProducts) {
                const newRef = push(productsRef)
                const data = {
                    ...product,
                    id: newRef.key,
                    _id: newRef.key, // Consistency
                    image: product.image || `https://picsum.photos/seed/${product.id}/400/300`,
                    status: 'Available',
                    createdAt: Date.now(),
                    // Fix seller structure to match what Marketplace expects
                    seller: {
                        name: product.seller,
                        college: product.region || 'Campus',
                        uid: 'mock-seller-id'
                    }
                }
                await set(newRef, data)
            }
            console.log('[Seed] Seeding complete.')
        } else {
            console.log('[Seed] Products already exist in RTDB. Skipping.')
        }
    } catch (err) {
        console.error('[Seed] Error seeding products:', err)
    }
}
