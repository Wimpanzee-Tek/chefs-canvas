import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getRecipeById, ensureRecipeImage, deleteRecipe, shareRecipe, unshareRecipe } from '../services/recipeService';
import { getGroupsForUser } from '../services/groupService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Trash2, Loader2, Share2, X, User, Users } from 'lucide-react';

const RecipeDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { currentUser, users } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageGenerating, setImageGenerating] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        loadRecipe();
    }, [id, currentUser]); // Reload if user changes

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

        if (currentUser) {
            setUserGroups(getGroupsForUser(currentUser.id));
        }

        setLoading(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${recipe.title}"?`)) {
            deleteRecipe(id);
            navigate('/');
        }
    };

    const handleShare = (targetType, targetId) => {
        const updatedRecipe = shareRecipe(recipe.id, targetType, targetId);
        setRecipe(updatedRecipe);
    };

    const handleUnshare = (targetType, targetId) => {
        const updatedRecipe = unshareRecipe(recipe.id, targetType, targetId);
        setRecipe(updatedRecipe);
    };

    const isSharedWith = (targetType, targetId) => {
        return recipe.sharedWith?.some(s => s.type === targetType && s.id === targetId);
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

    const isOwner = currentUser && recipe.ownerId === currentUser.id;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <div className="flex gap-2">
                    {isOwner && (
                        <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                            <Share2 size={16} className="mr-2" />
                            Share
                        </Button>
                    )}
                    {isOwner && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 size={16} />
                        </Button>
                    )}
                </div>
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
                <div className="rounded-theme overflow-hidden shadow-lg relative">
                    <img
                        src={recipe.generatedImage}
                        alt={recipe.title}
                        className="w-full h-64 object-cover"
                    />
                    {!isOwner && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                            Shared with you
                        </div>
                    )}
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

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-surface z-10">
                            <CardTitle>Share Recipe</CardTitle>
                            <button onClick={() => setShowShareModal(false)}>
                                <X size={20} />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Share with Groups */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Users size={16} />
                                    Your Groups
                                </h3>
                                <div className="space-y-2">
                                    {userGroups.length === 0 ? (
                                        <p className="text-sm text-muted italic">No groups yet.</p>
                                    ) : (
                                        userGroups.map(group => {
                                            const isShared = isSharedWith('group', group.id);
                                            return (
                                                <div key={group.id} className="flex items-center justify-between p-2 rounded-theme border border-muted/20">
                                                    <span>{group.name}</span>
                                                    <Button
                                                        size="sm"
                                                        variant={isShared ? "outline" : "default"}
                                                        onClick={() => isShared ? handleUnshare('group', group.id) : handleShare('group', group.id)}
                                                    >
                                                        {isShared ? 'Unshare' : 'Share'}
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Share with Users */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <User size={16} />
                                    Users
                                </h3>
                                <div className="space-y-2">
                                    {users.filter(u => u.id !== currentUser.id).map(user => {
                                        const isShared = isSharedWith('user', user.id);
                                        return (
                                            <div key={user.id} className="flex items-center justify-between p-2 rounded-theme border border-muted/20">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{user.avatar}</span>
                                                    <span>{user.name}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={isShared ? "outline" : "default"}
                                                    onClick={() => isShared ? handleUnshare('user', user.id) : handleShare('user', user.id)}
                                                >
                                                    {isShared ? 'Unshare' : 'Share'}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RecipeDetailView;
