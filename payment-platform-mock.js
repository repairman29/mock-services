const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/payments/process', (req, res) => {
  const { amount, currency } = req.body;
  console.log('[Payment Platform Mock] Processing payment:', amount, currency);
  
  res.json({
    success: true,
    transactionId: `txn_${Date.now()}`,
    status: 'completed'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-platform-mock' });
});

app.listen(3010, () => console.log('🚀 Payment Platform Mock on port 3010'));
