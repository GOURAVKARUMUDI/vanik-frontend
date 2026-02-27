import { database } from '../firebase';
import { ref, set, get, update, remove } from 'firebase/database';

/**
 * Write or overwrite a user profile in Realtime Database.
 * Path: users/{uid}
 */
export const setUserProfile = async (uid, userData) => {
    await set(ref(database, `users/${uid}`), userData);
};

/**
 * Get a user profile by UID.
 * Path: users/{uid}
 */
export const getUserProfile = async (uid) => {
    const snapshot = await get(ref(database, `users/${uid}`));
    return snapshot.exists() ? snapshot.val() : null;
};

/**
 * Update partial fields of a user profile.
 * Path: users/{uid}
 */
export const updateUserProfile = async (uid, updates) => {
    await update(ref(database, `users/${uid}`), updates);
};

/**
 * Delete a user profile.
 * Path: users/{uid}
 */
export const deleteUserProfile = async (uid) => {
    await remove(ref(database, `users/${uid}`));
};
