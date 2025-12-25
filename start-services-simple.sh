#!/bin/bash

# Simple service startup - just the core services we know work

echo "🚀 Starting Core Smugglers RPG Services"
echo "======================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_service() {
    echo -e "${BLUE}[SERVICE]${NC} $1"
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Start main game server
print_service "Starting Main Game Server..."
cd smugglers && npm start &
MAIN_PID=$!
cd ..
sleep 3

# Start FTU server (if available)
print_service "Starting FTU Server..."
if [ -f "ftu-server.js" ]; then
    node ftu-server.js &
    FTU_PID=$!
    sleep 2
fi

# Start auth platform (if available)
print_service "Starting Auth Platform..."
if [ -d "auth-platform-standalone" ]; then
    cd auth-platform-standalone && npm start &
    AUTH_PID=$!
    cd ..
    sleep 2
fi

# Start audio generation (if available)
print_service "Starting Audio Generation..."
if [ -d "audio-generation-standalone" ]; then
    cd audio-generation-standalone && npm start &
    AUDIO_PID=$!
    cd ..
    sleep 2
fi

# Save PIDs
echo "$MAIN_PID" > .service_pids
[ -n "$FTU_PID" ] && echo "$FTU_PID" >> .service_pids
[ -n "$AUTH_PID" ] && echo "$AUTH_PID" >> .service_pids
[ -n "$AUDIO_PID" ] && echo "$AUDIO_PID" >> .service_pids

print_status "Core services started!"
print_status ""
print_status "🎮 ACCESS URLs:"
print_status "Main Game: http://localhost:9090/game-new.html"
print_status "Mobile Game: http://localhost:9090/mobile.html"
if [ -n "$FTU_PID" ]; then
    print_status "FTU Server: http://localhost:3000"
fi
if [ -n "$AUTH_PID" ]; then
    print_status "Auth Platform: http://localhost:3001"
fi
if [ -n "$AUDIO_PID" ]; then
    print_status "Audio Generation: http://localhost:3011"
fi

print_status ""
print_status "📝 Note: Backend microservices are mocked in client code"
print_status "🎯 Ready for testing with fallback functionality!"
