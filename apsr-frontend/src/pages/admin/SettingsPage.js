import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { User, Shield, Bell, DollarSign, Lock, Save, Plus } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 mt-1">Configure global rules and team access.</p>
                </div>
                <button className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-200 flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-64 border-r border-gray-100 p-2">
                    {[
                        { id: 'general', label: 'General Profile', icon: User },
                        { id: 'team', label: 'Team & Roles', icon: Shield },
                        { id: 'commissions', label: 'Commission Rules', icon: DollarSign },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Lock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'general' && (
                        <div className="max-w-xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">General Profile</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 mb-8 group cursor-pointer">
                                    <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-bold border-2 border-white shadow-sm group-hover:bg-teal-200 transition-colors">
                                        A
                                    </div>
                                    <div>
                                        <button className="text-sm font-bold text-teal-600 border border-teal-200 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors">
                                            Change Avatar
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2">Recommended: 400x400px</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" defaultValue="Admin" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" defaultValue="User" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500" defaultValue="admin@apsr.com" disabled />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Admin Team Management</h2>
                                <button className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black font-medium flex items-center gap-2">
                                    <Plus size={16} /> Invite Member
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3">Member</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm">
                                        {/* Mocking the pending state locally for demo as we didn't add full axios hook here yet */}
                                        {/* In real implementation: map over fetched users */}
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-900">You (Super Admin)</td>
                                            <td className="px-6 py-4">admin@apsr.com</td>
                                            <td className="px-6 py-4 text-green-600 font-medium">Active</td>
                                            <td className="px-6 py-4 text-right"><span className="text-gray-400">Owner</span></td>
                                        </tr>
                                        {/* Demo Pending Row */}
                                        <tr className="bg-amber-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">New Admin Request</td>
                                            <td className="px-6 py-4">new.admin@apsr.com</td>
                                            <td className="px-6 py-4 text-amber-600 font-bold">Pending Approval</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="bg-teal-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-teal-700">Approve</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 italic">
                                Note: Only <strong>admin@apsr.com</strong> is auto-approved. All other admin signups appear here for review.
                            </p>
                        </div>
                    )}

                    {activeTab === 'commissions' && (
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Global Commission Rules</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Default Commission Rate (%)</label>
                                    <p className="text-xs text-gray-500 mb-2">Applied to products without specific overrides.</p>
                                    <div className="flex gap-4">
                                        <input type="number" className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" defaultValue="10" />
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 my-6"></div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Commission Cap ($)</label>
                                    <p className="text-xs text-gray-500 mb-2">Maximum commission payable per single transaction.</p>
                                    <div className="flex gap-4 items-center">
                                        <span className="text-gray-400 font-bold">$</span>
                                        <input type="number" className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none" defaultValue="500" />
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 my-6"></div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="auto-approval" className="rounded text-teal-600 focus:ring-teal-500 h-5 w-5" defaultChecked />
                                    <div>
                                        <label htmlFor="auto-approval" className="block text-sm font-bold text-gray-900">Auto-Approve Low Risk Commissions</label>
                                        <p className="text-xs text-gray-500">Automatically move entries to "Payable" after 30 days if risk score is low.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;
