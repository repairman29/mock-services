const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock chat messages
let mockMessages = [
  {
    id: 'msg_001',
    userId: 'system',
    username: 'System',
    message: 'Welcome to Smugglers Chat!',
    timestamp: new Date().toISOString(),
    room: 'general'
  }
];

app.get('/messages/:room', (req, res) => {
  const room = req.params.room;
  const limit = parseInt(req.query.limit) || 50;

  console.log('[Chat Platform Mock] Getting messages for room:', room);

  const roomMessages = mockMessages.filter(msg => msg.room === room).slice(-limit);

  res.json({
    success: true,
    messages: roomMessages
  });
});

app.post('/messages/:room', (req, res) => {
  const room = req.params.room;
  const { userId, username, message } = req.body;

  console.log('[Chat Platform Mock] New message in room:', room, 'from:', username);

  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    message,
    timestamp: new Date().toISOString(),
    room
  };

  mockMessages.push(newMessage);

  // Keep only last 100 messages
  if (mockMessages.length > 100) {
    mockMessages = mockMessages.slice(-100);
  }

  res.json({
    success: true,
    message: newMessage
  });
});

app.get('/rooms', (req, res) => {
  console.log('[Chat Platform Mock] Getting available rooms');

  res.json({
    success: true,
    rooms: [
      { id: 'general', name: 'General Chat', userCount: 5 },
      { id: 'trade', name: 'Trading', userCount: 3 },
      { id: 'missions', name: 'Mission Board', userCount: 2 }
    ]
  });
});

app.post('/rooms/:room/join', (req, res) => {
  const room = req.params.room;
  const { userId, username } = req.body;

  console.log('[Chat Platform Mock] User joining room:', room, username);

  res.json({
    success: true,
    room: {
      id: room,
      joined: true,
      userCount: 5
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'chat-platform-mock',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`🚀 Chat Platform Mock Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
