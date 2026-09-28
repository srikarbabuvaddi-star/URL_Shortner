# LinkPulse — Intelligent URL Shortener & Campaign Analytics Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-black.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-35%20Passed-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**LinkPulse** is a production-grade, multi-user URL shortening and multi-channel campaign attribution platform. It bridges the gap between digital marketing campaigns, dynamic physical QR collateral, and deep visitor analytics with real-time performance and privacy-first architecture.

---

## 🌟 Key Features

### 🔗 URL Shortening & Lifecycle Management
- **High-Performance Redirect Engine:** Sub-5ms redirects backed by Redis caching with automated cache invalidation.
- **Custom Aliases:** Claim branded vanity slugs (e.g., `linkpulse.io/techfest2026`).
- **Complete Link Lifecycle:** Full support for `ACTIVE`, `DISABLED`, `EXPIRED`, and `BLOCKED` states.
- **Smart Link Expiration:** Configure exact expiration timestamps. Visitors to expired links see a dedicated, customizable expiration page.
- **Activity Tracking:** Explicit distinction between allowed status (`ACTIVE`) and real visitor activity (`last_clicked_at`).

### 📱 Dynamic QR Code Generation & Attribution
- **Decoupled Dynamic QR Codes:** QR codes always encode the **short URL**, never the final destination. Change destination URLs anytime without reprinting posters or billboards.
- **Vector & Raster Formats:** Instant preview and one-click downloads in high-res **PNG** or scalable **SVG**.
- **Download Metrics:** Tracks QR code generation and download counts.
- **QR-Attributed Traffic:** Accurately isolates visits originating from dedicated physical collateral channels (posters, banners, flyers).

### 📊 Multi-Channel Campaign Attribution
- **Campaign Organization:** Group links under marketing initiatives (e.g., *"College Tech Fest 2026"*).
- **UTM & Channel Tracking:** Compare performance across channels (Instagram, WhatsApp, YouTube, Poster QR, Banner QR).
- **Direct Side-by-Side Comparison:** Identify top-converting channels with bar and pie charts.

### 📈 Deep, Privacy-Conscious Analytics
- **Total Clicks vs. Unique Visitors:** Salted cookie-based visitor identification (`lp_vid`) prevents inflating clicks into unique visitor counts.
- **Breakdowns:** Real-time metrics across Device (Mobile, Desktop, Tablet), Browser, Operating System, Country, Region, and Referrer.
- **Bot & Crawler Filtering:** Automatically detects and isolates crawlers (Googlebot, Bingbot, preview crawlers).
- **GDPR & CCPA Compliant:** IP addresses are never stored in plain text; anonymized via HMAC-SHA256 with server-side secrets.
- **Exporting:** Download analytical records directly as **CSV** or **JSON**.

### 🛡️ Protected Platform Administration (RBAC)
- **Role-Based Access Control:** Strict `USER` vs. `ADMIN` roles enforced cryptographically on backend endpoints.
- **Invisible Admin Route:** Normal user interfaces contain no administrative buttons or leaks. Access is strictly gated at `/admin`.
- **User Moderation:** Search, review, suspend, or reactivate user accounts.
- **Link Moderation:** Global search, audit, and platform-wide link blocking.
- **Domain Blocklist:** Prevent shortening known phishing, malware, or spam domains.
- **Audit Logging:** Every sensitive admin action is permanently recorded in an immutable audit ledger.
- **System Health Monitor:** Live visibility into API uptime, Database status, Redis connectivity, and background queues.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router 6, Recharts, Lucide Icons, Modern Vanilla CSS |
| **Backend** | Node.js, Express.js 5, TypeScript, REST API, Zod/Joi validation |
| **Database & ORM** | PostgreSQL (Production) / SQLite (Zero-dependency local dev), Prisma ORM |
| **Caching** | Redis with automatic fallback to high-speed in-memory cache |
| **QR Code Engine** | `qrcode` library with PNG raster & SVG vector rendering |
| **Testing** | Vitest, Supertest (35 integration tests across 6 suites) |
| **Containerization** | Docker, Docker Compose, Multi-stage Alpine builds |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/linkpulse.git
cd linkpulse

# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The default `.env` is pre-configured to run out of the box with zero external dependencies using SQLite).*

### 3. Initialize & Seed Database
```bash
# Push database schema
npm run prisma:push

# Seed admin account, sample user, Tech Fest 2026 campaign, and 200+ analytics events
npm run prisma:seed
```

### 4. Start Development Servers
```bash
npm run dev
```
- **Web App:** `http://localhost:5173`
- **Backend API & Redirect Server:** `http://localhost:5000`

---

## 🔑 Default Credentials (from Seed)

| Role | Email | Password | Access URL |
|---|---|---|---|
| **Administrator** | `admin@linkpulse.io` | `AdminPassword2026!` | `http://localhost:5173/admin` |
| **Standard User** | `alex@linkpulse.io` | `Password123!` | `http://localhost:5173/dashboard` |

---

## 🧪 Automated Testing

LinkPulse includes an extensive automated test suite covering authentication, RBAC, link lifecycles, redirects, QR codes, campaign attribution, and admin moderation:

```bash
# Run test suite
npm test
```
**Test Results: 6 Test Suites Passed, 35 Tests Passed (100% Pass Rate)**

---

## ⚡ Running Directly with Node.js (Zero Docker Needed)

LinkPulse runs 100% natively on your machine with zero external dependencies:
- **No Docker required.**
- **No external PostgreSQL service required** (uses built-in SQLite `prisma/dev.db`).
- **No external Redis service required** (uses built-in high-speed in-memory cache).

To run locally in development mode:
```bash
npm run dev
```

To run in production mode:
```bash
npm run build
npm start
```

---

## 🌐 Production Deployment

### Frontend (e.g. Vercel)
1. Set Framework Preset to **Vite**.
2. Root Directory: `./`
3. Build Command: `npm run build:client`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_URL=https://api.yourdomain.com`

### Backend (e.g. Render / Railway / Fly.io)
1. Build Command: `cd server && npm ci && npm run build`
2. Start Command: `node server/dist/server.js`
3. Set Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string
   - `JWT_SECRET`: Random 32+ character string
   - `APP_URL`: `https://api.yourdomain.com`
   - `FRONTEND_URL`: `https://yourdomain.com`
   - `ANALYTICS_HASH_SECRET`: Random 32+ character string

---

## 📚 Documentation Index

- [System Architecture](file:///c:/Users/hi/Desktop/URL_Shortner/docs/architecture.md)
- [REST API Reference](file:///c:/Users/hi/Desktop/URL_Shortner/docs/api.md)
- [Database Schema & Data Dictionary](file:///c:/Users/hi/Desktop/URL_Shortner/docs/database.md)
- [Security & Privacy Guide](file:///c:/Users/hi/Desktop/URL_Shortner/docs/security.md)

---

## 📄 License
MIT © 2026 LinkPulse Technologies Inc.
