import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';

export default function ChatbotComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chat/message', { message: userMessage.text });
            const botMessage = { sender: 'bot', text: res.data.message };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: 'Hello! I am your Expireo AI Assistant. You can create self-destructing links with password protection and track real-time analytics from your dashboard!'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center cursor-pointer"
                title="Open Chat Support"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 w-80 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 overflow-hidden flex flex-col ${
                isMinimized ? 'h-14 overflow-hidden' : 'h-[450px]'
            }`}
        >
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex justify-between items-center select-none shadow-sm flex-shrink-0">
                <div
                    className="flex items-center space-x-2 cursor-pointer flex-1"
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-sm">Chat Support</span>
                </div>

                <div className="flex items-center space-x-1">
                    {/* Minimize / Shrink Button */}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
                        title={isMinimized ? 'Expand Window' : 'Minimize / Shrink Window'}
                    >
                        {isMinimized ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                        )}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
                        title="Close Chat"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Content Body */}
            {!isMinimized && (
                <>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`rounded-2xl px-3.5 py-2 text-sm max-w-[85%] leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white shadow-sm rounded-br-xs'
                                            : 'bg-white text-gray-800 border border-gray-200/80 shadow-xs rounded-bl-xs'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                        <textarea
                            rows={2}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
