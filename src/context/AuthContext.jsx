import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = [
    { id: 'user_1', name: 'Chef Gabe', email: 'gabe@example.com', avatar: '👨‍🍳' },
    { id: 'user_2', name: 'Mom', email: 'mom@example.com', avatar: '👵' },
    { id: 'user_3', name: 'Roommate', email: 'roomie@example.com', avatar: '🧢' },
    { id: 'user_4', name: 'Bestie', email: 'bestie@example.com', avatar: '✨' },
];

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users] = useState(MOCK_USERS);

    useEffect(() => {
        // Load user from local storage or default to first user
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        } else {
            login(MOCK_USERS[0].id);
        }
    }, []);

    const login = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('current_user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, users, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
