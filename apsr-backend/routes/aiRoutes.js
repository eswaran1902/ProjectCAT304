const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to get image data
async function urlToGenerativePart(url, mimeType) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        inlineData: {
            data: Buffer.from(response.data).toString('base64'),
            mimeType
        },
    };
}

// 1. AI Chatbot endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        // History format from frontend might need adaptation. 
        // Gemini expects [ { role: 'user'|'model', parts: [{ text: '' }] } ]

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        // Simple stateless approach for now or adapt history
        // Constructing a single prompt context if history is complex, or using startChat

        let chatHistory = [];
        if (history && history.length > 0) {
            chatHistory = history.map(h => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
            }));
        }

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are a helpful customer support assistant for a Marketplace application. You help users navigate the site, find products, and answer general questions." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to help your users." }],
                },
                ...chatHistory
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error in /chat:', error);
        res.status(500).json({ error: 'AI Chat failed' });
    }
});

// 2. Product Recommendations endpoint
router.post('/recommend', async (req, res) => {
    try {
        const { userHistory, products } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const prompt = `
      Based on the user's history: ${JSON.stringify(userHistory)},
      User is interested in these types of items.
      Available products: ${JSON.stringify(products)}.
      Recommend 3 products from the available list that the user might like. 
      Return ONLY a JSON object with a key "recommendations" which is an array of strings (product names).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const json = JSON.parse(text);
            res.json(json); // Expected { recommendations: [] }
        } catch (e) {
            // Fallback cleanup if markdown blocks exist
            const cleanText = text.replace(/```json|```/g, '').trim();
            try {
                res.json(JSON.parse(cleanText));
            } catch (e2) {
                res.json({ recommendations: [] });
            }
        }
    } catch (error) {
        console.error('Error in /recommend:', error);
        res.status(500).json({ error: 'Recommendation failed' });
    }
});

// 3. Content Generation endpoint (Product Description)
// 3. Content Generation endpoint (Product Description)
router.post('/generate-description', async (req, res) => {
    try {
        const { currentDescription, productName, category } = req.body;

        // Mock Fallback if no API Key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('your_')) {
            const mockDesc = `[AI Mock] Experience the premium quality of ${productName}. Designed for ${category} professionals, this product offers exceptional value and performance. ${currentDescription || ''}`;
            console.log('AI Mock Description returned (No API Key)');
            return res.json({ description: mockDesc });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const prompt = `Create a catchy and professional product description for a product named "${productName}" in the category "${category}". 
    Existing Draft: "${currentDescription || ''}". 
    Make it selling and engaging. Return just the description text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ description: response.text() });
    } catch (error) {
        console.error('Error in /generate-description:', error);
        // Fallback on API error
        const backupDesc = `Premium ${category} solution: ${productName}. High quality and reliable.`;
        res.json({ description: backupDesc });
    }
});

// 4. Image Analysis endpoint (Tagging)
router.post('/analyze-image', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        // Fetch image and convert to part
        // Note: In a real app, strict validation of imageUrl is needed to prevent SSRF
        const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg'); // Assuming jpeg for simplicity or detect mime

        const prompt = "Analyze this product image. Provide 5 descriptive tags for it. Return them as a comma separated list.";

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;

        res.json({ analysis: response.text() });
    } catch (error) {
        console.error('Error in /analyze-image:', error);
        res.status(500).json({ error: 'Image analysis failed' });
    }
});

module.exports = router;
