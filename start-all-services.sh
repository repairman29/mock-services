#!/bin/bash

# Smugglers RPG - Complete Local Development Environment with Mock Services
# Boots main game + mock microservices for comprehensive testing

set -e

echo "🚀 Starting Smugglers RPG Complete Local Development Environment"
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_service() {
    echo -e "${BLUE}[SERVICE]${NC} $1"
}

# Function to start a mock service
start_mock_service() {
    local service_name=$1
    local script_path=$2
    local port=$3

    print_service "Starting $service_name on port $port..."

    if [ -f "$script_path" ]; then
        # Start service in background
        PORT=$port node "$script_path" > "logs/$service_name.log" 2>&1 &
        local pid=$!

        # Wait a moment for service to start
        sleep 2

        # Check if service is running
        if kill -0 $pid 2>/dev/null; then
            print_status "$service_name started successfully (PID: $pid)"
            echo $pid >> ".service_pids"
        else
            print_error "$service_name failed to start"
            return 1
        fi
    else
        print_warning "$script_path not found, skipping $service_name"
    fi
}

# Function to start a real service
start_real_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3

    print_service "Starting $service_name on port $port..."

    if [ -d "$service_dir" ]; then
        cd "$service_dir"

        # Check if port is already in use
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "$service_name port $port already in use, skipping..."
            cd - > /dev/null
            return 0
        fi

        # Start service in background
        npm start > "../logs/$service_name.log" 2>&1 &
        local pid=$!

        # Wait a moment for service to start
        sleep 2

        # Check if service is running
        if kill -0 $pid 2>/dev/null; then
            print_status "$service_name started successfully (PID: $pid)"
            echo $pid >> "../.service_pids"
        else
            print_error "$service_name failed to start"
            cd - > /dev/null
            return 1
        fi

        cd - > /dev/null
    else
        print_warning "$service_dir not found, trying mock service..."
        # Try mock service as fallback
        local mock_script="mock-services/${service_name}-mock.js"
        if [ -f "$mock_script" ]; then
            start_mock_service "$service_name" "$mock_script" "$port"
        else
            print_error "$service_name mock not available"
        fi
    fi
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Create service PIDs file
echo "" > .service_pids

print_status "Setting up local development environment with mock services..."

# 1. Start Core Services First
print_service "=== STARTING CORE SERVICES ==="

# Main Smugglers App (serves the game)
start_real_service "smugglers-main" "smugglers" "9090"

# FTU Server (basic API fallbacks)
start_real_service "ftu-server" "." "3000"

# 2. Start Real Microservices (if available)
print_service "=== STARTING REAL MICROSERVICES ==="

# Try to start real services, fallback to mocks
start_real_service "auth-platform" "auth-platform-standalone" "3001"
start_real_service "audio-generation" "audio-generation-standalone" "3011"

# 3. Start Mock Microservices
print_service "=== STARTING MOCK MICROSERVICES ==="

# Mission Engine Mock
start_mock_service "mission-engine" "mock-services/mission-engine-mock.js" "3002"

# AI GM Mock
start_mock_service "ai-gm" "mock-services/ai-gm-mock.js" "3003"

# Achievement Service Mock
start_mock_service "achievement-service" "mock-services/achievement-service-mock.js" "3004"

# Combat System Mock
start_mock_service "combat-system" "mock-services/combat-system-mock.js" "3005"

# Character System Mock
start_mock_service "character-system" "mock-services/character-system-mock.js" "3006"

# Economy System Mock
start_mock_service "economy-system" "mock-services/economy-system-mock.js" "3007"

# Chat Platform Mock
start_mock_service "chat-platform" "mock-services/chat-platform-mock.js" "3008"

# Marketplace Service Mock
start_mock_service "marketplace-service" "mock-services/marketplace-service-mock.js" "3009"

# Payment Platform Mock
start_mock_service "payment-platform" "mock-services/payment-platform-mock.js" "3010"

# Asset Management Mock
start_mock_service "asset-management" "mock-services/asset-management-mock.js" "3012"

# Code Generation Mock
start_mock_service "code-generation" "mock-services/code-generation-mock.js" "3013"

# Oracle System Mock
start_mock_service "oracle-system" "mock-services/oracle-system-mock.js" "8080"

# Daisy Chain Mock
start_mock_service "daisy-chain" "mock-services/daisy-chain-mock.js" "3014"

# 4. Wait for services to fully initialize
print_status "Waiting for all services to initialize..."
sleep 15

# 5. Health Check All Services
print_service "=== HEALTH CHECKS ==="

SERVICES=(
    "smugglers-main:9090"
    "ftu-server:3000"
    "auth-platform:3001"
    "mission-engine:3002"
    "ai-gm:3003"
    "achievement-service:3004"
    "combat-system:3005"
    "character-system:3006"
    "economy-system:3007"
    "chat-platform:3008"
    "marketplace-service:3009"
    "payment-platform:3010"
    "audio-generation:3011"
    "asset-management:3012"
    "code-generation:3013"
    "oracle-system:8080"
    "daisy-chain:3014"
)

HEALTHY_COUNT=0
TOTAL_SERVICES=${#SERVICES[@]}

for service in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service"

    if curl -s --max-time 5 "http://localhost:$port/health" > /dev/null 2>&1; then
        print_status "✓ $name (port $port) - HEALTHY"
        ((HEALTHY_COUNT++))
    else
        print_warning "⚠ $name (port $port) - UNHEALTHY or NO HEALTH ENDPOINT"
    fi
done

print_status "Service Health: $HEALTHY_COUNT/$TOTAL_SERVICES services responding"

# 6. Display Access Information
echo ""
print_status "🎮 ACCESS INFORMATION"
echo "================================================================="
echo "🌐 Main Game:        http://localhost:9090/game-new.html"
echo "📱 Mobile Game:      http://localhost:9090/mobile.html"
echo "🎯 Mission Engine:   http://localhost:3002 (MOCK)"
echo "🤖 AI GM:           http://localhost:3003 (MOCK)"
echo "🏆 Achievements:     http://localhost:3004 (MOCK)"
echo "⚔️ Combat System:   http://localhost:3005 (MOCK)"
echo "👤 Character Sys:   http://localhost:3006 (MOCK)"
echo "💰 Economy System:  http://localhost:3007 (MOCK)"
echo "💬 Chat Platform:   http://localhost:3008 (MOCK)"
echo "🏪 Marketplace:     http://localhost:3009 (MOCK)"
echo "💳 Payment:         http://localhost:3010 (MOCK)"
echo "🎵 Audio Gen:       http://localhost:3011 (REAL)"
echo "📦 Assets:          http://localhost:3012 (MOCK)"
echo "⚡ Code Gen:        http://localhost:3013 (MOCK)"
echo "🧠 Oracle:          http://localhost:8080 (MOCK)"
echo "🌸 Daisy Chain:     http://localhost:3014 (MOCK)"
echo "🔐 Auth:            http://localhost:3001 (REAL)"
echo ""
echo "📝 Logs:            ./logs/"
echo "🛑 Stop All:        ./stop-all-services.sh"
echo ""

# 7. Final Status
if [ $HEALTHY_COUNT -ge 10 ]; then
    print_status "🎉 MOST SERVICES STARTED SUCCESSFULLY!"
    print_status "🚀 Ready for comprehensive testing with full backend simulation!"
elif [ $HEALTHY_COUNT -ge 5 ]; then
    print_warning "⚠️ Partial success - core services running"
    print_status "Some services may need attention, but testing is possible"
else
    print_error "❌ Critical failure - check logs for details"
fi

print_status "Happy testing! 🎮✨"
