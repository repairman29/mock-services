const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/tasks', (req, res) => {
  const { description, priority } = req.body;
  console.log('[Daisy Chain Mock] Creating task:', description);
  
  res.json({
    success: true,
    task: {
      id: `task_${Date.now()}`,
      description,
      priority: priority || 'medium',
      status: 'queued'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'daisy-chain-mock' });
});

app.listen(3014, () => console.log('🚀 Daisy Chain Mock on port 3014'));
