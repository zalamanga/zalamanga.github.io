# Insights and Recommendations

The following observations use the default dashboard view: the 90 days ending 28 September 2026. All records are synthetic and exist only for this portfolio case study.

## Executive summary

- 621 businesses registered and 606 reached submission, producing a 97.6% submission rate.
- 411 businesses were activated, resulting in a 66.2% registration-to-activation rate.
- Resolved cases took 41.7 hours on average and achieved 76.1% SLA compliance.
- Eight activation transactions failed and should be placed in a controlled retry queue.
- The largest funnel loss occurred between Risk Reviewed and Approved: 137 applications, or 24.0% of the reviewed population.

## Operational findings

### 1. Partner channel needs targeted improvement

The Partner channel had the lowest activation rate at 57.0%, compared with 70.1% for Direct and 71.6% for Sales Assisted. Partner SLA compliance was also lower at 69.7%, while its average turnaround was the slowest at 44.8 hours.

**Recommended action:** introduce a partner-specific pre-submission checklist, track missing documents by partner, and review Partner conversion and SLA weekly.

### 2. Risk review is a decision bottleneck

The dashboard shows 30 cases in the manual risk-review backlog, while the reviewed-to-approved step produces the largest absolute funnel loss.

**Recommended action:** separate valid rejections from operational waiting time, balance reviewer workload, and monitor ageing by risk band and assigned team.

### 3. Source-data quality can be strengthened

Only 74.6% of selected applications meet the ≥80% document-completeness threshold. The dataset also contains 21 possible duplicates and 46 explicit quality flags.

**Recommended action:** add mandatory-field validation, company-name and tax-ID standardization, and duplicate matching before applications enter manual review.

### 4. Supporting-service latency should be monitored

API response time at the 95th percentile is 1,161 ms, above the dashboard's 1,000 ms watch threshold.

**Recommended action:** monitor latency by integration endpoint, define warning and critical thresholds, and add retry plus timeout handling for external verification services.

### 5. Activation failures need clear ownership

Eight applications reached an activation failure state in the selected period.

**Recommended action:** create an automated retry queue with attempt count, failure reason, owner, and final resolution timestamp. Escalate cases that fail repeatedly.

## Suggested KPI owners

| Metric | Primary owner | Review cadence |
|---|---|---|
| Submission and activation rate | Operations / Business | Weekly |
| Funnel drop-off | Product / Operations | Weekly |
| Turnaround and SLA compliance | Operations | Daily |
| Failed activation transactions | Product / Engineering | Daily |
| Document completeness and duplicates | Operations / Data | Daily |
| API response time | Engineering / Vendor Management | Real time and weekly |
