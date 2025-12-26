const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.MOCK_PORT || 4010;

// Middleware
app.use(cors());
app.use(express.json());

// Mock responses for different OpenAI endpoints
const mockResponses = {
    '/v1/chat/completions': {
        id: 'chatcmpl-mock-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4-turbo-preview',
        choices: [{
            index: 0,
            message: {
                role: 'assistant',
                content: 'This is a mock response from the Smugglers development environment. The AI Game Master is currently in development mode and will provide more detailed responses when connected to the actual OpenAI API.'
            },
            finish_reason: 'stop'
        }],
        usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150
        }
    },

    '/v1/completions': {
        id: 'cmpl-mock-456',
        object: 'text_completion',
        created: Date.now(),
        model: 'text-davinci-003',
        choices: [{
            text: 'This is a mock completion response for development testing.',
            index: 0,
            finish_reason: 'stop'
        }],
        usage: {
            prompt_tokens: 50,
            completion_tokens: 25,
            total_tokens: 75
        }
    },

    '/v1/models': {
        object: 'list',
        data: [
            {
                id: 'gpt-4-turbo-preview',
                object: 'model',
                created: Date.now(),
                owned_by: 'openai'
            },
            {
                id: 'gpt-3.5-turbo',
                object: 'model',
                created: Date.now(),
                owned_by: 'openai'
            }
        ]
    }
};

// Routes
app.post('/v1/chat/completions', (req, res) => {
    console.log('📨 Mock OpenAI: Chat completion request');
    console.log('Messages:', req.body.messages?.length || 0, 'messages');

    // Simulate processing time
    setTimeout(() => {
        res.json(mockResponses['/v1/chat/completions']);
    }, Math.random() * 500 + 200); // 200-700ms delay
});

app.post('/v1/completions', (req, res) => {
    console.log('📨 Mock OpenAI: Completion request');
    console.log('Prompt length:', req.body.prompt?.length || 0);

    setTimeout(() => {
        res.json(mockResponses['/v1/completions']);
    }, Math.random() * 300 + 100);
});

app.get('/v1/models', (req, res) => {
    console.log('📨 Mock OpenAI: Models request');
    res.json(mockResponses['/v1/models']);
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'mock-openai',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Smugglers Mock OpenAI Service',
        endpoints: [
            'POST /v1/chat/completions',
            'POST /v1/completions',
            'GET /v1/models',
            'GET /health'
        ],
        note: 'This is a development mock service. All responses are simulated.'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Mock OpenAI Error:', err);
    res.status(500).json({
        error: {
            message: 'Internal mock service error',
            type: 'mock_error'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎭 Mock OpenAI Service running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Mock endpoint: http://localhost:${PORT}/v1/chat/completions`);
});
