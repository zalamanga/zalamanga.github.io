-- KYB Onboarding Operations Analytics
-- Dialect: PostgreSQL 15+

CREATE TABLE kyb_applications (
    application_id              VARCHAR(20) PRIMARY KEY,
    company_name                VARCHAR(150) NOT NULL,
    business_type               VARCHAR(50) NOT NULL,
    industry                    VARCHAR(80) NOT NULL,
    city                        VARCHAR(80) NOT NULL,
    channel                     VARCHAR(40) NOT NULL,
    risk_level                  VARCHAR(10) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    risk_score                  SMALLINT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    assigned_team               VARCHAR(50) NOT NULL,
    registered_at               TIMESTAMPTZ NOT NULL,
    submitted_at                TIMESTAMPTZ,
    verified_at                 TIMESTAMPTZ,
    reviewed_at                 TIMESTAMPTZ,
    approved_at                 TIMESTAMPTZ,
    activated_at                TIMESTAMPTZ,
    current_stage               VARCHAR(40) NOT NULL,
    stage_index                 SMALLINT NOT NULL CHECK (stage_index BETWEEN 0 AND 5),
    stage_age_hours             NUMERIC(10,1) NOT NULL,
    document_completeness_pct   SMALLINT NOT NULL CHECK (document_completeness_pct BETWEEN 0 AND 100),
    sla_target_hours            SMALLINT NOT NULL,
    turnaround_hours            NUMERIC(10,1),
    sla_met                     BOOLEAN NOT NULL,
    api_response_ms             INTEGER NOT NULL,
    failed_transaction          BOOLEAN NOT NULL DEFAULT FALSE,
    duplicate_flag              BOOLEAN NOT NULL DEFAULT FALSE,
    rejection_reason            VARCHAR(120),
    dropoff_reason              VARCHAR(120),
    data_quality_flag           VARCHAR(120),
    dashboard_updated_at        TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_kyb_registered_at ON kyb_applications (registered_at);
CREATE INDEX idx_kyb_stage ON kyb_applications (current_stage);
CREATE INDEX idx_kyb_channel ON kyb_applications (channel);
CREATE INDEX idx_kyb_risk_level ON kyb_applications (risk_level);

-- Import example in psql:
-- \copy kyb_applications FROM 'data/kyb_applications.csv' CSV HEADER;
