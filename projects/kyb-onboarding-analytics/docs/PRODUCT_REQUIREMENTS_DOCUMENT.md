# KYB Onboarding Operations Portfolio Product Requirements Document

This document defines the portfolio case study that Muhammad Rafik will use when applying for KYB Agent, Operations Analyst, Data Analyst, and Business Analyst roles. The project must demonstrate how data is used to monitor business onboarding, investigate delays and drop-offs, maintain reliable reporting, and recommend actions to Operations, Product, Business, Support, and Engineering. All records will be synthetic and the project will not claim experience with real customer or company data.

| Item | Decision |
|---|---|
| Status | Draft for review |
| Working title | KYB Onboarding Operations Command Center |
| Portfolio owner | Muhammad Rafik Muzakir Alfaruq |
| Primary audience | Recruiters, hiring managers, Operations leads, and Data or Business Analysts |
| Primary BI deliverable | Power BI report with reusable DAX measures |
| Public demonstration | Responsive web dashboard hosted with the portfolio |
| Supporting tools | PostgreSQL, Excel, Power Query, JavaScript, and Git |
| Data policy | Fully synthetic data with a visible disclaimer |

## Product decision

The project will be presented as an operations analytics case study, not as a generic dashboard and not as proof of professional KYB employment. Its central business scenario is that a technology company wants to improve business onboarding activation while reducing SLA breaches, unresolved backlogs, failed activation transactions, and data-quality problems.

The portfolio must allow a reviewer to answer three questions within 90 seconds:

1. What is happening in the onboarding funnel?
2. Why is it happening?
3. What should each stakeholder do next?

## Current foundation and gaps

The existing project already contains a public web dashboard, 840 synthetic records, PostgreSQL queries, example DAX measures, KPI definitions, an exception queue, and written recommendations. This is a useful foundation and should be expanded rather than replaced.

| Current area | Assessment | Required improvement |
|---|---|---|
| Interactive web dashboard | Good public demonstration | Add application-level drill-down and clearer investigation flow |
| Funnel, SLA, turnaround, and activation KPIs | Relevant to the vacancy | Add target comparison, period-over-period change, ageing, and cohort analysis |
| Synthetic CSV | Safe and reproducible | Expand into a realistic relational model with at least 25,000 applications |
| SQL analysis | Strong starting evidence | Add reconciliation, cohort, ageing, anomaly, and data-quality queries |
| DAX measures | Useful but not sufficient by themselves | Produce an actual Power BI report file and screenshots |
| Excel evidence | Missing | Create a workbook using Power Query, PivotTables, lookup formulas, and validation checks |
| Stakeholder recommendations | Good | Connect every recommendation to an owner, priority, expected impact, and follow-up metric |
| KYB case investigation | Too limited | Add required-document status, risk flags, decision reason, stage timeline, and audit trail |

## Business problem

Operations cannot manage onboarding effectively when registration, verification, risk review, approval, and activation data are viewed separately. Stakeholders need one trusted view that identifies funnel loss, overdue applications, channel performance, operational root causes, system failures, and unreliable source data.

The case study will investigate a simulated decline in activation rate and an increase in SLA breaches. The analysis must distinguish between legitimate compliance outcomes, applicant-driven drop-off, operational delays, data-quality issues, and technical activation failures.

## Objectives

- Monitor registration-to-activation performance using clearly defined KPIs.
- Identify trends, anomalies, bottlenecks, and ageing backlogs.
- Prioritize cases that require operational action.
- Trace every dashboard metric to SQL and documented business rules.
- Demonstrate Power BI, SQL, Excel, reporting, and stakeholder communication.
- Show that a software-development background can transfer to operations analytics through system understanding and structured root-cause analysis.

## Non-goals

- The project will not perform real identity, sanctions, PEP, adverse-media, or government-registry checks.
- The project will not contain real personal information, legal documents, credentials, or production endpoints.
- The project will not claim that synthetic risk scoring represents a regulatory decision model.
- Authentication, payment processing, and a production backend are not required for the portfolio demonstration.
- Predictive machine learning is not required. Clear operational analysis is more important for this vacancy.

## Target users and decisions

