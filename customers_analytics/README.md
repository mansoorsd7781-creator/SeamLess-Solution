# Customer Analytics UI

**Team:** seamless_solutions **Members:** 1.N.Lakshmi Vijayanand Reddy 2.v.kiran rathore 3.syed mansoor 4.abdul azeez
 **Topic:** Analytics & Data Visualization → Customer Analytics

## What is Customer Analytics?
Customer analytics is collecting and studying data about your customers (who they are, how they find you, how they use the product, and when they leave) so a business can make better decisions. It answers questions like: Who are my best customers? Which ones are about to cancel? Which channel brings the most valuable users?

## Where it is used
SaaS products, e-commerce, banks, telecom, and subscription apps. Tools like Mixpanel, Amplitude, and HubSpot offer it.

## Why it matters
Keeping an existing customer costs far less than finding a new one. Dashboards turn raw data into quick actions: fix onboarding, win back at-risk accounts, spend marketing money where it works.

## Patterns observed
KPI cards with trend deltas, date-range and segment filters, cohort heatmaps, channel breakdowns, health scores, and short written insights.

## What this implementation adds
- Every filter updates the KPIs, chart, and table together
- Retention cohort heatmap and customer health scores
- Written "Insight" card, dark mode support, keyboard focus styles
- "Ask your data" chat: a small rule-based assistant that answers from the page's sample data (no API, simulated)
- Pure HTML, CSS, and JavaScript with no libraries (charts are hand-built SVG)

## Metrics explained
- **Churn rate:** percent of customers who cancel in a period
- **LTV (lifetime value):** average total revenue from one customer
- **NPS:** how likely customers are to recommend you (−100 to +100)
- **Retention:** percent of a signup group still active after N months
- **Health score:** 0-100 estimate of how likely an account is to stay

## Run it
Open `index.html` in a browser. No install needed. All data in `script.js` is sample data.

## Files
`index.html` · `style.css` · `script.js` · `README.md`

## GitHub workflow
Fork → clone → `git checkout -b feature/customer-analytics` → commit → push → open a Pull Request → get a teammate review → merge.
