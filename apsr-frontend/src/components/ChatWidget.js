import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronRight, RefreshCw } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [history, setHistory] = useState([
        { role: 'bot', text: 'Hi! How can I help you today? Select a topic below:' }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/faq');
                setFaqs(res.data);
            } catch (err) {
                console.error("Failed to load FAQs");
            }
        };
        fetchFaqs();
    }, []);

    const handleQuestionClick = (faq) => {
        // Add User Question to History
        const newHistory = [...history, { role: 'user', text: faq.question }];
        setHistory(newHistory);
        setLoading(true);

        // Simulate Bot "Typing" delay for realism
        setTimeout(() => {
            setHistory(prev => [...prev, { role: 'bot', text: faq.answer }]);
            setLoading(false);
        }, 600);
    };

    const handleReset = () => {
        setHistory([{ role: 'bot', text: 'Hi! How can I help you today? Select a topic below:' }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-96 h-[500px] mb-4 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex justify-between items-center text-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Support Assistant</h3>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleReset} className="p-1 hover:bg-white/20 rounded-lg transition" title="Reset Chat">
                                <RefreshCw size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-teal-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        {/* FAQ Options (Always visible at bottom of chat if last msg is bot) */}
                        {!loading && history[history.length - 1].role === 'bot' && (
                            <div className="mt-4 grid gap-2">
                                <p className="text-xs text-gray-400 font-medium ml-1 mb-1">Suggested Topics:</p>
                                {faqs.map(faq => (
                                    <button
                                        key={faq._id}
                                        onClick={() => handleQuestionClick(faq)}
                                        className="text-left p-3 bg-white border border-teal-100 hover:border-teal-500 hover:bg-teal-50 rounded-xl text-sm text-teal-800 transition-all flex justify-between items-center group shadow-sm"
                                    >
                                        {faq.question}
                                        <ChevronRight size={16} className="text-teal-400 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                                {faqs.length === 0 && <p className="text-xs text-gray-400 p-2">No topics available.</p>}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-white border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">Powered by APSR Support</p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
