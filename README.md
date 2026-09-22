# 🧾 TeleExpense — Fintech Invoicing & Telegram Expense Tracker Suite

> **Your personal financial sidekick on Telegram 🧾✨** — Integrated with **Google Sheets**, **Stripe Billing**, and real-time **Cashflow Analytics**.  
> Built as a lean, production-ready SaaS ready to run locally and charge customers.

---

## 🌟 Key Features

### 1. 💼 Branded Invoicing Suite
- **Multiple Professional Templates:** Modern Indigo, Emerald Clean, Executive Dark, and Minimalist Slate.
- **Dynamic Line Items & Auto-Calculations:** Real-time subtotal, discount percentages, VAT/tax calculations, and grand totals.
- **Client Directory:** Auto-complete client information, billing addresses, and tax IDs.
- **Automated Recurring Invoices:** Support for Weekly, Monthly, Quarterly, and Yearly retainer billing schedules.
- **Invoice Status Lifecycle:** Real-time tracking of `Draft`, `Sent`, `Paid`, `Unpaid`, and `Overdue` invoices.
- **Vector-Sharp PDF Exports:** 1-click PDF generation powered by `jsPDF` and `html2canvas` + print stylesheets.
- **Shareable Public Invoice Links:** Hosted links (`/view/[id]`) for clients to review and pay invoices.

### 2. 🤖 Telegram AI Expense Sidekick
- **Natural Language Parsing (NLP):** Log expenses in 2 seconds simply by typing natural text to your Telegram Bot:
  - `"Spent $45 on lunch with Acme client"` &rarr; Extracts `$45.00`, Category: `Meals`, Merchant: `Acme`.
  - `"AWS cloud hosting 145.20 #software"` &rarr; Extracts `$145.20`, Category: `Software`, Merchant: `AWS`.
  - `"Uber ride to airport $32.50 category:travel"` &rarr; Extracts `$32.50`, Category: `Travel`, Merchant: `Uber`.
  - `"/invoice Acme Corp 500 Web design"` &rarr; Automatically drafts a new invoice!
  - `"/summary"` &rarr; Instant breakdown of revenue, expenses, and net profit.
- **Built-in Interactive Simulator:** Test the Telegram Bot experience directly in the web browser without requiring a live Telegram bot token!
- **Official Webhook Integration:** Live webhook handler (`/api/telegram/webhook`) ready for your official Telegram Bot token.

### 3. 📊 2-Way Google Sheets Sync & Financial Exports
- **Instant CSV Downloads:** 1-click export for Invoices, Expenses, and Profit & Loss (P&L) Reports.
- **Google Apps Script Live Sync:** Copy-pasteable Apps Script template included in the UI to automatically sync rows between any Google Sheet and TeleExpense.
- **Live Data Sheet Preview:** Real-time view of synced spreadsheet data directly in your dashboard.

### 4. 💳 Stripe Monetization & Paid Tiers
- **Tiered Pricing Structure:**
  - **Starter (Free / $0):** 5 invoices/mo, 20 expenses, basic templates.
  - **Pro Sidekick ($19/mo or $190/yr):** Unlimited invoices, Telegram Bot NLP sync, Google Sheets live sync, recurring invoices, custom branding, and PDF exports.
  - **Business Scale ($49/mo):** Multi-currency, custom domain links, priority webhooks, dedicated accountant reports.
- **Stripe Test Mode Ready:** Live Stripe Checkout sessions (`/api/stripe/checkout`), Customer Billing Portal, and Webhooks.
- **Zero-Friction Sandbox Fallback:** If Stripe keys are not yet configured, the app simulates upgrades seamlessly so you and your testers can experience the full paid flow instantly.

### 5. 🔒 Email/Password Auth & 1-Click Instant Demo
- Secure JWT sessions stored in HTTP-only cookies (`jose` + `bcryptjs`).
- 1-Click Instant Demo login button for immediate evaluation.

---

## 🚀 Quickstart: Run Locally

### Prerequisites
- Node.js 18+ or 20+ (tested on Node v22)
- npm, pnpm, or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd TeleExpense
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default contents of `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=teleexpense_super_secret_jwt_key_2026_xyz
STRIPE_SECRET_KEY=sk_test_placeholder_key
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key
STRIPE_WEBHOOK_SECRET=whsec_placeholder_secret
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Demo Account Credentials:**
  - **Email:** `demo@teleexpense.io`
  - **Password:** `demo1234`
  - *(Or simply click the "1-Click Instant Demo" button on the sign-in page!)*

---

## 🛠️ Configuration & Integrations

### 1. Setting up Telegram Bot (Optional for Live Telegram App)
1. Open Telegram and message [@BotFather](https://t.me/BotFather) to create a new bot (e.g. `@MyTeleExpenseBot`).
2. Copy the **Bot Token** and set it in your `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   ```
3. Set your webhook URL (using your production domain or ngrok):
   ```bash
   curl -F "url=https://your-domain.com/api/telegram/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```
