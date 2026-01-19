import { z } from 'zod';

export const RecipeSchema = z.object({
    // Core AI Fields
    id: z.string().describe("A unique identifier for the recipe."),
    name: z.string().describe("The name of the recipe."),
    description: z.string().max(150).describe("A short description of the dish, optimized for mobile viewing (max 150 chars)."),
    matchScore: z.number().min(0).max(100).describe("The match score from 0-100."),
    matchReason: z.string().max(100).describe("Reason why this recipe matches the criteria (concise, max 100 chars)."),
    calories: z.number().describe("Estimated calories."),
    timeMinutes: z.number().describe("Preparation time in minutes."),
    tags: z.array(z.string()).describe("List of relevant tags."),
    ingredients: z.array(z.string()).describe("List of ingredients."),
    instructions: z.array(z.string()).describe("Step-by-step instructions."),

    // Macros & Health (AI Generated - Enforced)
    macros: z.object({
        protein: z.string().describe("e.g., '25g'"),
        carbs: z.string().describe("e.g., '40g'"),
        fat: z.string().describe("e.g., '10g'")
    }),
    healthTip: z.string().max(200).describe("A brief nutritional analysis highlighting specific micronutrients or health benefits."),

    // Application Fields (Optional / Added Post-Generation)
    imageUrl: z.string().optional(),
    author: z.string().optional(),
    authorAvatar: z.string().optional(),
    likes: z.number().optional(),
    isUserCreated: z.boolean().optional(),
    isPublic: z.boolean().optional(),
});

// Export the Type derived from the Schema
export type Recipe = z.infer<typeof RecipeSchema>;
