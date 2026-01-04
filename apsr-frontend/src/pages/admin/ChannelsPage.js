import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { MessageSquare, Send, Settings, CheckCircle, AlertTriangle, Smartphone, Copy } from 'lucide-react';

const ChannelsPage = () => {
    const [whatsappStatus, setWhatsappStatus] = useState('connected');
    const [telegramStatus, setTelegramStatus] = useState('active');

    // Mock Templates
    const templates = [
        { id: 1, name: 'Welcome Message', content: 'Hi {{customer_name}}, thanks for your interest in {{product_name}}! Here is your exclusive link: {{referral_link}}', platform: 'WhatsApp' },
        { id: 2, name: 'Follow-up Nudge', content: 'Hello! Just checking if you had any questions about the {{product_name}} demo?', platform: 'WhatsApp' },
        { id: 3, name: 'Telegram Bot Intro', content: '/start - Welcome to APSR Bot! Tap below to browse products.', platform: 'Telegram' },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messaging Channels</h1>
                    <p className="text-gray-500 mt-1">Configure chat integrations and compliance templates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* WhatsApp Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-green-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                <MessageSquare size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">WhatsApp Business API</h3>
                                <p className="text-sm text-green-800">For high-volume verified messaging.</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white text-green-700 shadow-sm border border-green-200 flex items-center gap-1`}>
                            <CheckCircle size={12} /> Connected
                        </span>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Account ID</label>
                            <input type="text" value="100394829102" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Webhook Callback URL</label>
                            <div className="flex gap-2">
                                <input type="text" value="https://api.apsr.com/webhooks/whatsapp" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700" />
                                <button className="p-2 text-gray-500 hover:text-teal-600 bg-gray-100 hover:bg-teal-50 rounded-lg">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button className="text-sm text-gray-600 font-medium hover:text-gray-900 flex items-center gap-2">
                                <Settings size={16} /> Configure Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Telegram Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-blue-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                <Send size={24} className="ml-1" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Telegram Bot</h3>
                                <p className="text-sm text-blue-800">Automated attribution & support bot.</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white text-blue-700 shadow-sm border border-blue-200 flex items-center gap-1`}>
                            <CheckCircle size={12} /> Active
                        </span>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bot Name</label>
                            <input type="text" value="@APSR_Sales_Bot" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">API Token</label>
                            <input type="password" value="************************" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700" />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button className="text-sm text-gray-600 font-medium hover:text-gray-900 flex items-center gap-2">
                                <Settings size={16} /> Configure Bot
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Compliance Templates</h3>
                        <p className="text-sm text-gray-500">Salespeople can only copy/send these approved messages.</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
                        + New Template
                    </button>
                </div>
                <div className="divide-y divide-gray-100">
                    {templates.map(tpl => (
                        <div key={tpl.id} className="p-6 hover:bg-gray-50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-gray-800">{tpl.name}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${tpl.platform === 'WhatsApp' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {tpl.platform}
                                    </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button className="text-gray-400 hover:text-teal-600"><Edit2 size={16} /></button>
                                </div>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600 font-mono relative">
                                {tpl.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

// Missing icon import stub 
const Edit2 = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default ChannelsPage;
