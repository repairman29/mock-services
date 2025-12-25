const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/assets/list', (req, res) => {
  console.log('[Asset Management Mock] Getting asset list');
  
  res.json({
    success: true,
    assets: ['background.jpg', 'logo.png', 'sound.mp3']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'asset-management-mock' });
});

app.listen(3012, () => console.log('🚀 Asset Management Mock on port 3012'));
