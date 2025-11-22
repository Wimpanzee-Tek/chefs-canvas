import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChefHat, Flower2, Leaf, BookOpen, UtensilsCrossed } from 'lucide-react';

const ThemeHeader = ({ title }) => {
    const { currentTheme } = useTheme();

    const getThemeIcon = () => {
        switch (currentTheme) {
            case 'theme-rustic':
                return <UtensilsCrossed className="w-12 h-12 text-primary" strokeWidth={1.5} />;
            case 'theme-modern':
                return <ChefHat className="w-12 h-12 text-primary" strokeWidth={1.5} />;
            case 'theme-grandma':
                return <Flower2 className="w-12 h-12 text-primary" strokeWidth={1.5} />;
            case 'theme-zen':
                return <Leaf className="w-12 h-12 text-primary" strokeWidth={1.5} />;
            case 'theme-dark-academia':
                return <BookOpen className="w-12 h-12 text-primary" strokeWidth={1.5} />;
            default:
                return <ChefHat className="w-12 h-12 text-primary" strokeWidth={1.5} />;
        }
    };

    const getDecorativeElements = () => {
        switch (currentTheme) {
            case 'theme-rustic':
                return (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                        <div className="absolute top-2 right-4 text-6xl">🌾</div>
                        <div className="absolute bottom-2 left-4 text-5xl">🥖</div>
                    </div>
                );
            case 'theme-grandma':
                return (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-0 right-8 text-6xl">🌸</div>
                        <div className="absolute top-4 left-8 text-5xl">🌺</div>
                        <div className="absolute bottom-2 right-12 text-4xl">💐</div>
                    </div>
                );
            case 'theme-zen':
                return (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                        <div className="absolute top-4 right-8 text-6xl">🎋</div>
                        <div className="absolute bottom-4 left-8 text-5xl">🍃</div>
                    </div>
                );
            case 'theme-dark-academia':
                return (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                        <div className="absolute top-2 right-8 text-5xl">📚</div>
                        <div className="absolute bottom-2 left-8 text-4xl">🕯️</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative text-center space-y-3 py-6">
            {getDecorativeElements()}
            <div className="relative z-10 flex flex-col items-center gap-3">
                {getThemeIcon()}
                <h1 className="text-4xl font-secondary font-bold text-primary">
                    {title}
                </h1>
            </div>

            {/* Theme-specific decorative border */}
            {currentTheme === 'theme-rustic' && (
                <div className="mt-4 flex justify-center gap-2">
                    <div className="w-8 h-0.5 bg-primary opacity-50"></div>
                    <div className="w-2 h-2 rounded-full bg-primary opacity-50"></div>
                    <div className="w-8 h-0.5 bg-primary opacity-50"></div>
                </div>
            )}

            {currentTheme === 'theme-grandma' && (
                <div className="mt-4 flex justify-center gap-1 text-primary opacity-40">
                    <span>✿</span>
                    <span>❀</span>
                    <span>✿</span>
                    <span>❀</span>
                    <span>✿</span>
                </div>
            )}

            {currentTheme === 'theme-dark-academia' && (
                <div className="mt-4">
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                </div>
            )}
        </div>
    );
};

export default ThemeHeader;
