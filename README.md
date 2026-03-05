# StockPulse — Stock Analysis Dashboard

A professional stock analysis dashboard for evaluating investments through fundamental analysis. Features a React frontend with a PostgreSQL-backed Express.js API server and Alpha Vantage integration for live market data.

## Features

- **Dashboard** — View key metrics (P/E, P/B, Market Cap, Dividend Yield), health scorecard, price chart, intrinsic value analysis, and risk gauge for any stock
- **Markets** — Browse top gainers, losers, and all tracked stocks in a sortable table
- **Portfolio** — Add/remove holdings, track P/L, and view total portfolio performance (stored in PostgreSQL)
- **Price Alerts** — Set above/below price alerts on any stock (stored in PostgreSQL)
- **Search** — Search by ticker with autocomplete suggestions and `Ctrl+K` shortcut
- **Live Data** — Alpha Vantage API integration with 15-minute server-side caching
- **Dark/Light Theme** — Toggle between dark and light mode from Settings
- **Responsive** — Mobile-friendly with collapsible sidebar and hamburger menu

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Recharts, Framer Motion |
| Backend | Express.js, TypeScript, PostgreSQL (pg), Axios |
| API | Alpha Vantage (free tier, 25 req/day) |

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running

### 1. Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create the database
CREATE DATABASE stockpulse;

-- Tables are auto-created on first server startup
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials and Alpha Vantage API key
npm install
npm run dev
```

The server runs on `http://localhost:3001`.

### 3. Frontend Setup

```bash
# From the project root
npm install
npm run dev
```

The app runs on `http://localhost:5173`. API calls are proxied to the backend.

### 4. Get Alpha Vantage API Key

1. Visit [alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Get your free key (25 requests/day)
3. Add it to `server/.env` as `ALPHA_VANTAGE_API_KEY`

## Project Structure

```
Stock-Analyser/
├── src/                    # React frontend
│   ├── components/         # Dashboard components
│   ├── pages/              # Route pages (Markets, Portfolio, Alerts, Settings)
│   ├── hooks/              # Custom hooks (useStockData, useTheme)
│   ├── services/           # API client
│   └── data/               # Mock data (fallback)
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # API routes (stocks, portfolio, alerts)
│       ├── services/       # Alpha Vantage integration
│       ├── db.ts           # PostgreSQL connection
│       ├── migrate.ts      # Auto-migration
│       └── index.ts        # Server entry point
├── index.html
├── vite.config.ts          # Vite config with API proxy
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/:symbol` | Fetch stock data (cached or live) |
| GET | `/api/portfolio` | List portfolio holdings |
| POST | `/api/portfolio` | Add a holding |
| DELETE | `/api/portfolio/:id` | Remove a holding |
| GET | `/api/alerts` | List price alerts |
| POST | `/api/alerts` | Create a price alert |
| DELETE | `/api/alerts/:id` | Delete an alert |
| GET | `/api/health` | Server health check |

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```
