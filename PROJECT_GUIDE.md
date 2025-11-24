# Disaster Response Application - Frontend

A modern disaster response application built with Angular 19 and DaisyUI, designed to help communities respond to natural disasters in the Philippines.

## Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **Styling**: Tailwind CSS 3 + DaisyUI
- **Icons**: Heroicons (via inline SVG)
- **Map Integration**: Placeholder ready for Leaflet/Google Maps

## Project Structure

```
src/app/
├── components/
│   ├── navbar/                    # Side navigation (10% width)
│   ├── weather-map/               # Weather view with evacuation centers
│   ├── emergencies-map/           # Emergencies view with filters
│   ├── weather-alert-card/        # Alert cards for weather warnings
│   ├── emergency-report-button/   # Quick action emergency reporting
│   ├── ai-chatbot-button/         # Floating AI assistant
│   └── plot-modal/                # Reusable modal for map plots
├── app.ts                         # Main app component
└── app.html                       # Main layout (navbar + map views)
```

## Features Implemented

### 1. Side Navbar (10% width)
- Logo at top
- Weather and Emergencies view toggles (center)
- User profile dropdown (bottom)
- Active state management

### 2. Weather Map View
- Philippines weather map placeholder
- Evacuation center markers with:
  - Name, location, capacity
  - Status badges (available/limited)
- Weather alert cards (bottom left):
  - Typhoon warnings
  - Storm surge alerts
  - Severity levels (high/medium/low)
- AI chatbot button (bottom right)

### 3. Emergencies Map View
- Philippines emergencies map placeholder
- Emergency type filters (top left):
  - Fire 🔥
  - Flood 🌊
  - Earthquake 🏚️
- Emergency markers with severity colors
- Quick action report button (bottom left)
- AI chatbot button (bottom right)

### 4. Components

#### Weather Alert Card
- Color-coded by severity (error/warning/info)
- Type-specific icons
- Actionable guidance messages

#### Emergency Report Button
- Large, prominent button
- Dropdown menu for emergency types
- One-tap reporting (GPS integration ready)

#### AI Chatbot
- Floating button
- Expandable chat window
- Pre-configured assistance topics:
  - Government aid applications
  - Emergency shelter locations
  - Document replacement
  - Recovery resources

#### Plot Modal
- Reusable for both evacuation centers and emergencies
- Context-aware content display
- "Get Directions" action button

## Running the Application

### Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`

### Build for Production
```bash
npm run build
```
Build artifacts will be in `dist/disaster-response-app/`

## Next Steps for Integration

### 1. Map Integration
Replace the gradient placeholders with actual maps:
- Install Leaflet: `npm install leaflet @types/leaflet`
- Or use Google Maps API
- Update `weather-map.html` and `emergencies-map.html`

### 2. n8n Workflow Integration
Connect emergency reporting and alerts:
```typescript
// In emergency-report-button.ts
reportEmergency(type: string) {
  // Get GPS coordinates
  navigator.geolocation.getCurrentPosition((position) => {
    const data = {
      type,
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: new Date()
    };

    // Send to n8n webhook
    fetch('YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  });
}
```

### 3. Dify AI Chatbot
Connect the chatbot to Dify API:
```typescript
// In ai-chatbot-button.ts
async sendMessage(message: string) {
  const response = await fetch('YOUR_DIFY_API_URL', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
    body: JSON.stringify({ query: message })
  });
  return response.json();
}
```

### 4. Real-time Weather Data
Connect to PAGASA API:
```typescript
// Create a weather service
async fetchWeatherAlerts() {
  const response = await fetch('PAGASA_API_ENDPOINT');
  return response.json();
}
```

### 5. SMS Integration
The n8n workflow should handle SMS:
- Trigger: Weather alerts from PAGASA
- Action: Send SMS via Twilio/similar service
- Include: Location-specific guidance

## DaisyUI Themes

The app supports multiple themes. Change in [tailwind.config.js](tailwind.config.js:8):
```javascript
daisyui: {
  themes: ["light", "dark", "cupcake"],
}
```

## Component Communication

```
App Component
├── activeView: 'weather' | 'emergencies'
├── Navbar (emits viewChange)
├── WeatherMap (shown when activeView === 'weather')
│   ├── WeatherAlertCard[]
│   └── AiChatbotButton
└── EmergenciesMap (shown when activeView === 'emergencies')
    ├── EmergencyReportButton
    └── AiChatbotButton
```

## Sample Data

All components contain sample data for demonstration:
- 3 evacuation centers (Quezon City, Manila, Cebu)
- 2 weather alerts (Typhoon Pepito, Storm Surge)
- 3 emergency reports (Fire, Flood, Earthquake)

Replace these with real API calls for production.

## Responsive Design

The layout uses:
- Flexbox for main structure (10% sidebar + 90% map)
- Tailwind utility classes for responsive behavior
- DaisyUI components for consistent UI
- Minimum sidebar width: 80px

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

Requires modern browser with ES6+ support.

## License

This project is part of a hackathon submission for disaster response in the Philippines.
