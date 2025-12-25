const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock mission data
const mockMissions = [
  {
    id: 'mission_001',
    title: 'Data Heist',
    description: 'Steal classified data from a corporate database',
    type: 'heist',
    difficulty: 'hard',
    faction: 'hackers',
    reward: { credits: 1500, xp: 75 },
    requirements: { hacking: 3 },
    risks: ['security_alarms', 'corporate_security'],
    giver: 'Anonymous Client',
    location: 'corporate_sector'
  },
  {
    id: 'mission_002',
    title: 'Cargo Delivery',
    description: 'Deliver sensitive cargo to a neutral station',
    type: 'delivery',
    difficulty: 'medium',
    faction: 'merchants',
    reward: { credits: 800, xp: 35 },
    requirements: { cargo: 2 },
    risks: ['pirates', 'customs_inspection'],
    giver: 'Trading Company',
    location: 'neutral_space'
  },
  {
    id: 'mission_003',
    title: 'Reconnaissance',
    description: 'Gather intelligence on enemy movements',
    type: 'recon',
    difficulty: 'easy',
    faction: 'independent',
    reward: { credits: 400, xp: 20 },
    requirements: { stealth: 1 },
    risks: ['detection'],
    giver: 'Resistance Contact',
    location: 'frontier'
  }
];

app.get('/missions/generate-batch', (req, res) => {
  console.log('[Mission Engine Mock] Generating missions:', req.query);

  const count = parseInt(req.query.count) || 3;
  const level = parseInt(req.query.level) || 1;

  // Return mock missions
  const missions = mockMissions.slice(0, count).map(mission => ({
    ...mission,
    id: `${mission.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }));

  res.json({
    success: true,
    data: missions,
    message: `Generated ${missions.length} mock missions`
  });
});

app.post('/missions/:id/accept', (req, res) => {
  const missionId = req.params.id;
  console.log('[Mission Engine Mock] Accepting mission:', missionId);

  res.json({
    success: true,
    mission: {
      id: missionId,
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    }
  });
});

app.post('/missions/:id/complete', (req, res) => {
  const missionId = req.params.id;
  const { success, outcome } = req.body;

  console.log('[Mission Engine Mock] Completing mission:', missionId, { success, outcome });

  res.json({
    success: true,
    result: {
      missionId,
      success,
      outcome,
      rewards: success ? { credits: 500, xp: 25 } : { credits: 0, xp: 5 },
      completedAt: new Date().toISOString()
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mission-engine-mock',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Mission Engine Mock Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