4. Start a chat with your bot and send `/connect <YOUR_6_DIGIT_CODE>` (found on the Telegram tab in the dashboard).

### 2. Setting up Google Sheets 2-Way Sync
1. In your dashboard, go to the **Google Sheets** tab.
2. Enter your Google Spreadsheet URL and Sheet name.
3. Click **Copy Script** to copy the generated Google Apps Script code.
4. In your Google Sheet, open **Extensions &gt; Apps Script**, paste the code, and click **Save**.
5. Any expense edited in your sheet will automatically synchronize with TeleExpense!

### 3. Setting up Stripe Payments
1. Create a free account at [Stripe.com](https://stripe.com).
2. Grab your **Publishable Key** and **Secret Key** from **Developers &gt; API Keys** (Test Mode).
3. Set them in your `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_51...
   STRIPE_PUBLISHABLE_KEY=pk_test_51...
   ```
4. Configure your Stripe Webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook` listening for `checkout.session.completed` and `customer.subscription.deleted`.

---

## 🚢 Deployment Guide

### Option 1: Vercel (Recommended - 1 Click)
1. Push your repository to GitHub / GitLab.
2. Go to [Vercel](https://vercel.com) &gt; **Add New Project** &gt; Select your repo.
3. Add your Environment Variables (`JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, etc.).
4. Click **Deploy**.

### Option 2: Docker / Docker Compose
Build and run using Docker:
```bash
docker-compose up -d --build
```
The application will be running on port `3000` with persistent storage mounted to `./data`.

### Option 3: Railway / Render
1. Create a new Web Service on Railway or Render connected to your GitHub repo.
2. Select **Dockerfile** or Node build command: `npm run build` and start command: `npm start`.
3. Set environment variables.

---

## 📁 Project Architecture

```
TeleExpense/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Registration pages
│   │   ├── api/
│   │   │   ├── auth/           # Login, Register, Me, Logout API routes
│   │   │   ├── clients/        # Client CRUD API
│   │   │   ├── expenses/       # Expense CRUD & Categorization API
│   │   │   ├── invoices/       # Invoices CRUD & Calculation API
│   │   │   ├── sheets/         # CSV Export & 2-Way Sync API
│   │   │   ├── stripe/         # Stripe Checkout, Portal & Webhooks
│   │   │   └── telegram/       # Telegram Webhook & NLP Simulator API
│   │   ├── clients/            # Client directory page
│   │   ├── dashboard/          # Analytics & Financial KPI dashboard
│   │   ├── expenses/           # Expense tracker & filtering page
│   │   ├── invoices/           # Invoices list, new builder, and edit
│   │   ├── pricing/            # Paid tiers & billing page
│   │   ├── settings/           # Business profile & branding settings
│   │   ├── sheets/             # Google Sheets 2-way sync page
│   │   ├── telegram/           # Telegram pairing & chat interface
│   │   ├── view/[id]/          # Public client-facing invoice view
│   │   ├── layout.tsx          # Root layout & providers
│   │   └── page.tsx            # High-converting Fintech landing page
│   ├── components/
│   │   ├── dashboard/          # MetricCard, CashflowChart, RecentInvoicesTable
│   │   ├── invoice/            # InvoiceForm, InvoicePreview, InvoicePDF, Templates
│   │   ├── landing/            # Hero, InteractiveDemo, Features, Pricing, Testimonials
│   │   ├── providers/          # AuthProvider context
│   │   └── ui/                 # Navbar, Sidebar, Header, TelegramSimulatorModal
│   ├── data/
│   │   └── db.json             # Persistent local database store
│   └── lib/
│       ├── auth.ts             # JWT authentication & password hashing
│       ├── db.ts               # File-persisted JSON database engine & seed data
│       ├── sheetsExporter.ts   # CSV exporter & Google Apps Script generator
│       ├── telegramParser.ts   # AI NLP Telegram message parsing engine
│       ├── types.ts            # Core TypeScript schemas
│       └── utils.ts            # Formatting, currency & helper utilities
├── Dockerfile                  # Production container configuration
├── docker-compose.yml          # Container orchestration
└── package.json
```

---

## 📄 License
This project is open-source and customizable for commercial and personal SaaS operations.
Starting base inspired by [al1abb/invoify](https://github.com/al1abb/invoify).
