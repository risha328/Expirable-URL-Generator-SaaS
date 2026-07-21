import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AnimatedLogo({ size = 'medium', light = false, to = '/' }) {
    // Size variants
    const sizes = {
        small: { icon: 'w-7 h-7', text: 'text-xl', linkSize: 16 },
        medium: { icon: 'w-9 h-9', text: 'text-2xl', linkSize: 20 },
        large: { icon: 'w-11 h-11', text: 'text-3xl', linkSize: 24 }
    };

    const currentSize = sizes[size] || sizes.medium;

    // Framer motion variants for link icon chain rings
    const leftRingVariants = {
        initial: { x: -3, rotate: -15, opacity: 0.8 },
        animate: {
            x: [ -3, 0, -3 ],
            rotate: [ -15, 0, -15 ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        hover: { x: 1, rotate: 0, scale: 1.1 }
    };

    const rightRingVariants = {
        initial: { x: 3, rotate: 15, opacity: 0.8 },
        animate: {
            x: [ 3, 0, 3 ],
            rotate: [ 15, 0, 15 ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        hover: { x: -1, rotate: 0, scale: 1.1 }
    };

    const letters = 'Expireo'.split('');

    return (
        <Link to={to} className="inline-flex items-center space-x-2.5 group focus:outline-none">
            <motion.div
                whileHover="hover"
                initial="initial"
                animate="animate"
                className="relative flex items-center justify-center cursor-pointer"
            >
                {/* Clean Transparent Link Icon */}
                <div
                    className={`${currentSize.icon} relative z-10 flex items-center justify-center ${
                        light ? 'text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-700'
                    } transition-colors`}
                >
                    {/* Interlocking Link Motion Graphics SVG */}
                    <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Left Chain Link Ring */}
                        <motion.path
                            variants={leftRingVariants}
                            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                        />
                        {/* Right Chain Link Ring */}
                        <motion.path
                            variants={rightRingVariants}
                            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                        />
                    </svg>
                </div>
            </motion.div>

            {/* Animated Text Logo */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center overflow-hidden font-black tracking-tight"
            >
                {letters.map((letter, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`${currentSize.text} ${
                            light
                                ? 'text-white drop-shadow-sm'
                                : i < 6
                                ? 'text-indigo-600 group-hover:text-indigo-700'
                                : 'text-purple-600 group-hover:text-purple-700'
                        } transition-colors duration-200 inline-block`}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </Link>
    );
}
