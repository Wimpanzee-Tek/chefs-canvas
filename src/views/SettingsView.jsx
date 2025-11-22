import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsView = () => {
    const { currentTheme, switchTheme } = useTheme();
    const navigate = useNavigate();

    const themeOptions = [
        {
            id: THEMES.RUSTIC,
            name: 'Rustic Farmhouse',
            description: 'Warm, earthy, textured parchment',
            emoji: '🌾'
        },
        {
            id: THEMES.MODERN,
            name: 'Clean Modern',
            description: 'Airy, crisp, glassmorphism',
            emoji: '✨'
        },
        {
            id: THEMES.GRANDMA,
            name: "Grandma's Scrapbook",
            description: 'Nostalgic, chaotic, cozy',
            emoji: '🌸'
        },
        {
            id: THEMES.ZEN,
            name: 'Zen Minimalist',
            description: 'Peaceful, nature-inspired',
            emoji: '🍃'
        },
        {
            id: THEMES.DARK_ACADEMIA,
            name: 'Dark Academia',
            description: 'Moody, intellectual, premium',
            emoji: '📚'
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-secondary font-bold text-primary flex items-center gap-2">
                    <Palette size={28} />
                    Settings
                </h1>
                <div className="w-16"></div>
            </div>

            {/* Theme Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Book Style</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted mb-4">
                        Choose how your recipe book looks. The entire app will transform!
                    </p>
                    <div className="space-y-3">
                        {themeOptions.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => switchTheme(theme.id)}
                                className={`w-full p-4 rounded-theme border-2 text-left transition-all ${currentTheme === theme.id
                                    ? 'border-primary bg-primary/10 shadow-lg'
                                    : 'border-muted/20 hover:border-primary/50 bg-surface'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{theme.emoji}</span>
                                        <div>
                                            <div className="font-secondary font-semibold text-text">
                                                {theme.name}
                                            </div>
                                            <div className="text-sm text-muted mt-1">
                                                {theme.description}
                                            </div>
                                        </div>
                                    </div>
                                    {currentTheme === theme.id && (
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* About */}
            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted">
                        Chefs Canvas v1.0
                    </p>
                    <p className="text-xs text-muted mt-2">
                        A dynamic PWA that adapts its aesthetic based on your preferred book style.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsView;
