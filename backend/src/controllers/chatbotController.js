import axios from 'axios';
import User from '../models/User.js';

// Fallback intelligent response generator for Expireo SaaS queries
const getFallbackBotResponse = (userMessage, isSubscribed) => {
    const text = userMessage.toLowerCase();

    if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('namaste')) {
        return 'Hello! I am your Expireo AI Assistant. How can I help you today with your expirable links, expiration settings, or analytics?';
    }

    if (text.includes('expire') || text.includes('expiration') || text.includes('time') || text.includes('duration') || text.includes('timer')) {
        return 'Expireo links automatically self-destruct after custom time limits (e.g. 1 hour, 24 hours, 7 days) or maximum click limits. Once expired, visitors will no longer be able to access the destination URL.';
    }

    if (text.includes('password') || text.includes('protect') || text.includes('secret') || text.includes('encrypt') || text.includes('lock')) {
        return 'You can add password protection when creating any link. Visitors will be prompted to enter the password before being redirected to the destination URL.';
    }

    if (text.includes('limit') || text.includes('free') || text.includes('plan') || text.includes('pro') || text.includes('pricing') || text.includes('upgrade')) {
        return isSubscribed
            ? 'You are on the Pro Plan! Enjoy unlimited link generation, custom expiration times, and priority support.'
            : 'Free users can create up to 5 expirable links per month. Upgrade to Pro for unlimited links, custom expiration times, and advanced security!';
    }

    if (text.includes('analytics') || text.includes('click') || text.includes('track') || text.includes('stat') || text.includes('view') || text.includes('ip')) {
        return 'You can track real-time link performance on your Dashboard or Analytics tab, including total click counts, device breakdown, browser types, and geographic locations.';
    }

    if (text.includes('api') || text.includes('key') || text.includes('webhook') || text.includes('developer')) {
        return 'Developer API keys and webhook settings are available in the API Keys & Webhooks tab in your dashboard sidebar for programmatic link generation.';
    }

    return 'Expireo allows you to create temporary, self-destructing links with password protection and real-time click analytics. Try creating a new link from your dashboard or "My Links" page!';
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Get user subscription status
        let isSubscribed = false;
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                isSubscribed = user.isSubscribed;
            }
        }

        // If OpenRouter API Key is configured, try external AI completion
        if (process.env.OPENROUTER_API_KEY) {
            try {
                const systemPrompt = isSubscribed
                    ? 'You are a priority support assistant for Expireo URL Generator Pro users. Help with analytics, password protection, expiration timers, and troubleshooting.'
                    : 'You are a helpful support assistant for Expireo URL Generator free users. Help with FAQs and encourage upgrading to Pro for unlimited links.';

                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: 'openai/gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 500,
                        temperature: 0.7
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 5000
                    }
                );

                const botMessage = response.data?.choices?.[0]?.message?.content;
                if (botMessage) {
                    return res.json({ message: botMessage });
                }
            } catch (openRouterErr) {
                console.warn('OpenRouter API failed or timed out, using fallback assistant:', openRouterErr.message);
            }
        }

        // Return intelligent fallback response
        const fallbackReply = getFallbackBotResponse(message, isSubscribed);
        return res.json({ message: fallbackReply });

    } catch (error) {
        console.error('Chatbot controller error:', error);
        return res.json({
            message: 'Hello! I am your Expireo Assistant. How can I help you with your expirable links or dashboard today?'
        });
    }
};
