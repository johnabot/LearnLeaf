import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const db = getFirestore();

    // Correctly define updateUser function outside of useEffect
    const updateUser = (newUserData) => {
        setUser(newUserData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch additional details from Firestore
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUser({
                        id: firebaseUser.uid, // Include the user's ID
                        name: userDoc.data().name,
                        email: userDoc.data().email
                    });
                } else {
                    // Handle case where user is authenticated but doesn't have a Firestore document
                    console.error("No user document found!");
                }
            } else {
                // User is signed out
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [auth, db]);

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    return useContext(UserContext);
}
