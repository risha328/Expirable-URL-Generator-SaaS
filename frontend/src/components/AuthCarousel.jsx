import React, { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';
import urlShortenerImg from '../assets/url-shortener.jpg';
import customExpiryImg from '../assets/custom-expiry.png';
import passwordProtectionImg from '../assets/password-protection.png';
import realtimeAnalyticsImg from '../assets/realtime-analytics.jpg';

export default function AuthCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const slides = [
        {
            id: 1,
            badge: '🔗 URL Shortener',
            title: 'Create Clean & Branded Links',
            description: 'Transform long, complex URLs into short, shareable links. Perfect for social media, marketing, and clean sharing.',
            gradient: 'from-indigo-900 via-indigo-950 to-slate-900',
            accent: 'from-indigo-500 to-purple-500',
            image: urlShortenerImg
        },
        {
            id: 2,
            badge: '⏳ Custom Expiry Time',
            title: 'Temporary Self-Destructing Links',
            description: 'Set custom expiration timers or click limits. Your links automatically self-destruct to keep sensitive content private.',
            gradient: 'from-purple-950 via-slate-950 to-slate-900',
            accent: 'from-purple-500 to-pink-500',
            image: customExpiryImg
        },
        {
            id: 3,
            badge: '🔐 Password Protection',
            title: 'View-Once Encrypted Access',
            description: 'Share private passwords, API keys, and sensitive documents with end-to-end password encryption & view-once self-destruction.',
            gradient: 'from-slate-950 via-blue-950 to-indigo-950',
            accent: 'from-blue-500 to-cyan-400',
            image: passwordProtectionImg
        },
        {
            id: 4,
            badge: '📈 Real-Time Analytics',
            title: 'Track Every Click & Referrer',
            description: 'Monitor click traffic, referrer channels, geographic locations, and link activity in real-time.',
            gradient: 'from-slate-900 via-indigo-950 to-purple-950',
            accent: 'from-indigo-400 to-emerald-400',
            image: realtimeAnalyticsImg
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
            className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-[#FAF9F6] text-slate-800 min-h-screen select-none border-r border-slate-100 shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glowing Accent Orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Top Logo Brand */}
            <div className="relative z-10">
                <AnimatedLogo light={false} />
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
                        <div className="mb-6 w-full flex justify-center">
                            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center hover:scale-[1.03] transition-transform duration-500 ease-out">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Slide Badge */}
                        <div className="inline-block px-3.5 py-1 text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full mb-3">
                            {slide.badge}
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">
                            {slide.title}
                        </h2>
                        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
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
                                    ? 'w-8 bg-indigo-600'
                                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                            title={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
