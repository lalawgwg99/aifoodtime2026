# SavorChef Workers API

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle OPTIONS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // API Routes
            if (path.startsWith('/api/favorites')) {
                return handleFavorites(request, env, corsHeaders);
            }

            if (path.startsWith('/api/preferences')) {
                return handlePreferences(request, env, corsHeaders);
            }

            if (path.startsWith('/api/generate-recipe')) {
                return handleRecipeGeneration(request, env, corsHeaders);
            }

            return new Response('Not Found', { status: 404, headers: corsHeaders });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};

// Favorites Management
async function handleFavorites(request, env, corsHeaders) {
    const userId = request.headers.get('X-User-ID');
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'GET') {
        // Get user favorites
        const favorites = await env.DB.prepare(
            'SELECT * FROM favorites WHERE user_id = ?'
        ).bind(userId).all();

        return new Response(JSON.stringify(favorites.results), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'POST') {
        // Add favorite
        const { recipeId, recipeData } = await request.json();

        await env.DB.prepare(
            'INSERT INTO favorites (user_id, recipe_id, recipe_data, created_at) VALUES (?, ?, ?, ?)'
        ).bind(userId, recipeId, JSON.stringify(recipeData), Date.now()).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const recipeId = url.searchParams.get('recipeId');

        await env.DB.prepare(
            'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?'
        ).bind(userId, recipeId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}

// User Preferences
async function handlePreferences(request, env, corsHeaders) {
    const userId = request.headers.get('X-User-ID');
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'GET') {
        const prefs = await env.DB.prepare(
            'SELECT * FROM preferences WHERE user_id = ?'
        ).bind(userId).first();

        return new Response(JSON.stringify(prefs || {}), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'POST') {
        const preferences = await request.json();

        await env.DB.prepare(
            'REPLACE INTO preferences (user_id, data, updated_at) VALUES (?, ?, ?)'
        ).bind(userId, JSON.stringify(preferences), Date.now()).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}

// Secure Recipe Generation (API Key on server)
async function handleRecipeGeneration(request, env, corsHeaders) {
    const { searchState, userId } = await request.json();

    // Call Gemini API with server-side API key
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY, // Stored securely in Workers
        },
        body: JSON.stringify({
            // ... recipe generation logic
        }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}
