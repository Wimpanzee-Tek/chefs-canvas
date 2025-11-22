import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    RUSTIC: 'theme-rustic',
    MODERN: 'theme-modern',
    GRANDMA: 'theme-grandma',
    ZEN: 'theme-zen',
    DARK_ACADEMIA: 'theme-dark-academia',
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(THEMES.MODERN);

    useEffect(() => {
        // Remove all theme classes
        Object.values(THEMES).forEach(theme => {
            document.documentElement.classList.remove(theme);
        });
        // Add current theme class
        document.documentElement.classList.add(currentTheme);
    }, [currentTheme]);

    const switchTheme = (themeId) => {
        if (Object.values(THEMES).includes(themeId)) {
            setCurrentTheme(themeId);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, switchTheme, THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
