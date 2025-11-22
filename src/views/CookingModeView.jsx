import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getRecipeById } from '../services/recipeService';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const CookingModeView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const foundRecipe = getRecipeById(id);
        if (!foundRecipe) {
            navigate('/');
            return;
        }
        setRecipe(foundRecipe);

        // Request screen wake lock to prevent screen from sleeping
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch((err) => {
                console.log('Wake lock error:', err);
            });
        }

        return () => {
            // Release wake lock when leaving
            if ('wakeLock' in navigator) {
                navigator.wakeLock.request('screen').then(lock => lock.release());
            }
        };
    }, [id, navigate]);

    if (!recipe) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    const nextStep = () => {
        if (currentStep < recipe.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-background flex flex-col z-50">
            {/* Header */}
            <div className="p-4 border-b border-muted/20 bg-surface">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/recipe/${id}`)}>
                        <ArrowLeft size={20} className="mr-2" />
                        Exit
                    </Button>
                    <h2 className="font-secondary font-bold text-primary truncate max-w-[200px]">
                        {recipe.title}
                    </h2>
                    <div className="w-16"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                {/* Step Counter */}
                <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-primary mb-2">
                        {currentStep + 1}
                    </div>
                    <div className="text-muted">
                        of {recipe.steps.length}
                    </div>
                </div>

                {/* Current Step */}
                <div className="bg-surface rounded-theme p-8 shadow-2xl border-2 border-primary/20 mb-8">
                    <p className="text-2xl leading-relaxed text-center font-primary">
                        {recipe.steps[currentStep]}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted/20 rounded-full h-2 mb-8">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4 border-t border-muted/20 bg-surface">
                <div className="flex gap-4 max-w-md mx-auto">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex-1"
                    >
                        <ChevronLeft size={24} />
                        Previous
                    </Button>
                    <Button
                        size="lg"
                        onClick={nextStep}
                        disabled={currentStep === recipe.steps.length - 1}
                        className="flex-1"
                    >
                        Next
                        <ChevronRight size={24} />
                    </Button>
                </div>
                {currentStep === recipe.steps.length - 1 && (
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => navigate(`/recipe/${id}`)}
                        className="w-full mt-4 max-w-md mx-auto"
                    >
                        Done Cooking! 🎉
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CookingModeView;
