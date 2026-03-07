# 3PS TODO

## What's Live Now

- **Free users**: All 8 tools, 10 history items (localStorage), 1 AI analysis/month (Haiku), clipboard export
- **Pro users (€7.99/mo, €69/yr)**: Unlimited history (server-synced), unlimited AI (Sonnet), PDF export, insights dashboard
- **Auth**: Magic link email login via Resend
- **Payments**: Stripe checkout → webhook → Neon subscription sync

## Before Launch

- [ ] Set real Stripe product/price IDs in Netlify env vars (`VITE_STRIPE_PRICE_MONTHLY`, `VITE_STRIPE_PRICE_YEARLY`)
- [ ] Set `RESEND_API_KEY` in Netlify env vars
- [ ] Configure Stripe webhook endpoint URL in Stripe dashboard → `https://yourdomain.com/api/stripe-webhook`
- [ ] Test the full flow end-to-end: magic link → login → upgrade → Pro features

## Phase 2 (after first paying users)

- [ ] Outcome tracking with 30/90-day email reminders
- [ ] AI coaching conversation (5 follow-ups per decision)
- [ ] Shareable decision links
- [ ] Enhanced insights dashboard with accuracy tracking
