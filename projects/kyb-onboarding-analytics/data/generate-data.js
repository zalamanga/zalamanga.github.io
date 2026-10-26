(function attachKybDataset(root, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.KYBData = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createKybDatasetApi() {
  "use strict";

  const SNAPSHOT_AT = new Date("2026-09-28T17:00:00+07:00");
  const STAGES = [
    "Registered",
    "Submitted",
    "Document Verification",
    "Risk Review",
    "Approved",
    "Activated"
  ];

  function mulberry32(seed) {
    return function random() {
      let value = seed += 0x6D2B79F5;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function weightedPick(random, entries) {
    const target = random();
    let cumulative = 0;

    for (const [value, weight] of entries) {
      cumulative += weight;
      if (target <= cumulative) return value;
    }

    return entries.at(-1)[0];
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function iso(date) {
    if (!date) return "";
    return date.toISOString();
  }

  function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  function hoursBetween(start, end) {
    return Math.max(0, (end.getTime() - start.getTime()) / 3600000);
  }

  function round(value, digits = 1) {
    const multiplier = 10 ** digits;
    return Math.round(value * multiplier) / multiplier;
  }

  function generateApplications(count = 840, seed = 26514) {
    const random = mulberry32(seed);
    const channels = [
      ["Direct", 0.31],
      ["Partner", 0.28],
      ["Sales Assisted", 0.23],
      ["Organic", 0.18]
    ];
    const industries = [
      ["Retail", 0.22],
      ["Food & Beverage", 0.17],
      ["E-commerce", 0.16],
      ["Logistics", 0.14],
      ["Professional Services", 0.13],
      ["Manufacturing", 0.10],
      ["Other", 0.08]
    ];
    const cities = [
      ["Jakarta", 0.44],
      ["Tangerang", 0.16],
      ["Bekasi", 0.14],
      ["Bandung", 0.11],
      ["Surabaya", 0.09],
      ["Other", 0.06]
    ];
    const businessTypes = [
      ["PT", 0.46],
      ["CV", 0.24],
      ["Individual Business", 0.20],
      ["Foundation / Cooperative", 0.10]
    ];
    const reviewers = ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta"];
    const companyWords = [
      "Nusantara", "Cakrawala", "Mitra", "Arunika", "Sentosa", "Karya", "Sinar", "Mandiri",
      "Bersama", "Digital", "Niaga", "Prima", "Solusi", "Gemilang", "Sejahtera", "Lintas"
    ];
    const companySuffixes = ["Retail", "Logistik", "Teknologi", "Kuliner", "Kreasi", "Perdagangan", "Industri", "Jasa"];

    const rows = [];

    for (let index = 0; index < count; index += 1) {
      const dayOffset = Math.floor(random() * 119);
      const registeredAt = new Date(SNAPSHOT_AT);
      registeredAt.setUTCDate(registeredAt.getUTCDate() - dayOffset);
      registeredAt.setUTCHours(1 + Math.floor(random() * 9), Math.floor(random() * 60), 0, 0);

      const ageHours = hoursBetween(registeredAt, SNAPSHOT_AT);
      const channel = weightedPick(random, channels);
      const industry = weightedPick(random, industries);
      const city = weightedPick(random, cities);
      const businessType = weightedPick(random, businessTypes);
      const riskLevel = weightedPick(random, [["Low", 0.48], ["Medium", 0.38], ["High", 0.14]]);
      const riskScoreBase = riskLevel === "Low" ? 14 : riskLevel === "Medium" ? 48 : 76;
      const riskScore = Math.min(99, Math.round(riskScoreBase + random() * 18));
      const anomalyWindow = channel === "Partner" && dayOffset >= 14 && dayOffset <= 35;
      const duplicateFlag = random() < (riskLevel === "High" ? 0.075 : 0.018);
      const apiResponseMs = Math.round(180 + random() * 420 + (anomalyWindow ? 760 + random() * 620 : 0));
      const docPenalty = anomalyWindow ? 14 : 0;
      const documentCompleteness = Math.max(35, Math.min(100, Math.round(72 + random() * 31 - docPenalty)));

      let desiredOutcome = weightedPick(random, [
        ["Draft", anomalyWindow ? 0.10 : 0.07],
        ["Submitted", anomalyWindow ? 0.09 : 0.06],
        ["Document Verification", anomalyWindow ? 0.15 : 0.08],
        ["Risk Review", 0.09],
        ["Rejected", riskLevel === "High" ? 0.20 : 0.09],
        ["Approved", 0.08],
        ["Activated", anomalyWindow ? 0.29 : (riskLevel === "High" ? 0.41 : 0.53)]
      ]);

      const earlyOutcome = ["Draft", "Submitted", "Document Verification"].includes(desiredOutcome);
      const ageingOpenCase = dayOffset > 12 && earlyOutcome && !anomalyWindow;
      const veryOldOpenCase = dayOffset > 35 && ["Draft", "Submitted", "Document Verification", "Risk Review", "Approved"].includes(desiredOutcome);
      if ((ageingOpenCase && random() < 0.76) || (veryOldOpenCase && random() < 0.90)) {
        desiredOutcome = random() < (riskLevel === "High" ? 0.48 : 0.78) ? "Activated" : "Rejected";
      }

      if (ageHours < 18 && ["Approved", "Activated", "Rejected"].includes(desiredOutcome)) desiredOutcome = "Submitted";
      if (ageHours < 48 && desiredOutcome === "Activated" && random() < 0.72) desiredOutcome = "Document Verification";

      const submitDelay = 1 + random() * (anomalyWindow ? 24 : 12);
      const verifyDelay = 2 + random() * (anomalyWindow ? 42 : 18) + (documentCompleteness < 80 ? 10 : 0);
      const reviewDelay = 2 + random() * (riskLevel === "High" ? 32 : 18);
      const approvalDelay = 1 + random() * 8;
      const activationDelay = 1 + random() * 10;

      let submittedAt = addHours(registeredAt, submitDelay);
      let verifiedAt = addHours(submittedAt, verifyDelay);
      let reviewedAt = addHours(verifiedAt, reviewDelay);
      let approvedAt = addHours(reviewedAt, approvalDelay);
      let activatedAt = addHours(approvedAt, activationDelay);

      if (submittedAt > SNAPSHOT_AT) submittedAt = null;
      if (!submittedAt || verifiedAt > SNAPSHOT_AT) verifiedAt = null;
      if (!verifiedAt || reviewedAt > SNAPSHOT_AT) reviewedAt = null;
      if (!reviewedAt || approvedAt > SNAPSHOT_AT) approvedAt = null;
      if (!approvedAt || activatedAt > SNAPSHOT_AT) activatedAt = null;

      const stageOrder = {
        Draft: 0,
        Submitted: 1,
        "Document Verification": 2,
        "Risk Review": 3,
        Rejected: 3,
        Approved: 4,
        Activated: 5
      };
      let reachedStage = stageOrder[desiredOutcome];
      if (!submittedAt) reachedStage = 0;
      else if (!verifiedAt) reachedStage = Math.min(reachedStage, 1);
      else if (!reviewedAt) reachedStage = Math.min(reachedStage, 2);
      else if (!approvedAt) reachedStage = Math.min(reachedStage, 3);
      else if (!activatedAt) reachedStage = Math.min(reachedStage, 4);

      const failedTransaction = reachedStage === 4 && random() < 0.22;
      let status = STAGES[reachedStage];
      if (desiredOutcome === "Rejected" && reachedStage >= 3) status = "Rejected";
      if (failedTransaction) status = "Activation Failed";

      const rejectionReason = status === "Rejected"
        ? weightedPick(random, [
            ["High-risk profile", 0.31],
            ["Business identity mismatch", 0.24],
            ["Sanctions / watchlist match", 0.14],
            ["Duplicate business account", 0.13],
            ["Unsupported business category", 0.10],
            ["Unable to verify address", 0.08]
          ])
        : "";

      const dropoffReason = ["Draft", "Submitted", "Document Verification"].includes(status)
        ? weightedPick(random, [
            ["Missing business license", anomalyWindow ? 0.34 : 0.22],
            ["Incomplete beneficial-owner data", 0.19],
            ["Address proof unavailable", anomalyWindow ? 0.25 : 0.14],
            ["Applicant did not continue", 0.18],
            ["Tax ID requires correction", 0.15],
            ["Other", anomalyWindow ? 0.09 : 0.12]
          ])
        : "";

      const dataQualityFlag = duplicateFlag
        ? "Possible duplicate"
        : documentCompleteness < 70
          ? "Critical fields incomplete"
          : random() < 0.025
            ? "Phone format issue"
            : "";

      const reachedTimestamp = status === "Activated" ? activatedAt
        : ["Approved", "Activation Failed"].includes(status) ? approvedAt
          : ["Risk Review", "Rejected"].includes(status) ? reviewedAt
            : status === "Document Verification" ? verifiedAt
              : status === "Submitted" ? submittedAt
                : registeredAt;
      const resolvedAt = ["Activated", "Rejected"].includes(status) ? reachedTimestamp : null;
      const turnaroundHours = resolvedAt ? round(hoursBetween(registeredAt, resolvedAt)) : null;
      const stageAgeHours = round(hoursBetween(reachedTimestamp || registeredAt, SNAPSHOT_AT));
      const slaTargetHours = riskLevel === "High" ? 72 : 48;
      const slaMet = resolvedAt ? turnaroundHours <= slaTargetHours : stageAgeHours <= slaTargetHours;
      const companyName = `${companyWords[index % companyWords.length]} ${companySuffixes[Math.floor(random() * companySuffixes.length)]} ${String(index + 1).padStart(3, "0")}`;

      rows.push({
        application_id: `KYB-26-${String(index + 1).padStart(5, "0")}`,
        company_name: companyName,
        business_type: businessType,
        industry,
        city,
        channel,
        risk_level: riskLevel,
        risk_score: riskScore,
        assigned_team: reviewers[index % reviewers.length],
        registered_at: iso(registeredAt),
        submitted_at: reachedStage >= 1 ? iso(submittedAt) : "",
        verified_at: reachedStage >= 2 ? iso(verifiedAt) : "",
        reviewed_at: reachedStage >= 3 ? iso(reviewedAt) : "",
        approved_at: reachedStage >= 4 ? iso(approvedAt) : "",
        activated_at: status === "Activated" ? iso(activatedAt) : "",
        current_stage: status,
        stage_index: reachedStage,
        stage_age_hours: stageAgeHours,
        document_completeness_pct: documentCompleteness,
        sla_target_hours: slaTargetHours,
        turnaround_hours: turnaroundHours,
        sla_met: slaMet ? 1 : 0,
        api_response_ms: apiResponseMs,
        failed_transaction: failedTransaction ? 1 : 0,
        duplicate_flag: duplicateFlag ? 1 : 0,
        rejection_reason: rejectionReason,
        dropoff_reason: dropoffReason,
        data_quality_flag: dataQualityFlag,
        dashboard_updated_at: iso(SNAPSHOT_AT)
      });
    }

    return rows.sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));
  }

  return {
    snapshotAt: SNAPSHOT_AT.toISOString(),
    stages: STAGES,
    generateApplications
  };
});
