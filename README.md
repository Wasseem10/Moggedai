# StayPinged

**A personal AI assistant for reminders and follow-ups in Telegram.**

StayPinged turns messages into saved context and scheduled reminders, with a web interface for setup and account management. This repository retains its original name, `Moggedai`; the current product name in the application is **StayPinged**.

[Telegram integration](app/api/telegram) · [Reminder scheduler](app/api/cron/send-texts/route.ts) · [Data model](lib/db.ts)

## What is in the project

- **Conversational assistant:** a Telegram webhook uses Gemini to generate replies with recent messages and saved context.
- **Reminder delivery:** due Telegram reminders are stored in PostgreSQL and delivered by a scheduled endpoint.
- **Web experience:** a responsive landing page, onboarding, authentication, and dashboard.
- **Additional integrations:** SMS habit check-ins through Twilio or Telnyx, plus Stripe checkout, billing portal, and subscription webhooks.

The current landing page emphasizes Telegram. Older MoggedAI naming and SMS coaching flows remain in parts of the codebase.

## Technology

| Layer | Stack |
| --- | --- |
| Web application | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Authentication | Clerk |
| Data | PostgreSQL through the `pg` driver |
| AI | Google Gemini |
| Messaging | Telegram Bot API, Twilio, Telnyx |
| Billing | Stripe |
| Scheduling | Scheduled HTTP endpoint and GitHub Actions workflow |

## How the Telegram workflow fits together

1. Telegram sends an incoming message to the application's webhook.
2. The handler loads saved context and recent conversation history from PostgreSQL.
3. Gemini supports conversational responses and reminder extraction.
4. Saved reminders are picked up by the cron endpoint when due.
5. Telegram delivers the reminder and the application records the message.

See [the webhook implementation](app/api/telegram/webhook/route.ts) and [the scheduler](app/api/cron/send-texts/route.ts) for the current behavior.

## Run locally

```bash
git clone https://github.com/Wasseem10/Moggedai.git
cd Moggedai
npm ci
```

Create `.env.local` in the repository root. Configure the services required for the workflows you want to run:

| Variables | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Web authentication |
| `DATABASE_URL` | Development PostgreSQL connection |
| `GEMINI_API_KEY` | AI responses and message generation |
| `TELEGRAM_BOT_TOKEN` | Telegram bot integration |
| `NEXT_PUBLIC_TELEGRAM_BOT_URL` | Landing-page link to your bot |
| `NEXT_PUBLIC_APP_URL` | Public application origin used for integrations |
| `CRON_SECRET` | Authorization for scheduled processing |
| `SMS_PROVIDER` and provider credentials | Optional SMS integration; see [`lib/sms.ts`](lib/sms.ts) |
| `STRIPE_SECRET_KEY` and route-specific billing settings | Optional billing; see [Stripe routes](app/api/stripe) |

Then start the application:

```bash
npm run dev
```

Open **http://localhost:3000**. The app wraps pages in Clerk, so use development Clerk credentials for local setup. Database tables are initialized through `ensureSchema()` in [`lib/db.ts`](lib/db.ts) when called by the relevant API routes.

Telegram callbacks require a reachable HTTPS endpoint and bot webhook configuration. Reminder delivery also requires a scheduler to invoke `/api/cron/send-texts` with the configured cron secret. Starting the web server alone does not schedule reminders.

Use a development database and test integrations. Keep server credentials out of `NEXT_PUBLIC_` variables and version control.

## Repository guide

| Path | Purpose |
| --- | --- |
| [`app/App.tsx`](app/App.tsx) | StayPinged landing page |
| [`app/dashboard`](app/dashboard) | Account and habit dashboard |
| [`app/api/telegram`](app/api/telegram) | Bot messages and webhook setup |
| [`app/api/cron/send-texts`](app/api/cron/send-texts) | Due reminders and SMS check-ins |
| [`app/api/stripe`](app/api/stripe) | Checkout, billing portal, and webhook handlers |
| [`lib/db.ts`](lib/db.ts) | Connection pool and table initialization |
| [`lib/sms.ts`](lib/sms.ts) | SMS provider adapter |
| [`.github/workflows/reminders-cron.yml`](.github/workflows/reminders-cron.yml) | Scheduled reminder invocation |

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |

There is currently no automated test script in `package.json`. The source documents the available integrations; it does not establish their deployment status or delivery reliability.
