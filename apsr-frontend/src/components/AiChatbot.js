import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Convert current messages to history format for API (exclude the last user message we just added locally if we want, but API expects history)
            // Ideally we send the conversation so far.
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await axios.post('http://localhost:5001/api/ai/chat', {
                message: userMessage.content,
                history: history
            });

            const botMessage = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            let errorMsg = 'Sorry, I encountered an error. Please try again.';
            if (error.response && error.response.status === 429) {
                errorMsg = '⚠️ My brain is tired (Quota Exceeded). Please check the API Key billing.';
            }
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200" style={{ boxShadow: "0 0 20px rgba(0,0,0,0.15)", height: '500px' }}>
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <h3 className="font-semibold">AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-gray-200 text-gray-500 p-3 rounded-lg rounded-bl-none text-sm animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask something..."
                                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiChatbot;
