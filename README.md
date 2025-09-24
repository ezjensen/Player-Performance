# Player Performance PDF Generator - React Native Desktop

A cross-platform desktop application built with **React Native for Windows and macOS** that automates the generation of individual PDF performance reports for athletes from Google Sheets data.

## Overview

This application provides a native desktop experience for both Windows and macOS users, offering:

- **Cross-Platform Compatibility**: Single codebase running natively on Windows 10+ and macOS 10.14+
- **Native Performance**: Built with React Native for optimal desktop performance
- **Modern UI**: Clean, intuitive interface following platform design guidelines
- **Google Sheets Integration**: Seamlessly connect with Google Sheets for data management
- **Automated PDF Generation**: Bulk generate personalized performance reports
- **Offline Capability**: Core functionality available without internet connection

## Technology Stack

### Core Framework
- **React Native**: Cross-platform mobile framework adapted for desktop
- **React Native Windows**: Native Windows desktop support
- **React Native macOS**: Native macOS desktop support
- **TypeScript**: Type-safe development and better code quality

### Navigation & UI
- **React Navigation**: Drawer and stack navigation patterns
- **React Native Vector Icons**: Consistent iconography across platforms
- **React Native Safe Area Context**: Handle platform-specific safe areas
- **React Native Gesture Handler**: Smooth gesture interactions

### Data & Storage
- **AsyncStorage**: Persistent local data storage
- **React Native FS**: File system operations for PDF handling
- **React Native Document Picker**: Native file selection dialogs

### External Integrations
- **Google Sheets API v4**: Data extraction and manipulation
- **Google Drive API**: File access and permissions
- **Google OAuth 2.0**: Secure authentication

## Features

### 🚀 Cross-Platform Desktop App
- **Windows**: Windows 10 version 1903 (build 18362) or later
- **macOS**: macOS 10.14 (Mojave) or later
- Native window management and system integration
- Platform-specific UI adaptations

### 🎨 Modern Native UI
- Material Design principles with platform adaptations
- Drawer navigation for easy section access
- Responsive layouts adapting to window sizes
- Dark and light theme support with system preference detection

### 🔐 Secure Authentication
- Google OAuth 2.0 integration
- Secure token storage
- Automatic token refresh
- Cross-platform authentication flows

### 📊 Google Sheets Integration
- Browse and select Google Sheets files
- Extract player data from "Profiles" sheets
- Update "Dashboard" sheets with player information
- Comprehensive error handling for missing sheets

### 📄 PDF Generation & Management
- Automated PDF generation from Google Sheets
- Batch processing with progress tracking
- Local PDF storage in Documents directory
- File sharing capabilities using platform APIs

### ⚙️ Customization & Settings
- Company branding with logo support
- Configurable themes (Light/Dark/System)
- Google API credentials management
- Persistent settings storage

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── FilePicker.tsx      # Google Sheets file selection
│   ├── ProgressBar.tsx     # Processing progress display
│   └── Settings.tsx        # Application settings modal
├── contexts/               # React contexts for state management
│   └── SettingsContext.tsx # Theme and settings management
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared interfaces and types
├── utils/                  # Utility functions and services
│   ├── googleApi.ts       # Google APIs integration
│   └── sheetsApi.ts       # Google Sheets operations
└── App.tsx                # Main application with navigation
```

## Prerequisites

### Development Environment
- **Node.js**: 18.0.0 or later
- **npm**: 9.0.0 or later
- **React Native CLI**: Latest version

### Windows Development
- **Windows 10 SDK**: Version 18362 or later
- **Visual Studio 2019/2022**: With C++ workload
- **Windows 10**: Version 1903 or later

### macOS Development
- **Xcode**: 12.0 or later
- **macOS**: 10.14 or later
- **CocoaPods**: Latest version

## Setup and Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Player-Performance

# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..
```

### 2. Platform Setup

#### Windows Setup
```bash
# Install Windows platform
npx react-native-windows-init --overwrite

# Build for Windows
npm run windows
```

#### macOS Setup
```bash
# Install macOS platform (if not already present)
npx react-native-macos-init

# Build for macOS
npm run macos
```

### 3. Google API Configuration

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google Sheets API and Google Drive API

2. **Create OAuth Credentials**:
   - Go to "Credentials" in Google Cloud Console
   - Create OAuth 2.0 Client ID for Desktop application
   - Download credentials JSON file

3. **Configure Application**:
   - Add credentials in app settings
   - Configure redirect URIs for OAuth flow

## Running the Application

### Development Mode

```bash
# Start Metro bundler
npm start

# Run on Windows (separate terminal)
npm run windows

# Run on macOS (separate terminal)
npm run macos
```

