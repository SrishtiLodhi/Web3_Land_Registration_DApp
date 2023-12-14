import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Initialize state from localStorage or set to false if not present
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    });

    const onLogin = () => {
        setIsLoggedIn(true);
    };

    const onLogout = () => {
        setIsLoggedIn(false);
    };

    // Save isLoggedIn to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, onLogin, onLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
