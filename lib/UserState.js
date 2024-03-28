import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
const UserContext = createContext();
export const UserProvider = ({
  children
}) => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(() => {
    const storedUserData = localStorage.getItem('user');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const updateUser = newUserData => {
    if (newUserData) {
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = {
            id: firebaseUser.uid,
            name: userDoc.data().name,
            email: userDoc.data().email
          };
          updateUser(userData);
        } else {
          console.error("No user document found!");
          updateUser(null);
        }
      } else {
        updateUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);
  return <UserContext.Provider value={{
    user,
    updateUser
  }}>
            {children}
        </UserContext.Provider>;
};
export function useUser() {
  return useContext(UserContext);
}