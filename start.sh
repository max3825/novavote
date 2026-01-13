#!/bin/bash
set -e

echo "🚀 Starting NovaVote Stack..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with secure passwords before production!"
fi

# Build and start services
echo "🐳 Building Docker images..."
docker compose build

echo "🔄 Starting services..."
docker compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "📊 Running database migrations..."
docker compose exec -T api alembic upgrade head

echo "✅ Stack is ready!"
echo ""
echo "Services:"
echo "  Frontend: http://localhost:3005"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop:      docker compose down"
