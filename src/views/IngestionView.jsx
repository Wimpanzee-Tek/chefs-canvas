import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, Link as LinkIcon, ArrowLeft } from 'lucide-react';

import { saveRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

const IngestionView = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('url'); // 'camera' or 'url'
    const [urlInput, setUrlInput] = useState('');
    const [parsedRecipe, setParsedRecipe] = useState(null);

    // Mock OCR/URL parsing
    const handleUrlSubmit = async (e) => {
        e.preventDefault();

        // Simulate parsing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock parsed recipe
        setParsedRecipe({
            title: 'Parsed Recipe from URL',
            ingredients: [
                '2 cups flour',
                '1 cup sugar',
                '1 tsp baking powder'
            ],
            steps: [
                'Mix dry ingredients',
                'Add wet ingredients',
                'Bake at 350°F for 30 minutes'
            ],
            originalSource: urlInput
        });
    };

    const handleCameraCapture = async () => {
        // Would use react-webcam here
        alert('Camera feature would open here. For demo, using mock data.');

        setParsedRecipe({
            title: 'Scanned Recipe',
            ingredients: [
                '3 eggs',
                '1 cup milk',
                'Cookbook page scanned via OCR'
            ],
            steps: [
                'Step parsed from image',
                'Another step from OCR'
            ],
            originalSource: 'scan'
        });
    };

    const handleSaveRecipe = () => {
        if (!currentUser) return;

        const newRecipe = {
            ...parsedRecipe,
            ownerId: currentUser.id,
            sharedWith: []
        };

        saveRecipe(newRecipe);
        navigate('/');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-secondary font-bold text-primary">Add Recipe</h1>
                <div className="w-16"></div>
            </div>

            {/* Tab Selector */}
            <div className="flex gap-2 bg-surface rounded-theme p-1 border border-muted/20">
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-3 px-4 rounded-theme font-medium transition-all ${activeTab === 'url'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-muted hover:text-text'
                        }`}
                >
                    <LinkIcon size={20} className="inline mr-2" />
                    URL
                </button>
                <button
                    onClick={() => setActiveTab('camera')}
                    className={`flex-1 py-3 px-4 rounded-theme font-medium transition-all ${activeTab === 'camera'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-muted hover:text-text'
                        }`}
                >
                    <Camera size={20} className="inline mr-2" />
                    Scan
                </button>
            </div>

            {/* URL Input */}
            {activeTab === 'url' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Paste Recipe URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://example.com/recipe"
                                className="w-full px-4 py-3 rounded-theme border border-muted/20 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <Button type="submit" className="w-full">
                                Parse Recipe
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Camera Input */}
            {activeTab === 'camera' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Scan Physical Recipe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-video bg-muted/10 rounded-theme flex items-center justify-center border-2 border-dashed border-muted/30">
                            <Camera size={60} className="text-muted" />
                        </div>
                        <Button onClick={handleCameraCapture} className="w-full">
                            Capture & Parse
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Parsed Recipe Editor */}
            {parsedRecipe && (
                <Card className="border-2 border-primary/50">
                    <CardHeader>
                        <CardTitle>Edit Parsed Recipe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={parsedRecipe.title}
                                onChange={(e) => setParsedRecipe({ ...parsedRecipe, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ingredients</label>
                            <textarea
                                value={parsedRecipe.ingredients.join('\n')}
                                onChange={(e) => setParsedRecipe({
                                    ...parsedRecipe,
                                    ingredients: e.target.value.split('\n')
                                })}
                                rows={5}
                                className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Steps</label>
                            <textarea
                                value={parsedRecipe.steps.join('\n')}
                                onChange={(e) => setParsedRecipe({
                                    ...parsedRecipe,
                                    steps: e.target.value.split('\n')
                                })}
                                rows={5}
                                className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text font-mono text-sm"
                            />
                        </div>

                        <Button onClick={handleSaveRecipe} className="w-full" size="lg">
                            Save Recipe
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default IngestionView;
