#!/bin/bash

# Installation script for all features

echo "🚀 Installing Feature Dependencies..."

# Frontend
echo "📦 Installing frontend dependencies..."
npm install

# Playwright
echo "🎭 Installing Playwright..."
npm install -D @playwright/test
npx playwright install --with-deps

# Backend
echo "🔗 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start backend: cd backend && python -m uvicorn app.main:app --reload"
echo "2. Start frontend: npm run dev"
echo "3. Run E2E tests: npm run test:e2e"
echo ""
echo "📚 Documentation:"
echo "- FEATURES_IMPLEMENTED.md - Complete feature overview"
echo "- SPRINT_SUMMARY.md - Implementation summary"
echo "- tests/e2e/README.md - Testing guide"