| User | Primary question | Decision supported |
|---|---|---|
| KYB Operations Agent | Which applications need action today? | Prioritize overdue, incomplete, duplicate, or failed cases |
| Operations Lead | Where is the backlog and who owns it? | Reallocate workload and escalate SLA breaches |
| Product Manager | Where do applicants drop out? | Improve forms, document guidance, and activation flow |
| Business or Channel Lead | Which acquisition channels produce successful activation? | Improve partner quality and channel support |
| Support Team | Which customer-facing issues repeat? | Prepare outreach and issue-resolution playbooks |
| Engineering Team | Are system failures or latency affecting onboarding? | Investigate integrations, retries, and performance |
| Data Analyst | Can the reported numbers be trusted? | Reconcile sources, document definitions, and resolve quality flags |

## Job requirement coverage

| Vacancy requirement | Portfolio evidence |
|---|---|
| Monitor onboarding dashboards and KR or KPI | Executive KPI page, KPI dictionary, targets, trends, and refresh status |
| Monitor registration through activation | Six-stage funnel, cohort conversion, and stage timeline |
| Identify trends and anomalies | Weekly trends, period comparison, anomaly rules, and alert table |
| Prepare reports and insights | Weekly operations report and executive recommendations |
| Investigate delays and drop-offs | Ageing analysis, exception queue, root-cause taxonomy, and application drill-down |
| Collaborate across teams | Stakeholder action matrix with owners and follow-up metrics |
| Ensure data reliability | Reconciliation queries, completeness checks, duplicate checks, and freshness monitoring |
| Strong SQL | Reusable PostgreSQL queries with CTEs, window functions, conditional aggregation, and quality checks |
| Dashboarding | Actual Power BI report plus public web version |
| Excel or Google Sheets | Excel operations workbook with Power Query and PivotTables |

## Onboarding workflow

The analytical funnel will use the following ordered stages:

`Registered -> Submitted -> Documents Verified -> Risk Reviewed -> Approved -> Activated`

Terminal and exception outcomes include `Rejected`, `Withdrawn`, `Expired`, `Needs Revision`, and `Activation Failed`. A legitimate risk rejection must not be classified as an operational drop-off.

## Data scope

The generated dataset will cover 12 months and at least 25,000 synthetic applications. It will intentionally include seasonal volume, channel differences, incomplete documents, duplicate entities, reviewer backlogs, risk-based SLA targets, API latency, failed activation transactions, and several controlled anomaly periods.

### Relational entities

| Entity | Purpose |
|---|---|
| `businesses` | Synthetic legal entity, business type, industry, city, and channel attributes |
| `applications` | Application status, risk band, team ownership, timestamps, and resolution outcome |
| `required_documents` | Synthetic document type, presence, validity, revision count, and verification status |
| `stage_events` | Timestamped funnel movements used to reconstruct the application journey |
| `risk_reviews` | Synthetic risk flags, score band, reviewer decision, and decision reason |
| `activation_transactions` | Attempt number, result, latency, failure reason, and retry status |
| `data_quality_issues` | Quality rule, severity, owner, detection time, and resolution time |
| `kpi_targets` | Metric target, effective period, and accountable owner |

### Controlled anomaly scenarios

- Partner-channel document completeness declines for three weeks.
- Medium-risk review backlog increases after an artificial volume spike.
- Activation API latency rises together with failed transactions.
- A duplicate-ingestion event creates repeated business applications.
- One source feed becomes stale, causing dashboard freshness warnings.

These scenarios exist so the candidate can demonstrate investigation, not merely describe charts.

## KPI definitions

| KPI | Definition | Required display |
|---|---|---|
| Registered applications | Distinct applications created in the selected period | Value, target, and period change |
| Submission rate | Submitted applications divided by registered applications | Percentage and funnel loss |
| Verification completion rate | Document-verified applications divided by submitted applications | Percentage by channel and risk |
| Approval rate | Approved applications divided by risk-reviewed applications | Separate valid rejection from waiting cases |
| Activation rate | Activated applications divided by registered applications | Overall, weekly trend, channel, and cohort |
| End-to-end turnaround | Time from registration to terminal resolution | Median and P90 hours, not only average |
| SLA compliance | Resolved applications completed within the applicable target | Percentage, target gap, and breach count |
| Open backlog | Applications not in a terminal outcome | Count by stage, owner, and ageing bucket |
| Drop-off rate | Applicant-driven exits divided by eligible applications at a stage | Stage and reason breakdown |
| Rework rate | Applications requiring at least one document revision | Percentage and top document causes |
| Activation failure rate | Failed final activation attempts divided by activation attempts | Rate, count, reason, and retry status |
| Document completeness | Applications meeting the defined document threshold | Percentage by channel and document type |
| Duplicate rate | Applications flagged as possible duplicate divided by registered applications | Trend and unresolved count |
| Dashboard freshness | Time since the most recent successful source update | Timestamp and warning status |

