import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { firebaseConfig } from './config.js';
import { getDefaultMenu } from './ui.js';

// --- INITIALIZATION ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = firebaseConfig.appId;

/**
 * Sets up a real-time listener for the menu data.
 * @param {Function} onDataUpdate - The callback function to run when data changes.
 */
export function setupRealtimeListener(onDataUpdate) {
    const menuDocRef = doc(db, `artifacts/${appId}/public/data/menu`, 'weeklyMenu');
    onSnapshot(menuDocRef, async (docSnap) => {
        let data;
        if (docSnap.exists()) {
            data = docSnap.data();
        } else {
            console.log("No menu doc found, creating a default one.");
            data = getDefaultMenu();
            await setDoc(menuDocRef, data);
        }
        onDataUpdate(data);
    }, (error) => {
        console.error("Firestore listener failed:", error);
        onDataUpdate(getDefaultMenu()); // Fallback to default on error
    });
}

/**
 * Saves the entire menu object to Firestore.
 * @param {object} menuToSave - The complete menu data object.
 * @returns {Promise<boolean>} - True if save was successful, false otherwise.
 */
export async function saveMenu(menuToSave) {
    try {
        const menuDocRef = doc(db, `artifacts/${appId}/public/data/menu`, 'weeklyMenu');
        await setDoc(menuDocRef, menuToSave);
        return true;
    } catch (error) {
        console.error("Error saving menu:", error);
        return false;
    }
}

/**
 * Signs in a user with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export function handleSignIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export function handleSignOut() {
    return signOut(auth);
}

/**
 * Listens for changes in the authentication state.
 * @param {Function} onAuthStateChangeCallback - The callback to run when the auth state changes.
 */
export function onAuthChange(onAuthStateChangeCallback) {
    return onAuthStateChanged(auth, onAuthStateChangeCallback);
}
