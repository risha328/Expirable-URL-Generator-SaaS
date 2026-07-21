import React, { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function AuthCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const slides = [
        {
            id: 1,
            badge: '⚡ Self-Destructing Links',
            title: 'Temporary Links That Auto-Expire',
            description: 'Set custom expiration timers or click limits. Your links automatically self-destruct to keep sensitive content private.',
            gradient: 'from-indigo-900 via-indigo-950 to-slate-900',
            accent: 'from-indigo-500 to-purple-500',
            graphic: (
                <div className="relative w-full max-w-sm mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">⚡</div>
                            <span className="font-semibold text-sm">expireo.link/sec-928</span>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full animate-pulse">
                            ⏳ 04m : 52s remaining
                        </span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 w-[65%] rounded-full transition-all duration-1000"></div>
                    </div>
                    <div className="text-xs text-indigo-200 flex justify-between">
                        <span>Status: Active</span>
                        <span>Auto-Destruct: Enabled</span>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            badge: '🔐 Secret & Encrypted URLs',
            title: 'View-Once Password Protection',
            description: 'Share private passwords, API keys, and sensitive documents with end-to-end password encryption & view-once self-destruction.',
            gradient: 'from-purple-950 via-slate-950 to-slate-900',
            accent: 'from-purple-500 to-pink-500',
            graphic: (
                <div className="relative w-full max-w-sm mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl text-white">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/30 flex items-center justify-center text-xl">🔒</div>
                        <div>
                            <h4 className="font-bold text-sm">Protected Credential Link</h4>
                            <p className="text-xs text-purple-200">Requires Password to Unlock</p>
                        </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">••••••••••••••••</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-sans text-[10px]">Encrypted</span>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            badge: '📈 Real-Time Analytics',
            title: 'Track Every Click & Referrer',
            description: 'Monitor click traffic, referrer channels, geographic locations, and link activity before expiration.',
            gradient: 'from-slate-950 via-blue-950 to-indigo-950',
            accent: 'from-blue-500 to-cyan-400',
            graphic: (
                <div className="relative w-full max-w-sm mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-blue-200">Total Engagement</p>
                            <h4 className="text-2xl font-bold">1,842 Clicks</h4>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-lg">
                            +24.5% Live
                        </span>
                    </div>
                    <div className="flex items-end space-x-2 h-20 pt-2">
                        <div className="flex-1 bg-blue-500/40 hover:bg-blue-400 h-[40%] rounded-t-md transition-all"></div>
                        <div className="flex-1 bg-blue-500/60 hover:bg-blue-400 h-[70%] rounded-t-md transition-all"></div>
                        <div className="flex-1 bg-indigo-500 hover:bg-indigo-400 h-[100%] rounded-t-md transition-all"></div>
                        <div className="flex-1 bg-blue-500/50 hover:bg-blue-400 h-[60%] rounded-t-md transition-all"></div>
                        <div className="flex-1 bg-blue-500/80 hover:bg-blue-400 h-[85%] rounded-t-md transition-all"></div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            badge: '🔑 API & Webhooks',
            title: 'Automate Link Generation',
            description: 'Seamlessly generate expirable links programmatically using developer API keys and receive real-time webhook payload notifications.',
            gradient: 'from-slate-900 via-indigo-950 to-purple-950',
            accent: 'from-indigo-400 to-emerald-400',
            graphic: (
                <div className="relative w-full max-w-sm mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl text-white font-mono text-xs">
                    <div className="text-indigo-300 mb-2">// Generate Expirable URL</div>
                    <div className="text-pink-300 font-semibold">POST <span className="text-white">/api/v1/url/create</span></div>
                    <div className="text-gray-300 mt-2 bg-black/40 p-2.5 rounded-xl border border-white/10 leading-relaxed">
                        <span className="text-blue-300">"expiresIn"</span>: <span className="text-amber-300">"3600s"</span>,<br/>
                        <span className="text-blue-300">"maxViews"</span>: <span className="text-emerald-300">1</span>
                    </div>
                </div>
            )
        }
    ];

    // Auto-advance slides every 2 seconds (2000ms)
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isHovered, slides.length]);

    return (
        <div
            className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-slate-950 text-white min-h-[600px] select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Dynamic Gradients */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                />
            ))}

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

            {/* Top Logo Brand */}
            <div className="relative z-10">
                <AnimatedLogo light={true} />
            </div>

            {/* Center Slide Content */}
            <div className="relative z-10 my-auto py-8">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`text-center flex flex-col items-center transition-all duration-700 ease-in-out transform ${
                            index === currentSlide
                                ? 'opacity-100 translate-y-0 scale-100 relative'
                                : 'opacity-0 translate-y-4 scale-95 absolute inset-0 pointer-events-none'
                        }`}
                    >
                        {/* Interactive Feature Graphic Card */}
                        <div className="mb-6 w-full">{slide.graphic}</div>

                        {/* Slide Badge */}
                        <div className="inline-block px-3.5 py-1 text-xs font-semibold bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-indigo-200 mb-3">
                            {slide.badge}
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                            {slide.title}
                        </h2>
                        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                            {slide.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Bottom Pagination Controls */}
            <div className="relative z-10 flex items-center justify-center pt-4">
                {/* Dots */}
                <div className="flex items-center space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'w-8 bg-indigo-400'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                            title={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