Every KPI must document its numerator, denominator, excluded statuses, date field, and timezone. Combined rates must be calculated from combined counts rather than averaging percentages.

## Dashboard requirements

### Page 1 Executive overview

- Display activation rate, approval rate, median turnaround, P90 turnaround, SLA compliance, backlog, and activation failures.
- Compare each primary KPI with its target and previous period.
- Show the complete funnel and weekly activation trend.
- Present three automatically generated observations that are supported by current filters.
- Show the last refresh timestamp and data-quality status.

### Page 2 Funnel and channel analysis

- Compare conversion by stage, acquisition channel, industry, city, and risk band.
- Support cohort analysis based on registration week or month.
- Display top drop-off and rejection reasons separately.
- Allow the reviewer to move from a weak segment to the affected applications.

### Page 3 Operations control tower

- Show open cases by stage and ageing bucket: under 24 hours, 24 to 48 hours, 48 to 72 hours, and over 72 hours.
- Rank overdue cases using a documented priority score.
- Filter by assigned team, risk level, channel, current stage, SLA status, and exception type.
- Provide an exportable action queue with application ID, owner, reason, age, and recommended next action.

The priority score will combine SLA urgency, stage age, unresolved technical failure, missing documents, and risk band. It is an operational triage aid and must not be described as a compliance decision model.

### Page 4 Root cause and system health

- Show Pareto analysis of delay, revision, rejection, and activation-failure causes.
- Compare API latency with failed activation volume.
- Display retry success, repeated failures, and unresolved technical exceptions.
- Assign each root cause to Operations, Product, Support, Engineering, Partner Management, or Data.

### Page 5 Data quality and reconciliation

- Monitor missing mandatory fields, invalid timestamps, impossible stage order, duplicates, stale data, and orphan records.
- Reconcile dashboard totals with source-table totals.
- Display issue severity, owner, detection time, and resolution status.
- Clearly distinguish zero values from missing data.

### Page 6 Application case detail

- Display synthetic business profile, current stage, risk band, team owner, and SLA status.
- Show required-document checklist and revision history.
- Show a chronological stage timeline and activation attempts.
- Display flags, decision reasons, and a recommended operational next action.
- Include a visible synthetic-data notice.

## Filter requirements

All analytical pages must support a shared date range plus relevant filters for channel, risk level, industry, city, assigned team, current stage, SLA status, and exception type. Filters must produce an explicit empty state rather than misleading zero values.

## SQL requirements

The repository must include readable queries for:

1. Executive KPI calculation and target comparison.
2. Funnel counts and stage-to-stage conversion.
3. Weekly cohort activation.
4. Median and P90 turnaround.
5. SLA compliance and breach ageing.
6. Backlog by owner, stage, and ageing bucket.
7. Channel and partner performance.
8. Root-cause Pareto analysis.
9. Activation failure and retry analysis.
10. Duplicate, missing-value, stage-order, orphan, and freshness checks.
11. Dashboard-to-source reconciliation.
12. Application-level audit timeline.

At least three queries must demonstrate CTEs and window functions. Queries must avoid double counting when joining one-to-many document, event, or transaction tables.

## Power BI requirements

- Use a star-schema model with explicit relationships and a separate date table.
- Store measures in a dedicated measure table.
- Include reusable DAX for conversion, target gap, previous-period change, median or percentile turnaround, backlog ageing, and data freshness.
- Use drill-through from aggregate pages to application detail.
- Include tooltips that explain KPI definitions and denominators.
- Save the `.pbix` file when licensing and repository-size constraints permit; otherwise provide a downloadable file outside Git plus screenshots and complete build instructions.

## Excel operations workbook

The workbook will contain:

- Power Query imports for the generated CSV extracts.
- A daily action queue with filters and conditional formatting.
- PivotTables for channel, stage, risk, SLA, and root cause.
- `XLOOKUP` or equivalent formulas for owner and target mapping.
- A reconciliation sheet comparing source totals with reported totals.
- A short instructions sheet so a reviewer can refresh and use the workbook.

## Stakeholder report

The project will include a one-page weekly operations report with:

