-- 1. Executive KPI summary
SELECT
    COUNT(*) AS total_applications,
    ROUND(100.0 * COUNT(*) FILTER (WHERE stage_index >= 1) / NULLIF(COUNT(*), 0), 1) AS submission_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE current_stage = 'Activated') / NULLIF(COUNT(*), 0), 1) AS activation_rate_pct,
    ROUND(AVG(turnaround_hours) FILTER (WHERE turnaround_hours IS NOT NULL), 1) AS avg_turnaround_hours,
    ROUND(100.0 * COUNT(*) FILTER (WHERE turnaround_hours IS NOT NULL AND sla_met) /
        NULLIF(COUNT(*) FILTER (WHERE turnaround_hours IS NOT NULL), 0), 1) AS sla_compliance_pct,
    COUNT(*) FILTER (WHERE failed_transaction) AS failed_transactions
FROM kyb_applications;

-- 2. Onboarding funnel and conversion from registration
WITH funnel AS (
    SELECT * FROM (VALUES
        (0, 'Registered'),
        (1, 'Submitted'),
        (2, 'Document Verified'),
        (3, 'Risk Reviewed'),
        (4, 'Approved'),
        (5, 'Activated')
    ) AS stages(stage_index, stage_name)
)
SELECT
    f.stage_index,
    f.stage_name,
    COUNT(k.application_id) AS applications,
    ROUND(100.0 * COUNT(k.application_id) /
        NULLIF((SELECT COUNT(*) FROM kyb_applications), 0), 1) AS conversion_from_registration_pct
FROM funnel f
LEFT JOIN kyb_applications k ON k.stage_index >= f.stage_index
GROUP BY f.stage_index, f.stage_name
ORDER BY f.stage_index;

-- 3. Channel performance and drop-off rate
SELECT
    channel,
    COUNT(*) AS applications,
    COUNT(*) FILTER (WHERE current_stage = 'Activated') AS activated,
    ROUND(100.0 * COUNT(*) FILTER (WHERE current_stage = 'Activated') / NULLIF(COUNT(*), 0), 1) AS activation_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE current_stage IN ('Registered', 'Submitted', 'Document Verification')) /
        NULLIF(COUNT(*), 0), 1) AS early_dropoff_pct,
    ROUND(AVG(turnaround_hours) FILTER (WHERE turnaround_hours IS NOT NULL), 1) AS avg_turnaround_hours
FROM kyb_applications
GROUP BY channel
ORDER BY activation_rate_pct DESC;

-- 4. Current backlog and SLA risk by workflow stage
SELECT
    current_stage,
    COUNT(*) AS current_backlog,
    ROUND(AVG(stage_age_hours), 1) AS avg_stage_age_hours,
    COUNT(*) FILTER (WHERE NOT sla_met) AS breached_cases,
    ROUND(100.0 * COUNT(*) FILTER (WHERE NOT sla_met) / NULLIF(COUNT(*), 0), 1) AS breach_rate_pct
FROM kyb_applications
WHERE current_stage NOT IN ('Activated', 'Rejected')
GROUP BY current_stage
ORDER BY breach_rate_pct DESC, current_backlog DESC;

-- 5. Root causes of onboarding drop-off
SELECT
    COALESCE(
        NULLIF(dropoff_reason, ''),
        NULLIF(rejection_reason, ''),
        CASE
            WHEN current_stage = 'Risk Review' THEN 'Manual risk-review backlog'
            WHEN current_stage IN ('Approved', 'Activation Failed') THEN 'Activation processing issue'
            ELSE 'Open workflow / unclassified'
        END
    ) AS root_cause,
    COUNT(*) AS affected_applications,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS share_pct
FROM kyb_applications
WHERE current_stage <> 'Activated'
GROUP BY root_cause
ORDER BY affected_applications DESC;

-- 6. Operational anomaly queue
SELECT
    application_id,
    company_name,
    channel,
    risk_level,
    current_stage,
    stage_age_hours,
    api_response_ms,
    data_quality_flag
FROM kyb_applications
WHERE stage_age_hours > sla_target_hours
   OR api_response_ms > 1000
   OR failed_transaction
   OR duplicate_flag
   OR COALESCE(data_quality_flag, '') <> ''
ORDER BY
    failed_transaction DESC,
    duplicate_flag DESC,
    stage_age_hours DESC;

-- 7. Data-quality and dashboard-freshness checks
SELECT
    COUNT(*) FILTER (WHERE company_name IS NULL OR company_name = '') AS missing_company_name,
    COUNT(*) FILTER (WHERE document_completeness_pct < 70) AS incomplete_critical_data,
    COUNT(*) FILTER (WHERE duplicate_flag) AS possible_duplicates,
    MAX(dashboard_updated_at) AS latest_dashboard_refresh,
    EXTRACT(EPOCH FROM (NOW() - MAX(dashboard_updated_at))) / 60 AS refresh_age_minutes
FROM kyb_applications;
