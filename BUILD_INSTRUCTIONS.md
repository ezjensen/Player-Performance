# Desktop Application Build Instructions

This guide explains how to build and distribute the Player Performance PDF Generator as a desktop application for Windows, macOS, and Linux.

## Prerequisites

1. **Node.js 16+** installed on your system
2. **Git** for cloning the repository  
3. All project dependencies installed (`npm install`)

## Build Commands

### Quick Build (Current Platform)
```bash
npm run dist
```
This builds for your current operating system only.

### Platform-Specific Builds

#### Windows
```bash
npm run dist:win
```
Creates:
- `Player Performance PDF Generator Setup 1.0.0.exe` (NSIS installer)
- `Player Performance PDF Generator 1.0.0.exe` (Portable executable)

#### macOS  
```bash
npm run dist:mac
```
Creates:
- `Player Performance PDF Generator-1.0.0.dmg` (Disk image installer)
- `Player Performance PDF Generator-1.0.0-mac.zip` (Archive)

#### Linux
```bash
npm run dist:linux  
```
Creates:
- `Player Performance PDF Generator-1.0.0.AppImage` (Universal Linux app)
- `player-performance_1.0.0_amd64.deb` (Debian package)

## Output Location

All built applications are saved to the `release/` directory in the project root.

## Cross-Platform Building

**Note**: While the source code is cross-platform, some build targets work best on their native platforms:

- **Windows**: Best built on Windows for code signing and advanced features
- **macOS**: Must be built on macOS for proper signing and notarization
- **Linux**: Can be built on any platform

## File Sizes

Expect the following approximate file sizes:
- **Windows**: 80-120 MB (installer), 150-200 MB (unpacked)
- **macOS**: 120-160 MB (DMG), 100-140 MB (ZIP)  
- **Linux**: 80-120 MB (AppImage), 70-100 MB (DEB)

## Installation

### Windows
- **Installer**: Run the `.exe` file and follow the setup wizard
- **Portable**: Extract and run the executable directly

### macOS
- **DMG**: Open the disk image and drag the app to Applications folder
- **ZIP**: Extract and move the `.app` to Applications folder

### Linux
- **AppImage**: Make executable (`chmod +x *.AppImage`) and run directly
- **DEB**: Install with `sudo dpkg -i *.deb` or through package manager

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear build cache: `rm -rf release/` and `rm -rf dist/`
- Update Electron: `npm update electron`

### Runtime Issues
- Check console logs in the app's DevTools (Ctrl+Shift+I / Cmd+Option+I)
- Verify Google API credentials are configured correctly
- Ensure network connectivity for Google APIs

## Development Mode

To run the desktop app in development mode:
```bash
npm run electron
```
This starts both the Vite dev server and Electron simultaneously.