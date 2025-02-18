# Voice AI Analytics Platform

A full-stack web application for analyzing voice calls, tracking metrics, and managing AI-powered call campaigns.

## Features

- Real-time call analytics and metrics
- Campaign management and tracking
- Agent performance monitoring
- Sentiment analysis visualization
- Call recording management
- Webhook integration for call data
- Dark/Light theme support
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Query for data fetching
- Recharts for data visualization

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- Winston for logging
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- PowerShell (for Windows users)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd voice-analytics
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the MongoDB connection string and other configurations

4. Start MongoDB:
   - Windows users can run `setup-mongodb.ps1`
   - Linux/Mac users should ensure MongoDB is running

## Running the Application

1. Start the backend server (from the backend directory):
```bash
npm run dev
```

2. Start the frontend development server (from the frontend directory):
```bash
npm run dev
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Testing Webhooks

You can test the webhook integration using the provided scripts:

```bash
# From the backend directory
npm run test:webhook
```

Or use the PowerShell script:
```powershell
./send-webhook.ps1
```

## Project Structure

```
voice-analytics/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── theme/
│   │   └── api/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── scripts/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Webhook Endpoints
- `POST /api/webhook/call` - Receive call data
- `POST /api/webhook/test` - Test webhook configuration

### Metrics Endpoints
- `GET /api/metrics` - Get overall metrics
- `GET /api/metrics/performance` - Get performance data
- `GET /api/calls` - Get call history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team. 