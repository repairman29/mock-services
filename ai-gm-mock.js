const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock AI GM responses
const mockResponses = [
  {
    id: 'response_001',
    text: 'You carefully approach the derelict space station. The airlocks are sealed, but you notice a maintenance hatch that might be accessible.',
    choices: [
      { id: 'choice_001', text: 'Force open the maintenance hatch', consequence: 'risky' },
      { id: 'choice_002', text: 'Scan for an alternative entry point', consequence: 'safe' },
      { id: 'choice_003', text: 'Contact the station for permission', consequence: 'diplomatic' }
    ],
    mood: 'tense',
    location: 'derelict_station'
  }
];

app.post('/generate-response', (req, res) => {
  const { prompt, context, playerAction } = req.body;
  console.log('[AI GM Mock] Generating response for:', { prompt: prompt?.substring(0, 50), playerAction });

  // Return a mock response
  const response = {
    ...mockResponses[0],
    id: `response_${Date.now()}`,
    text: `Mock AI GM Response: You ${playerAction || 'take action'}. The situation develops according to the narrative flow.`,
    generatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    response: response
  });
});

app.post('/evaluate-choice', (req, res) => {
  const { choiceId, context } = req.body;
  console.log('[AI GM Mock] Evaluating choice:', choiceId);

  res.json({
    success: true,
    evaluation: {
      choiceId,
      quality: 'good',
      consequences: ['minor_reward', 'story_progression'],
      score: 85
    }
  });
});

app.get('/narrative/state', (req, res) => {
  console.log('[AI GM Mock] Getting narrative state');

  res.json({
    success: true,
    state: {
      currentChapter: 1,
      playerChoices: [],
      narrativeBranches: ['main_story', 'side_quest'],
      tensionLevel: 'medium',
      lastUpdated: new Date().toISOString()
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-gm-mock',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 AI GM Mock Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
