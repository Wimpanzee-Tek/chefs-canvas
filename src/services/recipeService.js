// Mock Recipe Service with "Write-Once" Image Generation Logic
// This service simulates Firebase Firestore with localStorage

const STORAGE_KEY = 'chameleon_recipes';

// Mock data
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
        generatedImage: null, // Will be generated on first view
        themeStyleAtCreation: null
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
        themeStyleAtCreation: null
    }
];

// Initialize storage if empty
const initializeStorage = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
    }
};

// Get all recipes
export const getRecipes = () => {
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data);
};

// Get single recipe by ID
export const getRecipeById = (id) => {
    const recipes = getRecipes();
    return recipes.find(recipe => recipe.id === id);
};

// Save/Update recipe
export const saveRecipe = (recipe) => {
    const recipes = getRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);

    if (index !== -1) {
        recipes[index] = recipe;
    } else {
        recipe.id = Date.now().toString();
        recipes.push(recipe);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    return recipe;
};

// Delete recipe
export const deleteRecipe = (id) => {
    const recipes = getRecipes();
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
