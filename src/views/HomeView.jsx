import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ThemeHeader from '../components/ThemeHeader';
import { getRecipesForUser } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { Clock, Users } from 'lucide-react';

const HomeView = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        if (currentUser) {
            const loadedRecipes = getRecipesForUser(currentUser.id);
            setRecipes(loadedRecipes);
        }
    }, [currentUser]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Decorative Theme Header */}
            <ThemeHeader title="Chefs Canvas" />

            <p className="text-center text-muted text-sm">Your chameleon cookbook adapts to your style</p>

            {/* Recipe Grid */}
            {recipes.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted text-lg">No recipes yet!</p>
                    <p className="text-muted text-sm mt-2">Tap the + button to add your first recipe.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {recipes.map((recipe) => (
                        <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                                {recipe.generatedImage && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={recipe.generatedImage}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-muted">
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {recipe.steps?.length || 0} steps
                                        </span>
                                        <span>
                                            {recipe.ingredients?.length || 0} ingredients
                                        </span>
                                        {recipe.ownerId !== currentUser?.id && (
                                            <span className="flex items-center gap-1 text-accent ml-auto">
                                                <Users size={16} />
                                                Shared
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeView;
