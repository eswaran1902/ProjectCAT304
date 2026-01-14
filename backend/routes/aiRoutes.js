const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 1. AI Chatbot endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body; // history can be an array of {role, content}

        // Construct messages array with system prompt
        const messages = [
            { role: "system", content: "You are a helpful customer support assistant for a Marketplace application. You help users navigate the site, find products, and answer general questions." },
            ...(history || []),
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const botReply = completion.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error in /chat:', error);
        res.status(500).json({ error: 'AI Chat failed' });
    }
});

// 2. Product Recommendations endpoint
router.post('/recommend', async (req, res) => {
    try {
        const { userHistory, products } = req.body;
        // userHistory: array of product names viewed/bought
        // products: array of available product names/categories to choose from (limit this in frontend to avoid token limits)

        const prompt = `
      Based on the user's history: ${JSON.stringify(userHistory)},
      User is interested in these types of items.
      Available products: ${JSON.stringify(products)}.
      Recommend 3 products from the available list that the user might like. 
      Return only the product names as a JSON array string.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const recommendationText = completion.choices[0].message.content;
        // Attempt to parse JSON
        try {
            const recommendations = JSON.parse(recommendationText);
            res.json({ recommendations });
        } catch (e) {
            // Fallback if AI didn't return pure JSON
            res.json({ recommendations: [], raw: recommendationText });
        }
    } catch (error) {
        console.error('Error in /recommend:', error);
        res.status(500).json({ error: 'Recommendation failed' });
    }
});

// 3. Content Generation endpoint (Product Description)
router.post('/generate-description', async (req, res) => {
    try {
        const { currentDescription, productName, category } = req.body;

        const prompt = `Create a catchy and professional product description for a product named "${productName}" in the category "${category}". 
    Existing Draft: "${currentDescription || ''}". 
    Make it selling and engaging.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ description: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in /generate-description:', error);
        res.status(500).json({ error: 'Description generation failed' });
    }
});

// 4. Image Analysis endpoint (Tagging)
router.post('/analyze-image', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        // Note: handling images often requires GPT-4-vision-preview or newer vision models.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // or gpt-4-turbo
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this product image. Provide 5 descriptive tags for it." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        res.json({ analysis: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in /analyze-image:', error);
        res.status(500).json({ error: 'Image analysis failed' });
    }
});

module.exports = router;
