import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ChefHat, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { currentTheme } = useTheme();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: PlusCircle, label: 'Add', path: '/ingest' },
        // { icon: ChefHat, label: 'Cook', path: '/cook' }, // Cooking mode is usually per recipe
        { icon: Settings, label: 'Settings', path: '/settings' }, // For theme switching demo
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-500">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20 p-4 max-w-md mx-auto w-full">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted/20 h-16 px-6 flex items-center justify-between z-50 shadow-lg max-w-md mx-auto w-full">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(path) ? 'text-primary' : 'text-muted'
                            }`}
                    >
                        <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
