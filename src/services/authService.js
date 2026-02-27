import { auth } from '../firebase';
import { database } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    sendEmailVerification,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

/**
 * Register a new user with Firebase Auth + save profile to RTDB users/{uid}
 */
export const registerUser = async ({ name, email, password, college, role }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = credential.user;

    // Update Firebase Auth display name
    await updateProfile(credential.user, { displayName: name });

    // Send email verification
    await sendEmailVerification(credential.user);

    // Save full profile to Realtime Database
    const profile = {
        uid,
        name,
        email,
        college: college || 'Campus',
        role: role || 'buyer',
        profileComplete: false,
        approved: role === 'buyer' ? true : false,
        createdAt: Date.now(),
    };
    await set(ref(database, `users/${uid}`), profile);

    return { _id: uid, ...profile };
};

/**
 * Login an existing user with Firebase Auth + fetch profile from RTDB users/{uid}
 */
export const loginUser = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const { uid, emailVerified } = credential.user;

    if (!emailVerified) {
        // We throw a custom error object to let the UI know we need verification
        const error = new Error('Please verify your email before continuing.');
        error.code = 'auth/unverified-email';
        error.user = credential.user;
        throw error;
    }

    // Fetch role & profile from Realtime Database
    const snapshot = await get(ref(database, `users/${uid}`));
    if (!snapshot.exists()) {
        throw new Error('User profile not found. Please re-register.');
    }
    const profile = snapshot.val();
    return { _id: uid, ...profile };
};

/**
 * Login or Register with Google using Popup
 */
export const loginWithGoogle = async (auth, googleProvider) => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const { uid, displayName, email } = user;

    // Check if user exists in Realtime Database
    const snapshot = await get(ref(database, `users/${uid}`));

    if (!snapshot.exists()) {
        // Return minimal google user info and flag as new. Do NOT auto-save profile.
        return {
            _id: uid,
            name: displayName || 'Google User',
            email,
            isNewUser: true,
        };
    }

    // User exists, return profile
    return { _id: uid, ...snapshot.val() };
};

