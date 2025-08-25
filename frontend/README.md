# Veylox Frontend

A modern, responsive logistics management platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Real-time Shipment Tracking**: Monitor shipments across multiple transport modes
- **Multi-modal Transportation**: Support for road, air, sea, and rail cargo
- **Route Optimization**: Intelligent route planning and optimization
- **Risk Assessment**: AI-powered risk scoring and mitigation
- **Disruption Management**: Real-time disruption detection and alerts
- **Inventory Management**: Comprehensive warehouse and inventory tracking

### Technical Features
- **Modern UI/UX**: Beautiful, responsive design with dark theme
- **Real-time Updates**: Live data updates and notifications
- **Interactive Maps**: Leaflet integration for shipment visualization
- **Data Visualization**: Charts and analytics with Recharts
- **AI Integration**: Chatbot and AI-powered insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM
- **Charts**: Recharts and Chart.js
- **Maps**: Leaflet with React Leaflet
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── Chatbot.tsx     # AI chatbot component
│   ├── DataTable.tsx   # Reusable data table
│   └── Modal.tsx       # Modal dialog component
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Shipments.tsx   # Shipment management
│   ├── ShipmentTracking.tsx  # Real-time tracking
│   └── ...            # Other page components
├── services/           # API services
│   ├── api.ts         # Base API configuration
│   ├── shipmentsAPI.ts # Shipment-related API calls
│   └── ...            # Other API services
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── utils/              # Utility functions
```

## 🎯 Key Pages

### Landing Page (`/`)
- Modern, animated landing page
- Feature showcase
- Team information
- Call-to-action sections

### Dashboard (`/app`)
- KPI overview cards
- Real-time statistics
- Interactive charts
- Recent activity feed
- AI chatbot integration

### Shipment Tracking (`/app/shipment-tracking`)
- Interactive map visualization
- Real-time location tracking
- Route visualization
- Status updates

### Shipment Creation (`/app/shipment-creation`)
- Multi-step shipment creation
- Route planning interface
- Carrier selection
- Cost estimation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Veylox
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
The project uses Tailwind CSS 4.1 with custom configuration in `tailwind.config.js`.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1920px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 320px - 767px

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: Black (#000000)
- **Surface**: White with opacity

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: For IDs and technical data

## 🔌 API Integration

The frontend integrates with the Veylox backend API for:
- Shipment management
- Real-time tracking
- User authentication
- Data analytics
- AI-powered insights

## 🤖 AI Features

### Chatbot
- Context-aware responses
- Shipment status queries
- Route optimization suggestions
- Risk assessment explanations

### Predictive Analytics
- ETA predictions
- Risk scoring
- Disruption forecasting
- Cost optimization

## 📊 Data Visualization

### Charts and Graphs
- **Bar Charts**: Weekly shipment trends
- **Line Charts**: Performance metrics
- **Pie Charts**: Transport mode distribution
- **Maps**: Interactive shipment tracking

### Real-time Updates
- WebSocket integration for live data
- Auto-refresh capabilities
- Push notifications

## 🔒 Security

- JWT token authentication
- Secure API communication
- Input validation
- XSS protection
- CSRF protection

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📈 Performance

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: WebP format support
- **Caching**: Efficient caching strategies
- **Bundle Optimization**: Tree shaking and minification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added AI chatbot and predictive analytics
- **v1.2.0**: Enhanced map visualization and real-time tracking

---

**Veylox** - Transforming logistics with intelligence and precision.
