// Mock Recipe Service with "Write-Once" Image Generation Logic
// This service simulates Firebase Firestore with localStorage

import { getGroupsForUser } from './groupService';

const STORAGE_KEY = 'chameleon_recipes';

// Mock data with ownerId
const INITIAL_RECIPES = [
    {
        id: '1',
        title: 'Classic Chocolate Chip Cookies',
        ingredients: [
            '2 1/4 cups all-purpose flour',
            '1 tsp baking soda',
            '1 tsp salt',
            '1 cup butter, softened',
            '3/4 cup granulated sugar',
            '3/4 cup brown sugar',
            '2 large eggs',
            '2 tsp vanilla extract',
            '2 cups chocolate chips'
        ],
        steps: [
            'Preheat oven to 375°F.',
            'Mix flour, baking soda, and salt in bowl.',
            'Beat butter and sugars until creamy.',
            'Add eggs and vanilla, beat well.',
            'Gradually blend in flour mixture.',
            'Stir in chocolate chips.',
            'Drop rounded tablespoons onto ungreased sheet.',
            'Bake 9-11 minutes or until golden brown.'
        ],
        originalSource: 'Family Recipe',
        generatedImage: null,
        themeStyleAtCreation: null,
        ownerId: 'user_1',
        sharedWith: [] // Array of { type: 'user'|'group', id: string }
    },
    {
        id: '2',
        title: 'Homemade Margherita Pizza',
        ingredients: [
            '1 lb pizza dough',
            '1/2 cup tomato sauce',
            '8 oz fresh mozzarella',
            'Fresh basil leaves',
            '2 tbsp olive oil',
            'Salt to taste'
        ],
        steps: [
            'Preheat oven to 500°F with pizza stone.',
            'Roll out dough to 12-inch circle.',
            'Spread tomato sauce evenly.',
            'Tear mozzarella and distribute.',
            'Drizzle with olive oil.',
            'Bake for 10-12 minutes until crust is golden.',
            'Add fresh basil before serving.'
        ],
        originalSource: 'https://example.com/pizza',
        generatedImage: null,
        themeStyleAtCreation: null,
        ownerId: 'user_1',
        sharedWith: []
    }
];

// Initialize storage if empty
const initializeStorage = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
    }
};

// Get all recipes (internal use)
const getAllRecipes = () => {
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data);
};

// Get recipes visible to a specific user
export const getRecipesForUser = (userId) => {
    const allRecipes = getAllRecipes();
    const userGroups = getGroupsForUser(userId).map(g => g.id);

    return allRecipes.filter(recipe => {
        // 1. Owner
        if (recipe.ownerId === userId) return true;

        // 2. Shared directly with user
        const sharedWithUser = recipe.sharedWith?.some(s => s.type === 'user' && s.id === userId);
        if (sharedWithUser) return true;

        // 3. Shared with a group the user is in
        const sharedWithGroup = recipe.sharedWith?.some(s => s.type === 'group' && userGroups.includes(s.id));
        if (sharedWithGroup) return true;

        return false;
    });
};

// Get single recipe by ID
export const getRecipeById = (id) => {
    const recipes = getAllRecipes();
    return recipes.find(recipe => recipe.id === id);
};

// Save/Update recipe
export const saveRecipe = (recipe) => {
    const recipes = getAllRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);

    if (index !== -1) {
        recipes[index] = { ...recipes[index], ...recipe };
    } else {
        // New recipe
        if (!recipe.ownerId) {
            console.warn("Creating recipe without ownerId!");
        }
        recipe.id = Date.now().toString();
        recipe.sharedWith = recipe.sharedWith || [];
        recipes.push(recipe);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    return recipe;
};

// Share recipe
export const shareRecipe = (recipeId, targetType, targetId) => {
    const recipes = getAllRecipes();
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);

    if (recipeIndex !== -1) {
        const recipe = recipes[recipeIndex];
        if (!recipe.sharedWith) recipe.sharedWith = [];

        // Check if already shared
        const exists = recipe.sharedWith.some(s => s.type === targetType && s.id === targetId);
        if (!exists) {
            recipe.sharedWith.push({ type: targetType, id: targetId });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        }
        return recipe;
    }
    return null;
};

// Unshare recipe
export const unshareRecipe = (recipeId, targetType, targetId) => {
    const recipes = getAllRecipes();
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);

    if (recipeIndex !== -1) {
        const recipe = recipes[recipeIndex];
        if (recipe.sharedWith) {
            recipe.sharedWith = recipe.sharedWith.filter(s => !(s.type === targetType && s.id === targetId));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        }
        return recipe;
    }
    return null;
};

// Delete recipe
export const deleteRecipe = (id) => {
    const recipes = getAllRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// CRITICAL: "Write-Once" Image Generation Logic
// This function checks if an image already exists before generating
export const ensureRecipeImage = async (recipe, currentTheme) => {
    // If image already exists, DO NOT regenerate
    if (recipe.generatedImage) {
        console.log(`✅ Recipe "${recipe.title}" already has an image. Skipping generation.`);
        return recipe;
    }

    console.log(`🎨 Generating image for "${recipe.title}" in ${currentTheme} style...`);

    // Mock image generation (would be Imagen API call in production)
    const generatedImageUrl = await mockImageGeneration(recipe, currentTheme);

    // Update recipe with generated image (WRITE ONCE)
    const updatedRecipe = {
        ...recipe,
        generatedImage: generatedImageUrl,
        themeStyleAtCreation: currentTheme
    };

    // Persist to storage
    saveRecipe(updatedRecipe);

    console.log(`✅ Image generated and saved for "${recipe.title}"`);

    return updatedRecipe;
};

// Mock Image Generation (simulates Imagen API)
const mockImageGeneration = async (recipe, themeStyle) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, this would be:
    // const prompt = `${recipe.title}, ${recipe.ingredients.slice(0, 3).join(', ')}, ${getThemeStyleDescription(themeStyle)}`;
    // const imageUrl = await callImagenAPI(prompt);

    // For now, return a placeholder from Unsplash with recipe-related keywords
    const keywords = recipe.title.toLowerCase().replace(/\s+/g, '-');
    return `https://source.unsplash.com/800x600/?${keywords},food`;
};

// Get theme style description for image generation prompts
const getThemeStyleDescription = (themeStyle) => {
    const descriptions = {
        'theme-rustic': 'rustic farmhouse style, warm earthy tones, textured parchment background',
        'theme-modern': 'clean modern style, bright airy aesthetic, minimalist composition',
        'theme-grandma': 'nostalgic scrapbook style, vintage floral patterns, cozy homemade feel',
        'theme-zen': 'zen minimalist style, natural peaceful tones, serene composition',
        'theme-dark-academia': 'dark academia aesthetic, moody elegant atmosphere, vintage literary feel'
    };
    return descriptions[themeStyle] || 'appetizing food photography';
};
