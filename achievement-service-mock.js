const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock achievements data
const mockAchievements = [
  {
    id: 'first_mission',
    name: 'First Steps',
    description: 'Complete your first mission',
    icon: '🎯',
    rarity: 'common',
    points: 10,
    unlockedAt: null
  },
  {
    id: 'combat_master',
    name: 'Combat Master',
    description: 'Win 10 combat encounters',
    icon: '⚔️',
    rarity: 'rare',
    points: 50,
    unlockedAt: null
  }
];

app.get('/achievements/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('[Achievement Service Mock] Getting achievements for:', userId);

  res.json({
    success: true,
    achievements: mockAchievements.map(achievement => ({
      ...achievement,
      unlockedAt: achievement.id === 'first_mission' ? new Date().toISOString() : null
    }))
  });
});

app.post('/achievements/:userId/unlock', (req, res) => {
  const userId = req.params.userId;
  const { achievementId } = req.body;

  console.log('[Achievement Service Mock] Unlocking achievement:', achievementId, 'for user:', userId);

  res.json({
    success: true,
    achievement: {
      id: achievementId,
      name: 'Achievement Unlocked',
      points: 10,
      unlockedAt: new Date().toISOString()
    }
  });
});

app.get('/achievements/:userId/progress/:achievementId', (req, res) => {
  const { userId, achievementId } = req.params;

  console.log('[Achievement Service Mock] Getting progress for:', achievementId);

  res.json({
    success: true,
    progress: {
      achievementId,
      current: 5,
      target: 10,
      percentage: 50
    }
  });
});

app.get('/leaderboard/achievements', (req, res) => {
  console.log('[Achievement Service Mock] Getting achievement leaderboard');

  res.json({
    success: true,
    leaderboard: [
      { userId: 'user1', username: 'TopPlayer', totalPoints: 150 },
      { userId: 'user2', username: 'Achiever', totalPoints: 120 }
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'achievement-service-mock',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Achievement Service Mock running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
