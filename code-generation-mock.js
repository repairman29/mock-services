const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', (req, res) => {
  const { prompt, language } = req.body;
  console.log('[Code Generation Mock] Generating code for:', prompt?.substring(0, 30));
  
  res.json({
    success: true,
    code: 'console.log("Mock generated code");',
    language: language || 'javascript'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'code-generation-mock' });
});

app.listen(3013, () => console.log('🚀 Code Generation Mock on port 3013'));
