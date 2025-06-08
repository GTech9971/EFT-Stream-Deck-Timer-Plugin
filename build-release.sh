#!/bin/bash

# EFT Stream Deck Timer Plugin - Build & Package Script
# Usage: ./build-release.sh [version]

set -e

echo "🎮 EFT Stream Deck Timer Plugin - Build Script"
echo "=============================================="

# バージョン確認
VERSION=${1:-"1.0.0"}
echo "📦 Building version: $VERSION"

# 依存関係の確認
echo "🔍 Checking dependencies..."
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

if ! command -v streamdeck &> /dev/null; then
    echo "❌ Error: Stream Deck CLI is not installed"
    echo "💡 Install with: npm install -g @elgato/cli"
    exit 1
fi

# クリーンアップ
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -f *.streamDeckPlugin

# 依存関係のインストール
echo "📦 Installing dependencies..."
npm install

# TypeScriptビルド
echo "🔨 Building TypeScript..."
npm run build

# Stream Deckプラグインパッケージの作成
echo "📦 Creating Stream Deck plugin package..."
npm run package

# 作成されたファイルの確認
if [ -f "com.gtech9971.eft-stream-deck-timer-plugin.streamDeckPlugin" ]; then
    # ファイル名を変更
    mv "com.gtech9971.eft-stream-deck-timer-plugin.streamDeckPlugin" "eft-raid-timer-v${VERSION}.streamDeckPlugin"
    
    echo "✅ Build completed successfully!"
    echo "📁 Package created: eft-raid-timer-v${VERSION}.streamDeckPlugin"
    echo ""
    echo "🚀 Distribution files:"
    echo "  • eft-raid-timer-v${VERSION}.streamDeckPlugin (main installer)"
    echo "  • README.md (installation guide)"
    echo "  • LICENSE (MIT license)"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Test the plugin: Double-click the .streamDeckPlugin file"
    echo "  2. Create GitHub release with the package file"
    echo "  3. Update version in package.json if needed"
    echo ""
    echo "🎯 Installation for end users:"
    echo "  Simply double-click eft-raid-timer-v${VERSION}.streamDeckPlugin"
else
    echo "❌ Error: Package creation failed"
    exit 1
fi