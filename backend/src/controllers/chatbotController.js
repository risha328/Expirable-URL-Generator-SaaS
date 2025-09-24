import axios from 'axios';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Get user subscription status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSubscribed = user.isSubscribed;

    // Prepare system prompt based on subscription
    let systemPrompt;
    if (isSubscribed) {
      systemPrompt = `You are a priority support assistant for Expirable URL Generator Pro users.
      Help with advanced features like analytics, password protection, branding, custom expiration times, and troubleshooting.
      Be helpful, professional, and provide detailed answers.`;
    } else {
      systemPrompt = `You are a helpful assistant for Expirable URL Generator free users.
      Answer FAQs: Free users get 5 links per month, links expire after 24 hours by default (Pro can customize).
      Password protection and custom branding are Pro features. Keep responses concise and encourage upgrading for more features.`;
    }

    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // or another model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content;

    res.json({ message: botMessage });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Failed to get response from chatbot' });
  }
};
