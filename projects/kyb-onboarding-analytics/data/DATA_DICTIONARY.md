# Data Dictionary

| Column | Type | Description |
|---|---|---|
| `application_id` | Text | Unique synthetic KYB application identifier. |
| `company_name` | Text | Fictional business name used for the portfolio dataset. |
| `business_type` | Text | Legal or operating form, such as PT, CV, or individual business. |
| `industry` | Text | Business industry classification. |
| `city` | Text | Applicant operating location. |
| `channel` | Text | Application acquisition channel. |
| `risk_level` | Text | Low, Medium, or High operational risk band. |
| `risk_score` | Integer | Synthetic risk score from 0 to 100. |
| `assigned_team` | Text | Operations team responsible for the application. |
| `registered_at` | Timestamp | Time the onboarding application was created. |
| `submitted_at` | Timestamp | Time the applicant submitted the required form. |
| `verified_at` | Timestamp | Time document verification was completed. |
| `reviewed_at` | Timestamp | Time risk review was completed. |
| `approved_at` | Timestamp | Time the application was approved. |
| `activated_at` | Timestamp | Time the business account was activated. |
| `current_stage` | Text | Latest workflow state or terminal outcome. |
| `stage_index` | Integer | Highest funnel stage reached, from 0 to 5. |
| `stage_age_hours` | Decimal | Hours since the application entered its current/latest stage. |
| `document_completeness_pct` | Integer | Completeness score for required KYB information. |
| `sla_target_hours` | Integer | Target turnaround based on the risk band. |
| `turnaround_hours` | Decimal | Registration-to-resolution duration for resolved cases. |
| `sla_met` | Boolean | Indicates whether the applicable time target was met. |
| `api_response_ms` | Integer | Simulated supporting-service response time. |
| `failed_transaction` | Boolean | Indicates a failed activation transaction. |
| `duplicate_flag` | Boolean | Possible duplicate entity identified for investigation. |
| `rejection_reason` | Text | Reason for a rejected application. |
| `dropoff_reason` | Text | Reason an application did not progress in an early stage. |
| `data_quality_flag` | Text | Source-data issue requiring correction or review. |
| `dashboard_updated_at` | Timestamp | Latest dashboard data refresh time. |
