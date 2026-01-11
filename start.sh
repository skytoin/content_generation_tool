#!/bin/bash

# ContentForge AI - One-Click Launcher
# This script sets up and launches your AI content agency

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║              ContentForge AI - Quick Launcher                 ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "✓ Node.js found: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm found: $(npm -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Configuration needed. Running setup..."
    echo ""
    node scripts/setup.js
else
    echo "✓ Configuration found"
    echo ""
    echo "What would you like to do?"
    echo "1) Start development server"
    echo "2) Build for production"
    echo "3) Run setup again"
    echo "4) Exit"
    echo ""
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            echo ""
            echo "🚀 Starting development server..."
            echo "   Open http://localhost:3000 in your browser"
            echo ""
            npm run dev
            ;;
        2)
            echo ""
            echo "📦 Building for production..."
            npm run build
            echo ""
            echo "✓ Build complete! Deploy the .next folder to your host."
            ;;
        3)
            node scripts/setup.js
            ;;
        4)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
fi
