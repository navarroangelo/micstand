# Project SINAG

**Smart Integrated Network Alert Guide**

A real-time disaster response application built with Angular 21, designed to help communities in Angeles City, Philippines respond effectively to natural disasters and emergencies.

## Overview

Project SINAG is a comprehensive disaster management system that provides real-time weather alerts, emergency reporting, evacuation center information, and interactive maps to help citizens and responders coordinate during disasters.

## Features

### Weather Monitoring
- **Real-time Weather Alerts**: Display active typhoon warnings, flood alerts, and other weather-related emergencies
- **Interactive Weather Map**: Leaflet-based map showing evacuation centers across Angeles City
- **Evacuation Centers**: 12 pre-mapped evacuation centers with capacity and availability status
  - Available centers (green markers)
  - Limited capacity centers (amber markers)
- **Center Information**: View capacity, status, and location details for each evacuation center

### Emergency Response
- **Emergency Reporting**: Citizens can report emergencies in real-time with:
  - Fire incidents
  - Flood events
  - Earthquake damage
- **GPS Location Tracking**: Automatic geolocation capture for accurate emergency positioning
- **Address Resolution**: Reverse geocoding to convert coordinates to human-readable addresses
- **Interactive Emergency Map**: Visual representation of all reported emergencies with:
  - Color-coded markers by emergency type
  - Severity indicators (high/medium/low)
  - Timestamp tracking
- **Real-time Updates**: Emergency data synced via JSONBin API
- **Webhook Notifications**: Automatic disaster notifications sent to external systems

### User Interface
- **Responsive Design**: Built with TailwindCSS and DaisyUI for mobile-first experience
- **Splash Screen**: Branded loading screen with Project SINAG branding
- **Dual-View Navigation**: Toggle between weather and emergency views
- **AI Chatbot Button**: Placeholder for future AI-powered disaster assistance
- **Statistics Dashboard**: Track emergencies by type and severity

## Technology Stack

- **Framework**: Angular 21.0.0
- **Mapping**: Leaflet 1.9.4
- **UI Styling**: TailwindCSS 3.4.7 + DaisyUI 4.12.14
- **Package Manager**: npm 11.4.2
- **Build Tool**: Angular CLI with Vite
- **Testing**: Vitest 4.0.8

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ai-chatbot-button/      # AI assistant interface
│   │   ├── emergency-report-button/ # Emergency reporting modal
│   │   ├── emergencies-map/         # Emergency incidents map view
│   │   ├── navbar/                  # Navigation sidebar
│   │   ├── plot-modal/              # Data visualization modal
│   │   ├── weather-alert-card/      # Weather alert display
│   │   └── weather-map/             # Weather and evacuation centers map
│   ├── app.ts                       # Main app component
│   ├── app.config.ts               # App configuration
│   └── app.routes.ts               # Route definitions
├── environments/
│   └── environment.ts              # Environment configuration
└── main.ts                         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (compatible with npm 11.4.2)
- Angular CLI 21.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd disaster-response-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update `src/environments/environment.ts` with your JSONBin API key

### Development Server

Start a local development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building for Production

Build the project:

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory, optimized for production.

### Running Tests

Execute unit tests with Vitest:

```bash
npm test
# or
ng test
```

## Key Components

### WeatherMap Component
- Displays evacuation centers on an interactive Leaflet map
- Shows weather alerts and warnings
- Provides evacuation center statistics and filtering

### EmergenciesMap Component
- Displays reported emergencies on a map
- Color-coded by emergency type (fire, flood, earthquake)
- Real-time data fetching from JSONBin API
- Statistics dashboard for emergency tracking

### EmergencyReportButton Component
- Modal-based emergency reporting interface
- Geolocation integration for accurate positioning
- Form validation for required fields
- Integration with JSONBin API and webhook notifications

### AiChatbotButton Component
- Placeholder for AI-powered disaster assistance
- Form-based chat interface ready for integration

## API Integration

The application integrates with:
- **JSONBin API**: For storing and retrieving emergency reports
- **OpenStreetMap Nominatim**: For reverse geocoding (coordinates to addresses)
- **Custom Webhook**: For sending disaster notifications to external systems

## Development

### Code Scaffolding

Generate new components:

```bash
ng generate component component-name
```

For available schematics:

```bash
ng generate --help
```

### Code Style

The project uses Prettier for code formatting:
- Print width: 100 characters
- Single quotes enabled
- Angular parser for HTML files

## Location

The application is centered on **Angeles City, Philippines** (coordinates: 15.1433°N, 120.5833°E) and includes data for local barangays and evacuation centers.

## Future Enhancements

- AI chatbot integration for disaster guidance
- Real-time weather API integration
- SMS/push notification system
- Multi-language support
- Historical disaster data analytics
- Resource management for evacuation centers

## Contributing

This project was built for disaster response and community safety. Contributions are welcome to enhance functionality and reach.

## License

This is a community safety project. Please use responsibly.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Leaflet Documentation](https://leafletjs.com)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [DaisyUI Components](https://daisyui.com)
