import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getRecipeById, ensureRecipeImage, deleteRecipe } from '../services/recipeService';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';

const RecipeDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageGenerating, setImageGenerating] = useState(false);

    useEffect(() => {
        loadRecipe();
    }, [id]);

    const loadRecipe = async () => {
        setLoading(true);
        const foundRecipe = getRecipeById(id);

        if (!foundRecipe) {
            navigate('/');
            return;
        }

        // CRITICAL: Check if image exists, generate if not (Write-Once Logic)
        if (!foundRecipe.generatedImage) {
            setImageGenerating(true);
            const updatedRecipe = await ensureRecipeImage(foundRecipe, currentTheme);
            setRecipe(updatedRecipe);
            setImageGenerating(false);
        } else {
            setRecipe(foundRecipe);
        }

        setLoading(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${recipe.title}"?`)) {
            deleteRecipe(id);
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!recipe) {
        return null;
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 size={16} />
                </Button>
            </div>

            {/* Recipe Image */}
            {imageGenerating ? (
                <Card className="h-64 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <Loader2 className="animate-spin text-primary mx-auto" size={40} />
                        <p className="text-muted text-sm">Generating themed image...</p>
                    </div>
                </Card>
            ) : recipe.generatedImage ? (
                <div className="rounded-theme overflow-hidden shadow-lg">
                    <img
                        src={recipe.generatedImage}
                        alt={recipe.title}
                        className="w-full h-64 object-cover"
                    />
                </div>
            ) : null}

            {/* Recipe Title */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-secondary font-bold text-primary">{recipe.title}</h1>
                {recipe.originalSource && (
                    <p className="text-sm text-muted">
                        Source: {recipe.originalSource.startsWith('http') ? (
                            <a href={recipe.originalSource} target="_blank" rel="noopener noreferrer" className="underline">
                                {recipe.originalSource}
                            </a>
                        ) : recipe.originalSource}
                    </p>
                )}
            </div>

            {/* Ingredients */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                <span>{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Steps */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-4">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </span>
                                <p className="pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            {/* Cooking Mode Button */}
            <Button
                className="w-full"
                size="lg"
                onClick={() => navigate(`/cook/${id}`)}
            >
                Start Cooking Mode
            </Button>
        </div>
    );
};

export default RecipeDetailView;
