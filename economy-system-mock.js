const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/economy/market-prices', (req, res) => {
  console.log('[Economy System Mock] Getting market prices');
  
  res.json({
    success: true,
    prices: {
      weapons: { buy: 1200, sell: 800 },
      armor: { buy: 900, sell: 600 },
      materials: { buy: 50, sell: 30 }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'economy-system-mock' });
});

app.listen(3007, () => console.log('🚀 Economy System Mock on port 3007'));
