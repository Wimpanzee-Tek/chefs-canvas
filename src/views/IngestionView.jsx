import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, Link as LinkIcon, ArrowLeft, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';

import { saveRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { buildImagePrompt, generateCoverImage } from '../services/aiImageService';

const IngestionView = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // ----- Existing camera / URL parsing state -----
    const [activeTab, setActiveTab] = useState('url'); // 'camera' or 'url'
    const [urlInput, setUrlInput] = useState('');
    const [parsedRecipe, setParsedRecipe] = useState(null);
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    // ----- New AI cover‑image state -----
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState(''); // comma‑separated string
    const [visualTheme, setVisualTheme] = useState('Modern Minimalist');
    const [coverGenerating, setCoverGenerating] = useState(false);
    const [coverUrl, setCoverUrl] = useState(null);
    const [coverError, setCoverError] = useState('');

    // ------------------- Mock OCR / URL parsing -------------------
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        await new Promise((r) => setTimeout(r, 1500));
        setParsedRecipe({
            title: 'Parsed Recipe from URL',
            ingredients: ['2 cups flour', '1 cup sugar', '1 tsp baking powder'],
            steps: ['Mix dry ingredients', 'Add wet ingredients', 'Bake at 350°F for 30 minutes'],
            originalSource: urlInput,
        });
    };

    // ------------------- Camera capture -------------------
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setTimeout(() => {
            setParsedRecipe({
                title: 'Scanned Recipe',
                ingredients: ['Captured from camera', '1 cup flour (detected)', '2 eggs (detected)'],
                steps: ['1. Mix ingredients (detected from scan)', '2. Bake at 350F'],
                originalSource: 'Camera Scan',
                generatedImage: imageSrc,
            });
        }, 1000);
    }, []);

    const retake = () => {
        setCapturedImage(null);
        setParsedRecipe(null);
    };

    // ------------------- AI cover generation -------------------
    const handleGenerateCover = async () => {
        if (!recipeName || !ingredients) {
            setCoverError('Please provide a recipe name and ingredients first.');
            return;
        }
        setCoverError('');
        setCoverGenerating(true);
        try {
            const ingredientArray = ingredients
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean)
                .slice(0, 8); // keep 5‑8 items as required
            const prompt = buildImagePrompt(recipeName, ingredientArray, visualTheme);
            const url = await generateCoverImage(prompt);
            setCoverUrl(url);
        } catch (e) {
            console.error(e);
            setCoverError(e.message);
        } finally {
            setCoverGenerating(false);
        }
    };

    // ------------------- Save recipe -------------------
    const handleSaveRecipe = () => {
        if (!currentUser) return;
        const newRecipe = {
            ...parsedRecipe,
            title: recipeName || parsedRecipe?.title,
            ingredients: ingredients
                ? ingredients.split(',').map((i) => i.trim())
                : parsedRecipe?.ingredients,
            ownerId: currentUser.id,
            sharedWith: [],
            generatedImage: coverUrl, // store the AI‑generated cover
        };
        saveRecipe(newRecipe);
        navigate('/');
    };

    // ------------------- Render -------------------
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-secondary font-bold text-primary">Add Recipe</h1>
                <div className="w-16" />
            </div>

            {/* Tab selector */}
            <div className="flex gap-2 bg-surface rounded-theme p-1 border border-muted/20">
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-3 px-4 rounded-theme font-medium transition-all ${activeTab === 'url' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
                        }`}
                >
                    <LinkIcon size={20} className="inline mr-2" />
                    URL
                </button>
                <button
                    onClick={() => setActiveTab('camera')}
                    className={`flex-1 py-3 px-4 rounded-theme font-medium transition-all ${activeTab === 'camera' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
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
                            <Button type="submit" className="w-full">Parse Recipe</Button>
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
                        {!capturedImage ? (
                            <>
                                <div className="aspect-video bg-black rounded-theme overflow-hidden relative">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: 'environment' }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button onClick={capture} className="w-full">
                                    <Camera size={20} className="mr-2" />
                                    Capture Photo
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="aspect-video bg-black rounded-theme overflow-hidden relative">
                                    <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                                </div>
                                <Button onClick={retake} variant="outline" className="w-full">Retake Photo</Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ---------- New Section: Recipe basics & AI cover ---------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Recipe details & cover image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            placeholder="Spicy Thai Coconut Curry"
                            className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text"
                        />
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Ingredients (comma‑separated)</label>
                        <textarea
                            rows={3}
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Red Curry Paste, Coconut Milk, Chicken, Basil, Bell Peppers, Jasmine Rice"
                            className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text font-mono text-sm"
                        />
                    </div>

                    {/* Visual Theme selector */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Visual Theme</label>
                        <select
                            value={visualTheme}
                            onChange={(e) => setVisualTheme(e.target.value)}
                            className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text"
                        >
                            <option>Rustic Farmhouse</option>
                            <option>Modern Minimalist</option>
                            <option>Vibrant Fiesta</option>
                            <option>Dark and Moody</option>
                        </select>
                    </div>

                    {/* Generate Cover button / preview */}
                    {coverUrl ? (
                        <div className="relative">
                            <img src={coverUrl} alt="Generated cover" className="w-full rounded-theme shadow-lg" />
                            <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => setCoverUrl(null)}>
                                Replace
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleGenerateCover} disabled={coverGenerating} className="w-full">
                            {coverGenerating ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Generating…
                                </>
                            ) : (
                                'Generate Cover Image'
                            )}
                        </Button>
                    )}
                    {coverError && <p className="text-sm text-red-500">{coverError}</p>}
                </CardContent>
            </Card>

            {/* Parsed Recipe Editor (optional – shows OCR / URL result) */}
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
                                onChange={(e) => setParsedRecipe({ ...parsedRecipe, ingredients: e.target.value.split('\n') })}
                                rows={5}
                                className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Steps</label>
                            <textarea
                                value={parsedRecipe.steps.join('\n')}
                                onChange={(e) => setParsedRecipe({ ...parsedRecipe, steps: e.target.value.split('\n') })}
                                rows={5}
                                className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text font-mono text-sm"
                            />
                        </div>
                        <Button onClick={handleSaveRecipe} className="w-full" size="lg">Save Recipe</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default IngestionView;
