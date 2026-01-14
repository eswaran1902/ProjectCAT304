import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, ShoppingBag } from 'lucide-react';

const AiProductRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Mock user history for demo purposes - in real app, get from context/local storage
                const userHistory = ["Wireless Headphones", "Gaming Mouse"];
                // Mock available products list (names only) for AI to choose from
                const availableProducts = ["Mechanical Keyboard", "Monitor Stand", "USB Hub", "Webcam", "Ergonomic Chair", "Laptop Sleeve", "Smart Watch"];

                const response = await axios.post('http://localhost:5001/api/ai/recommend', {
                    userHistory,
                    products: availableProducts
                });

                if (response.data.recommendations) {
                    setRecommendations(response.data.recommendations);
                }
            } catch (error) {
                console.error("Failed to get recommendations", error);
                // Silently fail or show empty state for recommendations to avoid disrupting page
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-400 font-medium animate-pulse">✨ AI is finding the best picks for you...</div>;
    if (recommendations.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-sm border border-indigo-100 my-8">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-indigo-900">AI Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center group">
                        <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
                            <ShoppingBag className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800">{rec}</h3>
                        <p className="text-xs text-gray-500 mt-1">Based on your recent interests</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiProductRecommendations;
