import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="border-b border-indigo-900/30 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex-shrink-0">
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                                    APSR
                                </span>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-baseline space-x-6">
                                    <button className="bg-indigo-600/20 text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                        Home
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Partner Portal
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Admin Center
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[85vh]">

                {/* Background Gradients */}
                <div className="absolute top-0 w-full h-full bg-slate-900 bg-center bg-cover">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob" style={{ animationDelay: "2s" }}></div>
                </div>

                <div className="container relative mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="w-full text-left z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                            Empowering <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Strategic Sales.
                            </span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-400 leading-relaxed max-w-lg mb-8">
                            Transform your network into a scalable revenue engine with automated attribution, transparent ledgers, and AI-backed strategy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/signup')} // "Join as Partner" -> Signup
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95 border border-blue-500/50"
                            >
                                JOIN AS PARTNER
                            </button>
                            <button
                                onClick={() => navigate('/marketplace')} // "Explore Marketplace" -> Marketplace
                                className="bg-slate-800 hover:bg-slate-700 text-gray-200 font-semibold py-3 px-8 rounded-lg border border-slate-600 transition-all hover:border-gray-500"
                            >
                                EXPLORE MARKETPLACE
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Mockup Card */}
                    <div className="w-full flex justify-center md:justify-end z-10">
                        <div className="relative">
                            {/* Glass Card */}
                            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Real-time Attribution</p>
                                        <p className="text-xl font-bold text-green-400">+$128.00</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-2 bg-slate-700 rounded-full w-3/4"></div>
                                    <div className="h-2 bg-slate-700 rounded-full w-1/2"></div>
                                    <div className="h-2 bg-slate-700 rounded-full w-full"></div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Active Session
                                    </div>
                                    <span>Just now</span>
                                </div>
                            </div>

                            {/* Decorative Element Behind */}
                            <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-slate-700/30 rounded-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer / Bottom Section */}
            <section className="py-20 bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                        Empower Your Team
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                        Dedicated Workspaces
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-xl bg-slate-800/20 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                <BarChart3 />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Analytics First</h3>
                            <p className="text-gray-400 text-sm">Deep insights into every sale and conversion.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 rounded-xl bg-slate-800/20 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                <ShieldCheck />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Secure Payouts</h3>
                            <p className="text-gray-400 text-sm">Automated and transparent commission ledgers.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 rounded-xl bg-slate-800/20 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                <ArrowRight />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Instant Scale</h3>
                            <p className="text-gray-400 text-sm">Onboard partners in seconds, not days.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
