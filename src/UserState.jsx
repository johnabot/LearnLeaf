// @flow
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const auth = getAuth();
    const db = getFirestore();

    // Initialize user state from localStorage
    const [user, setUser] = useState(() => {
        const storedUserData = localStorage.getItem('user');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    // Enhanced setUser to manage localStorage
    const updateUser = (newUserData) => {
        if (newUserData) {
            // Update user state and localStorage
            setUser(newUserData);
            localStorage.setItem('user', JSON.stringify(newUserData));
        } else {
            // Clear user state and localStorage
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = {
                        id: firebaseUser.uid,
                        name: userDoc.data().name,
                        email: userDoc.data().email,
                        password: userDoc.data().password,
                        timeFormat: userDoc.data().timeFormat || '12h',
                        dateFormat: userDoc.data().dateFormat || 'MM/DD/YYYY',
                        theme: userDoc.data().theme || 'light',
                        notifications: userDoc.data().notifications || false,
                        notificationsFrequency: userDoc.data().notificationsFrequency || [true, false, false, false]
                    };
                    updateUser(userData);
                } else {
                    console.error("No user document found!");
                    updateUser(null); // Ensure state and localStorage are cleared if Firestore doc is missing
                }
            } else {
                updateUser(null); // Clear state and localStorage on sign-out
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [auth, db]); // Removed updateUser from the dependency array to avoid re-creating the effect unnecessarily

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
    
};

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}