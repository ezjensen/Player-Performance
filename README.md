# Player Performance PDF Generator

A modern web application that automates the generation of individual PDF performance reports for athletes listed in a Google Sheet. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Google OAuth Authentication** - Secure access to Google Drive and Sheets
- 📊 **Google Sheets Integration** - Extract player data from Google Sheets
- 📄 **Automated PDF Generation** - Generate individual performance reports
- 🎨 **Modern UI** - Clean, responsive design with dark/light theme support
- ⚙️ **Customizable Settings** - Company logo and branding options
- 📈 **Progress Tracking** - Real-time processing status with detailed logging
- 🔄 **Batch Processing** - Handles multiple players with rate limiting
- 💾 **Comprehensive Logging** - All operations logged to Google Sheets

## Requirements

- Node.js 16 or higher
- Google Cloud Platform project with APIs enabled
- Windows 10 or higher (as specified in requirements)

## Setup

### 1. Google Cloud Platform Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API
   - Google Picker API
4. Create credentials:
   - **API Key**: For accessing public APIs
   - **OAuth 2.0 Client ID**: For user authentication

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd Player-Performance

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

### 3. Environment Configuration

Edit `.env` file with your Google Cloud credentials:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Run the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### 1. Google Sheets Structure

Your Google Sheet must contain these sheets:

#### "Profiles" Sheet
- Column A: Player names (starting from row 2)
- Column B: Team names (starting from row 2)

#### "Dashboard" Sheet
- Used for PDF generation
- Player name will be set in cell A1
- Team name will be set in cell B1
- Score formula will be set in cell D8 (customizable)

### 2. Application Workflow

1. **Sign In**: Authenticate with Google
2. **Select File**: Choose your Google Sheet using the file picker
3. **Review Players**: Verify extracted player data
4. **Generate PDFs**: Click "Generate PDFs" to start batch processing
5. **Monitor Progress**: Watch real-time progress and logging
6. **Download Results**: PDFs are automatically downloaded

### 3. Customization

- **Theme**: Switch between light, dark, or system theme
- **Company Logo**: Upload your company logo in settings
- **Company Name**: Set your organization name
- **Score Formula**: Modify the formula used in cell D8 of the Dashboard sheet

## File Structure

```
src/
├── components/          # React components
│   ├── FilePicker.tsx   # Google Drive file selection
│   ├── ProgressBar.tsx  # Processing progress display
│   └── Settings.tsx     # Application settings
├── contexts/            # React contexts
│   └── SettingsContext.tsx # Theme and settings management
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── googleApi.ts    # Google APIs integration
│   └── sheetsApi.ts    # Google Sheets operations
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## API Integration

### Google APIs Used

- **Google Sheets API v4**: Reading player data, updating dashboard, logging results
- **Google Drive API v3**: File access and permissions
- **Google Picker API**: File selection interface
- **Google OAuth 2.0**: User authentication

### Rate Limiting

The application includes built-in rate limiting:
- 2-second delay between PDF generations
- Proper error handling for API limits
- Automatic retry logic for transient errors

## Security

- OAuth 2.0 authentication ensures secure access
- API keys are environment-based and not exposed
- All operations are performed client-side
- No sensitive data is stored on external servers

## Error Handling

The application provides comprehensive error handling:
- Missing required sheets detection
- API rate limit management
- Network error recovery
- Detailed error logging in Google Sheets

## Troubleshooting

### Common Issues

1. **"Google APIs not loaded"**
   - Check internet connection
   - Verify API keys are correct
   - Ensure APIs are enabled in Google Cloud Console

2. **"Sheet not found" errors**
   - Verify your Google Sheet has "Profiles" and "Dashboard" sheets
   - Check sheet names are exactly as specified (case-sensitive)

3. **PDF generation fails**
   - Ensure proper permissions on the Google Sheet
   - Check for API rate limiting
   - Verify the Dashboard sheet structure

### Support

For issues related to Google APIs:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.