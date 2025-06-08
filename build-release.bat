@echo off
setlocal enabledelayedexpansion

echo 🎮 EFT Stream Deck Timer Plugin - Build Script
echo ==============================================

REM バージョン設定
set VERSION=%1
if "%VERSION%"=="" set VERSION=1.0.0
echo 📦 Building version: %VERSION%

REM 依存関係の確認
echo 🔍 Checking dependencies...
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: npm is not installed
    exit /b 1
)

where streamdeck >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: Stream Deck CLI is not installed
    echo 💡 Install with: npm install -g @elgato/cli
    exit /b 1
)

REM クリーンアップ
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist *.streamDeckPlugin del *.streamDeckPlugin

REM 依存関係のインストール
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error: npm install failed
    exit /b 1
)

REM TypeScriptビルド
echo 🔨 Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Build failed
    exit /b 1
)

REM Stream Deckプラグインパッケージの作成
echo 📦 Creating Stream Deck plugin package...
call npm run package
if errorlevel 1 (
    echo ❌ Error: Package creation failed
    exit /b 1
)

REM 作成されたファイルの確認
if exist "com.gtech9971.eft-stream-deck-timer-plugin.streamDeckPlugin" (
    ren "com.gtech9971.eft-stream-deck-timer-plugin.streamDeckPlugin" "eft-raid-timer-v%VERSION%.streamDeckPlugin"
    
    echo ✅ Build completed successfully!
    echo 📁 Package created: eft-raid-timer-v%VERSION%.streamDeckPlugin
    echo.
    echo 🚀 Distribution files:
    echo   • eft-raid-timer-v%VERSION%.streamDeckPlugin (main installer)
    echo   • README.md (installation guide)
    echo   • LICENSE (MIT license)
    echo.
    echo 📋 Next steps:
    echo   1. Test the plugin: Double-click the .streamDeckPlugin file
    echo   2. Create GitHub release with the package file
    echo   3. Update version in package.json if needed
    echo.
    echo 🎯 Installation for end users:
    echo   Simply double-click eft-raid-timer-v%VERSION%.streamDeckPlugin
) else (
    echo ❌ Error: Package creation failed
    exit /b 1
)

pause