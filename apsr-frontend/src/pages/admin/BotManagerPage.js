import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Plus, Trash2, Save, MessageSquare } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const BotManagerPage = () => {
    const { token } = useContext(AuthContext);
    const [faqs, setFaqs] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const fetchFaqs = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/faq/admin', {
                headers: { 'x-auth-token': token }
            });
            setFaqs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchFaqs();
    }, [token]);

    const handleAdd = async () => {
        if (!newQuestion || !newAnswer) return;
        try {
            await axios.post('http://localhost:5001/api/faq/admin',
                { question: newQuestion, answer: newAnswer, order: faqs.length },
                { headers: { 'x-auth-token': token } }
            );
            setNewQuestion('');
            setNewAnswer('');
            fetchFaqs();
        } catch (err) {
            alert('Failed to add FAQ');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/faq/admin/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchFaqs();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">FAQ Bot Manager</h1>
                <p className="text-gray-500 mt-1">Configure questions and answers for the customer support bot.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create New FAQ */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-teal-600" />
                        Add New Q&A
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question (User clicks this)</label>
                            <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-teal-500"
                                placeholder="e.g. Where is my order?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Answer (Bot replies this)</label>
                            <textarea
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-teal-500 h-32 resize-none"
                                placeholder="e.g. You can track your order in the My Account section..."
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={!newQuestion || !newAnswer}
                            className={`w-full py-2.5 rounded-lg font-bold text-white transition-colors ${!newQuestion || !newAnswer ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
                        >
                            Save Question
                        </button>
                    </div>
                </div>

                {/* List Existing FAQs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Active Questions ({faqs.length})</h3>
                        <MessageSquare size={18} className="text-gray-400" />
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {faqs.map((faq) => (
                            <div key={faq._id} className="p-6 hover:bg-gray-50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{faq.question}</h4>
                                    <button
                                        onClick={() => handleDelete(faq._id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="font-bold text-teal-600 text-xs uppercase mr-2">Bot:</span>
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                        {faqs.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                No questions configured. Add one to start.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BotManagerPage;
