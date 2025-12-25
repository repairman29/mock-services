const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/characters/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('[Character System Mock] Getting character for:', userId);
  
  res.json({
    success: true,
    character: {
      id: `char_${userId}`,
      name: 'Captain Smuggler',
      level: 5,
      xp: 1250,
      credits: 2500,
      stats: { strength: 15, agility: 18, intelligence: 12 },
      inventory: []
    }
  });
});

app.post('/characters/:userId/levelup', (req, res) => {
  const userId = req.params.userId;
  const { stat } = req.body;
  
  console.log('[Character System Mock] Leveling up stat:', stat);
  
  res.json({
    success: true,
    character: {
      level: 6,
      [`${stat}`]: 19
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'character-system-mock' });
});

app.listen(3006, () => console.log('🚀 Character System Mock on port 3006'));
