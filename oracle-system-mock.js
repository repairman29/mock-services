const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { code, context } = req.body;
  console.log('[Oracle System Mock] Analyzing code');
  
  res.json({
    success: true,
    analysis: {
      quality: 85,
      suggestions: ['Consider adding error handling'],
      complexity: 'medium'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'oracle-system-mock' });
});

app.listen(8080, () => console.log('🚀 Oracle System Mock on port 8080'));
