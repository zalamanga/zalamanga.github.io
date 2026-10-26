# KYB Onboarding Operations Dashboard

A hiring-focused analytics case study that simulates the day-to-day work of a KYB (Know Your Business) Agent. The project uses fully synthetic company records and does not contain personal or confidential business data.

## Business questions

- Where do applicants drop out of the onboarding funnel?
- Which channels have the highest activation and SLA compliance rates?
- Which workflow stages create the largest backlog?
- What operational anomalies require immediate investigation?
- Are dashboard data and source records complete, timely, and reliable?

## Deliverables

- Interactive dashboard with date, channel, risk, and industry filters.
- Funnel conversion, activation rate, turnaround time, SLA, and failure KPIs.
- Bottleneck, root-cause, channel-performance, and anomaly analysis.
- Data-quality monitoring and a downloadable filtered CSV.
- PostgreSQL schema and reusable analysis queries.
- Example Power BI DAX measures for the core KPIs.
- A BI-ready CSV that can be imported into Power BI, Tableau, Looker Studio, Metabase, or Excel.

## Technology

- SQL (PostgreSQL 15 syntax)
- JavaScript, HTML, and CSS
- CSV data model compatible with spreadsheet and BI tools
- Git-friendly, dependency-free static application

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Regenerate the dataset

The dataset is deterministic, so every build produces the same 840 records.

```bash
node scripts/build-data.js
```

## SQL files

- `sql/schema.sql` creates the PostgreSQL table and indexes.
- `sql/analysis_queries.sql` contains KPI, funnel, SLA, bottleneck, root-cause, anomaly, and data-quality queries.
- `bi/powerbi_measures.dax` contains reusable Power BI measures.
- `data/DATA_DICTIONARY.md` defines every field in the analytical dataset.
- `docs/PRODUCT_REQUIREMENTS_DOCUMENT.md` defines the full vacancy-aligned product scope, acceptance criteria, and delivery phases.
- `docs/INSIGHTS_AND_RECOMMENDATIONS.md` turns the metrics into stakeholder actions.
- `docs/INTERVIEW_GUIDE.md` contains a concise walkthrough and CV-ready project bullets.

## Suggested interview walkthrough

1. Explain the KPI definitions and dashboard filters.
2. Show the funnel and identify the largest conversion loss.
3. Compare channel activation and SLA performance.
4. Open the exception queue and explain investigation priority.
5. Use the root-cause panel to propose an operational action.
6. Show how the same metrics are calculated in SQL.

## Disclaimer

This is an independent portfolio project. It is not affiliated with any employer, platform, or real KYB operation. All organizations and records are fictional.