- Executive summary.
- KPI performance against target.
- Three material findings supported by evidence.
- Root-cause assessment that separates fact from hypothesis.
- Recommended action, accountable owner, priority, expected effect, and follow-up metric.
- Open questions or data limitations.

## Functional acceptance criteria

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Shared filters | All KPI cards and visuals update from the same filter context |
| FR-02 | Funnel integrity | Every later-stage count is less than or equal to the preceding eligible-stage count |
| FR-03 | KPI traceability | Every displayed KPI has a matching SQL query and written definition |
| FR-04 | Exception prioritization | Queue can be sorted by priority and explains why each case is included |
| FR-05 | Case drill-down | A selected application shows documents, stage events, decisions, and activation attempts |
| FR-06 | Data quality | Injected quality problems are detected by documented rules |
| FR-07 | Reconciliation | Dashboard totals match validated source totals for the same filter context |
| FR-08 | Export | Filtered action queue can be exported without hidden or unrelated records |
| FR-09 | Empty state | Filters returning no records show a clear message and no fabricated KPI |
| FR-10 | Freshness | Dashboard shows last successful update and warns when the threshold is exceeded |
| FR-11 | Privacy | All pages and files state that data is synthetic |
| FR-12 | Performance | Main web dashboard becomes usable within two seconds on a typical laptop after assets load |

## Validation plan

- Recalculate headline KPIs independently in SQL and Excel.
- Test boundary conditions including exactly 24, 48, and 72 hours and exactly the SLA target.
- Verify that rejected, withdrawn, expired, and failed cases use the correct denominators.
- Test missing timestamps, invalid stage order, duplicate applications, and orphan records.
- Confirm that one-to-many joins do not inflate application counts.
- Test all filter combinations, CSV export, empty states, and mobile layout.
- Maintain a manual test checklist and a result log in the repository.

## Portfolio deliverables

1. Public case-study page with business context, screenshots, findings, and live dashboard link.
2. Interactive web dashboard.
3. Power BI report and DAX measures.
4. Excel operations workbook.
5. Synthetic relational dataset and reproducible generator.
6. ERD, data dictionary, KPI dictionary, and root-cause taxonomy.
7. PostgreSQL schema and analysis queries.
8. Weekly stakeholder report and recommendations.
9. Data-quality and dashboard-reconciliation report.
10. Testing checklist and documented results.
11. README with setup instructions and project limitations.
12. Interview walkthrough and CV-ready bullet points.

## Success criteria

- A recruiter can understand the problem, finding, and recommendation in 90 seconds.
- The project visibly covers every responsibility in the vacancy.
- At least three findings lead to specific stakeholder actions.
- A reviewer can reproduce the dataset and core KPI results.
- SQL, Power BI, Excel, and the web dashboard report consistent numbers.
- The portfolio never presents synthetic analysis as real employment experience.
- The candidate can explain KPI denominators, data limitations, and investigation steps without memorizing a script.

## Delivery phases

| Phase | Output | Completion gate |
|---|---|---|
| 1. Product and metric design | Approved PRD, funnel, KPI dictionary, and project narrative | Scope and definitions are agreed before coding |
| 2. Data foundation | Relational schema, generator, ERD, and validation rules | Controlled anomalies reproduce consistently |
| 3. SQL analysis | Query pack and reconciled benchmark results | No double counting and all KPIs trace to source |
| 4. BI and Excel | Power BI report and operations workbook | Measures reconcile with SQL |
| 5. Public case study | Upgraded web dashboard and portfolio page | Recruiter walkthrough works on desktop and mobile |
| 6. Evidence and interview package | Report, tests, screenshots, CV bullets, and demo script | All claims are demonstrable and honestly worded |

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Project looks like UI work rather than analysis | Lead with business questions, SQL evidence, findings, and decisions |
| Synthetic data appears too clean | Inject documented anomalies and quality failures intentionally |
| Too many features weaken the story | Build vacancy-aligned requirements first and defer optional features |
| Lack of formal KYB experience | State the project is independent and explain transferable system and analysis skills |
| Power BI cannot be viewed publicly | Provide screenshots, a web equivalent, DAX, and build instructions |
| Metrics disagree across tools | Maintain benchmark outputs and reconciliation tests |

## Recommended build decision

Proceed with this scope, but treat the Power BI report, Excel workbook, relational dataset, SQL reconciliation, and application-level investigation as mandatory. Do not prioritize login, machine learning, real document verification, or a production backend. Those additions would take time without materially improving alignment with the advertised KYB Agent responsibilities.
