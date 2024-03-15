import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Your login logic
    };

    const updateUser = (newUserInfo) => {
        setUser(newUserInfo);
    };

    return (
        <UserContext.Provider value={{ user, login, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