### Production Build

```bash
# Build for Windows
npm run build-windows

# Build for macOS
npm run build-macos
```

## Application Workflow

### 1. Initial Setup
- Launch application
- Configure Google API credentials in Settings
- Authenticate with Google account

### 2. File Selection
- Navigate to "File Selection" screen
- Click "Choose File" to browse Google Sheets
- Select spreadsheet containing:
  - **"Profiles" sheet**: Player names (Column A), Teams (Column B)
  - **"Dashboard" sheet**: Report template

### 3. Data Processing
- Review extracted player data
- Navigate to "Processing" screen
- Monitor real-time progress of PDF generation
- View detailed logs for each player

### 4. Results Management
- Access generated PDFs in Documents folder
- View processing summary and error logs
- Share or export results as needed

## Configuration Options

### Settings Screen Features
- **Theme Selection**: Light, Dark, or System preference
- **Company Branding**: 
  - Upload and manage company logo
  - Set company name for reports
- **Google API Configuration**:
  - Client ID and Client Secret management
  - OAuth flow configuration
- **File Preferences**:
  - Default save locations
  - PDF naming conventions

### Advanced Configuration
- Custom formula support for score calculations
- Configurable PDF export ranges
- Batch size optimization for performance
- API rate limiting configuration

## Google Sheets Requirements

### "Profiles" Sheet Structure
```
Row 1: Headers (optional)
Row 2+: 
  Column A: Player Name
  Column B: Team Name
```

### "Dashboard" Sheet Structure
- Template sheet for PDF generation
- Cell A1: Player name (auto-populated)
- Cell B1: Team name (auto-populated) 
- Cell D8: Score formula (configurable)
- Additional data and formatting as needed

## Platform-Specific Features

### Windows Features
- Windows 10 notification support
- File association for .xlsx files
- Windows Explorer integration
- Taskbar progress indication

### macOS Features
- macOS native file dialogs
- Spotlight search integration
- macOS notification center
- Touch Bar support (compatible devices)

## Development

### Code Architecture
The application follows React Native best practices:

- **Component-Based Architecture**: Reusable UI components
- **Context API**: Global state management
- **TypeScript**: Type safety and better developer experience
- **Async Operations**: Non-blocking user interface
- **Error Boundaries**: Graceful error handling

### Platform Adaptations
```typescript
import { Platform } from 'react-native';

const platformSpecificStyle = Platform.select({
  windows: { backgroundColor: '#f0f0f0' },
  macos: { backgroundColor: '#ffffff' },
  default: { backgroundColor: '#f5f5f5' },
});
```

### Custom Hooks
- `useSettings`: Settings management and persistence
- `useGoogleAuth`: Google authentication state
- `useFileSelection`: File picker and validation

## API Integration

### Google Sheets API
- Authenticate using OAuth 2.0
- Read data from specified ranges
- Update cells with player information
- Create and manage logging sheets

### File Operations
- Save PDFs to platform-specific Documents folder
- Handle file conflicts and overwrites
- Provide file sharing capabilities
- Support bulk operations

## Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Memory Management**: Efficient data handling
- **Background Processing**: Non-blocking PDF generation
- **Caching**: Persistent data and authentication tokens
- **Rate Limiting**: Respect Google API quotas

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Ensure all platform SDKs are installed
   - Clear Metro cache: `npx react-native start --reset-cache`
   - Rebuild dependencies: `npm install && cd ios && pod install`

2. **Authentication Issues**:
   - Verify Google OAuth credentials
   - Check redirect URI configuration
   - Ensure APIs are enabled in Google Cloud Console

3. **File Access Errors**:
   - Confirm Google Sheets permissions
   - Verify sheet structure and naming
   - Check internet connectivity

### Debug Mode
```bash
# Enable debug logging
npx react-native log-android  # For Android debugging
npx react-native log-ios      # For iOS debugging
```

## Distribution

### Windows Distribution
- Create MSIX package for Windows Store
- Generate installer using tools like Electron Builder
- Code signing for trusted installation

### macOS Distribution
- Create .app bundle for macOS
- Notarization for macOS Catalina+
- Mac App Store distribution

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Support

### Getting Help
- Check troubleshooting section above
- Review React Native Windows/macOS documentation
- Google Sheets API documentation
- Create issue in repository for bugs

### System Requirements
- **Windows**: Windows 10 version 1903 or later
- **macOS**: macOS 10.14 (Mojave) or later
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 100MB for application, additional for PDFs

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

**🚀 Built with React Native for Cross-Platform Desktop Excellence**