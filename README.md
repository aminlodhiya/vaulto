# 🏛️ Vaulto — Financial Operating System for Modern Studios & Solo Operators

> **The refined financial operating system.** Effortless branded invoicing, automated Telegram expense capture, real-time Google Sheets 2-way sync, and instant Stripe monetization.
> Designed with a **bespoke, luxury editorial aesthetic** — pure monochrome contrast, deep obsidian canvas, warm pearl surfaces, Swiss-style typography, and zero tacky gradients.

---

## 🌟 Core Feature Suite

### 1. 💼 High-Fidelity Branded Invoicing
- **Bespoke Editorial Templates:**
  - **Modern Minimalist (Obsidian):** Monospace metrics, stark black/white hierarchy, clean hairline dividers.
  - **Emerald Ledger:** Classic banking forest emerald accents, structured tabular layout, clean ledger lines.
  - **Executive Charcoal:** High-density corporate layout tailored for agencies and consultancy retainers.
- **Dynamic Line Items & Live Calculations:** Subtotal, line discounts, VAT/sales tax auto-computation, and grand totals.
- **Client Directory & Autocomplete:** Store client addresses, corporate tax numbers, and payment terms.
- **Automated Recurring Cycles:** Retainer schedules (Weekly, Monthly, Quarterly, Yearly).
- **Invoice Lifecycle Management:** Real-time state management for `Draft`, `Sent`, `Paid`, `Unpaid`, and `Overdue`.
- **Vector-Sharp PDF Exports:** Client-side vector PDF generation powered by `jsPDF` and `html2canvas` with print stylesheets.
- **Shareable Public Invoice URLs:** Clean hosted payment view (`/view/[id]`) for clients to review and settle invoices directly.

### 2. 🤖 Telegram AI Expense Capture & Sandbox
- **Natural Language Parsing (NLP):** Log expenses in under two seconds simply by typing natural sentences:
  - `"Spent $45 on lunch with Acme team"` &rarr; Extracts `$45.00`, Category: `Meals`, Merchant: `Acme`.
  - `"AWS cloud infrastructure 145.20 #software"` &rarr; Extracts `$145.20`, Category: `Software`, Merchant: `AWS`.
  - `"Uber ride to client office $32.50 category:travel"` &rarr; Extracts `$32.50`, Category: `Travel`, Merchant: `Uber`.
  - `"/invoice Acme Corp 500 Web design"` &rarr; Automatically drafts a new invoice in your workspace!
  - `"/summary"` &rarr; Instant breakdown of revenue, expenses, and net profit margin.
- **Built-in Browser Sandbox:** Test and simulate natural language Telegram commands directly in the browser without needing a live bot token.
- **Production Webhook Integration:** Live webhook handler (`/api/telegram/webhook`) ready for your official Telegram Bot token from `@BotFather`.

### 3. 📊 2-Way Google Sheets Synchronization
- **One-Click CSV Exports:** Export Invoices, Expenses, and Profit & Loss (P&L) Reports.
- **Google Apps Script Live Integration:** Copy-pasteable Apps Script template included in the UI to automatically sync rows between any Google Sheet and Vaulto.
- **Live Spreadsheet Explorer:** Real-time synced spreadsheet preview directly within your dashboard.

### 4. 💳 Stripe Monetization & Paid Memberships
- **Tiered Pricing Structure:**
  - **Free / Starter ($0):** 5 invoices/mo, 20 expenses, standard exports.
  - **Vaulto Pro ($19/mo or $190/yr):** Unlimited invoices, Telegram AI bot, Google Sheets live sync, recurring cycles, custom branding, and PDF exports.
  - **Vaulto Business ($49/mo):** Multi-currency, custom domain links, priority webhooks, dedicated accountant reports.
- **Stripe Test Mode Ready:** Live Stripe Checkout sessions (`/api/stripe/checkout`), Customer Billing Portal, and Webhook listeners.
- **Zero-Friction Sandbox Fallback:** If Stripe keys are omitted in development, the app simulates upgrades seamlessly so you can test the full paid experience.

### 5. 🔒 JWT Authentication & 1-Click Sandbox Login
- Secure JWT sessions stored in HTTP-only cookies (`jose` + `bcryptjs`).
- 1-Click Instant Demo login button for immediate evaluation.

---

## 🎨 Design Philosophy: Anti-AI Aesthetic
Vaulto was intentionally designed to reject the generic "AI-generated" look:
- **No tacky rainbow gradients** (`bg-gradient-to-r from-sky-500 via-indigo-600...`).
- **Monochrome & High Contrast:** Deep obsidian (`#09090b`), warm pearl canvas (`#fbfbfa`), and subtle hairline borders (`border-zinc-200/80` / `border-zinc-800`).
- **Swiss / Editorial Typography:** Crisp font weights, monospace accents for numbers and currency codes, structured tabular alignments.

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
JWT_SECRET=vaulto_production_jwt_super_secret_key_change_me_2026
STRIPE_SECRET_KEY=sk_test_placeholder_key
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key
STRIPE_WEBHOOK_SECRET=whsec_placeholder_secret
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Pre-seeded Demo Credentials:**
  - **Email:** `demo@vaulto.io`
  - **Password:** `demo1234`
  - *(Or click the "Explore Live Demo Workspace" button on the sign-in page!)*

---

## 🛠️ Configuration & Integrations

### 1. Setting up Telegram Bot (Optional)
1. Open Telegram and message [@BotFather](https://t.me/BotFather) to create a new bot (e.g. `@MyVaultoBot`).
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
3. Click **Copy Apps Script** to copy the generated integration script.
4. In your Google Sheet, open **Extensions &gt; Apps Script**, paste the code, and click **Save**.
5. Any expense edited in your sheet will automatically synchronize with Vaulto!

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

### Option 1: Vercel (Recommended)
1. Push your repository to GitHub / GitLab.
2. Go to [Vercel](https://vercel.com) &gt; **Add New Project** &gt; Select your repository.
3. Add your Environment Variables (`JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, etc.).
4. Click **Deploy**.

### Option 2: Docker / Docker Compose
Build and run using Docker:
```bash
docker-compose up -d --build
```
The application will run on port `3000` with persistent storage mounted to `./data`.

### Option 3: Railway / Render
1. Create a new Web Service on Railway or Render connected to your GitHub repo.
2. Select **Dockerfile** or Node build command: `npm run build` and start command: `npm start`.
3. Set environment variables.

---

## 📁 Project Structure

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
│   │   └── page.tsx            # Editorial Fintech landing page
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
