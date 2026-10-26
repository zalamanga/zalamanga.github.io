(function initializeDashboard() {
  "use strict";

  const source = window.KYBData;
  if (!source) throw new Error("KYB dataset generator is unavailable.");

  const allApplications = source.generateApplications();
  const snapshotAt = new Date(source.snapshotAt);
  const stageLabels = ["Registered", "Submitted", "Document Verified", "Risk Reviewed", "Approved", "Activated"];
  const filterIds = ["periodFilter", "channelFilter", "riskFilter", "industryFilter"];
  let filteredApplications = [];

  const elements = {
    period: document.getElementById("periodFilter"),
    channel: document.getElementById("channelFilter"),
    risk: document.getElementById("riskFilter"),
    industry: document.getElementById("industryFilter"),
    scope: document.getElementById("scopeLabel"),
    search: document.getElementById("recordSearch")
  };

  const numberFormat = new Intl.NumberFormat("en-US");
  const shortDateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const compactDateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" });

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function percent(numerator, denominator) {
    if (!denominator) return 0;
    return (numerator / denominator) * 100;
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce((total, value) => total + value, 0) / values.length;
  }

  function percentile(values, fraction) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
  }

  function groupCount(rows, keySelector) {
    return rows.reduce((groups, row) => {
      const key = keySelector(row);
      groups.set(key, (groups.get(key) || 0) + 1);
      return groups;
    }, new Map());
  }

  function populateFilter(select, values) {
    const options = [...new Set(values)].sort((a, b) => a.localeCompare(b));
    select.insertAdjacentHTML("beforeend", options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join(""));
  }

  function buildFilters() {
    populateFilter(elements.channel, allApplications.map((row) => row.channel));
    populateFilter(elements.risk, allApplications.map((row) => row.risk_level));
    populateFilter(elements.industry, allApplications.map((row) => row.industry));
  }

  function filterApplications() {
    const days = elements.period.value;
    const cutoff = days === "all" ? null : new Date(snapshotAt.getTime() - Number(days) * 86400000);

    filteredApplications = allApplications.filter((row) => {
      if (cutoff && new Date(row.registered_at) < cutoff) return false;
      if (elements.channel.value !== "all" && row.channel !== elements.channel.value) return false;
      if (elements.risk.value !== "all" && row.risk_level !== elements.risk.value) return false;
      if (elements.industry.value !== "all" && row.industry !== elements.industry.value) return false;
      return true;
    });

    elements.scope.textContent = days === "all" ? "Showing all available data" : `Showing the last ${days} days`;
  }

  function funnelCounts(rows) {
    return stageLabels.map((label, index) => ({
      label,
      index,
      count: rows.filter((row) => row.stage_index >= index).length
    }));
  }

  function channelMetrics(rows) {
    const channels = [...new Set(rows.map((row) => row.channel))];
    return channels.map((channel) => {
      const channelRows = rows.filter((row) => row.channel === channel);
      const resolved = channelRows.filter((row) => row.turnaround_hours !== null).map((row) => row.turnaround_hours);
      return {
        channel,
        total: channelRows.length,
        activationRate: percent(channelRows.filter((row) => row.current_stage === "Activated").length, channelRows.length),
        slaRate: percent(channelRows.filter((row) => row.turnaround_hours !== null && row.sla_met).length, resolved.length),
        averageTat: average(resolved)
      };
    }).sort((a, b) => b.activationRate - a.activationRate);
  }

  function rootCauseMetrics(rows) {
    const nonActivated = rows.filter((row) => row.current_stage !== "Activated");
    const grouped = groupCount(nonActivated, (row) => row.dropoff_reason
      || row.rejection_reason
      || (row.current_stage === "Risk Review" ? "Manual risk-review backlog" : "")
      || (["Approved", "Activation Failed"].includes(row.current_stage) ? "Activation processing issue" : "")
      || "Open workflow / unclassified");
    return [...grouped.entries()]
      .map(([cause, count]) => ({ cause, count, share: percent(count, nonActivated.length) }))
      .sort((a, b) => b.count - a.count);
  }

  function exceptionDetails(row) {
    const reasons = [];
    const openCase = !["Activated", "Rejected"].includes(row.current_stage);
    if (row.failed_transaction) reasons.push("Activation transaction failed");
    if (row.duplicate_flag) reasons.push("Possible duplicate business");
    if (openCase && row.stage_age_hours > row.sla_target_hours * 2) reasons.push("Severe SLA breach");
    else if (openCase && !row.sla_met) reasons.push("SLA threshold breached");
    if (row.api_response_ms > 1000) reasons.push("High API latency");
    if (row.data_quality_flag) reasons.push(row.data_quality_flag);

    const score = (row.failed_transaction ? 5 : 0)
      + (row.duplicate_flag ? 4 : 0)
      + (openCase && row.stage_age_hours > row.sla_target_hours * 2 ? 4 : openCase && !row.sla_met ? 2 : 0)
      + (row.api_response_ms > 1000 ? 2 : 0)
      + (row.data_quality_flag ? 1 : 0);

    return { row, reasons, score, severity: score >= 6 ? "Critical" : "Medium" };
  }

  function getExceptions(rows) {
    return rows
      .map(exceptionDetails)
      .filter((item) => item.reasons.length)
      .sort((a, b) => b.score - a.score || b.row.stage_age_hours - a.row.stage_age_hours);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function renderKpis(rows) {
    const total = rows.length;
    const submitted = rows.filter((row) => row.stage_index >= 1).length;
    const activated = rows.filter((row) => row.current_stage === "Activated").length;
    const resolvedTat = rows.filter((row) => row.turnaround_hours !== null).map((row) => row.turnaround_hours);
    const resolvedRows = rows.filter((row) => row.turnaround_hours !== null);
    const slaMet = resolvedRows.filter((row) => row.sla_met).length;
    const failures = rows.filter((row) => row.failed_transaction).length;

    setText("kpiApplications", numberFormat.format(total));
    setText("kpiSubmission", `${percent(submitted, total).toFixed(1)}%`);
    setText("kpiActivation", `${percent(activated, total).toFixed(1)}%`);
    setText("kpiTurnaround", `${average(resolvedTat).toFixed(1)}h`);
    setText("kpiSla", `${percent(slaMet, resolvedRows.length).toFixed(1)}%`);
    setText("kpiFailures", numberFormat.format(failures));

    setText("kpiApplicationsNote", `${numberFormat.format(submitted)} applications submitted`);
    setText("kpiSubmissionNote", `${numberFormat.format(total - submitted)} still at registration`);
    setText("kpiActivationNote", `${numberFormat.format(activated)} businesses activated`);
    setText("kpiTurnaroundNote", `${numberFormat.format(resolvedTat.length)} resolved applications`);
    setText("kpiSlaNote", `${numberFormat.format(resolvedRows.length - slaMet)} resolved cases breached SLA`);
    setText("kpiFailuresNote", failures ? "Require activation retry" : "No failed activation attempts");
  }

  function renderInsights(rows) {
    const funnel = funnelCounts(rows);
    const losses = funnel.slice(1).map((stage, index) => ({
      from: funnel[index].label,
      to: stage.label,
      lost: funnel[index].count - stage.count,
      rate: percent(funnel[index].count - stage.count, funnel[index].count)
    })).sort((a, b) => b.rate - a.rate);
    const channels = channelMetrics(rows).sort((a, b) => a.activationRate - b.activationRate);
    const causes = rootCauseMetrics(rows);
    const exceptions = getExceptions(rows);
    const cards = [
      {
        title: "Largest funnel loss",
        text: losses.length ? `${losses[0].from} → ${losses[0].to}: ${losses[0].rate.toFixed(1)}% drop (${losses[0].lost} cases).` : "Not enough data for comparison."
      },
      {
        title: "Channel opportunity",
        text: channels.length ? `${channels[0].channel} has the lowest activation rate at ${channels[0].activationRate.toFixed(1)}%.` : "No channel data in this selection."
      },
      {
        title: "Top root cause",
        text: causes.length ? `${causes[0].cause} affects ${causes[0].count} non-activated applications.` : "No unresolved root causes found."
      },
      {
        title: "Immediate action",
        text: `${exceptions.filter((item) => item.severity === "Critical").length} critical exceptions should be investigated first.`
      }
    ];

    document.getElementById("insightStrip").innerHTML = cards.map((card, index) => `
      <article class="insight-card">
        <span class="insight-index">0${index + 1}</span>
        <div><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.text)}</p></div>
      </article>
    `).join("");
  }

  function renderFunnel(rows) {
    const funnel = funnelCounts(rows);
    const maximum = funnel[0]?.count || 1;
    document.getElementById("funnelChart").innerHTML = funnel.map((stage) => `
      <div class="funnel-row">
        <span class="funnel-name">${escapeHtml(stage.label)}</span>
        <div class="funnel-track" title="${stage.count} applications">
          <div class="funnel-fill" style="width:${percent(stage.count, maximum).toFixed(1)}%"></div>
        </div>
        <span class="funnel-value"><strong>${numberFormat.format(stage.count)}</strong><small>${percent(stage.count, maximum).toFixed(1)}%</small></span>
      </div>
    `).join("");
  }

  function weekStart(dateValue) {
    const date = new Date(dateValue);
    const day = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - day);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  function renderTrend(rows) {
    const groups = new Map();
    rows.forEach((row) => {
      const start = weekStart(row.registered_at);
      const key = start.toISOString();
      if (!groups.has(key)) groups.set(key, { start, registered: 0, activated: 0 });
      const group = groups.get(key);
      group.registered += 1;
      if (row.current_stage === "Activated") group.activated += 1;
    });

    const weekly = [...groups.values()].sort((a, b) => a.start - b.start).slice(-12);
    const container = document.getElementById("trendChart");
    if (!weekly.length) {
      container.innerHTML = '<div class="empty-state">No trend data available for this selection.</div>';
      return;
    }

    const width = 760;
    const height = 260;
    const margin = { top: 18, right: 18, bottom: 36, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxValue = Math.max(5, ...weekly.flatMap((week) => [week.registered, week.activated]));
    const x = (index) => margin.left + (weekly.length === 1 ? innerWidth / 2 : index * innerWidth / (weekly.length - 1));
    const y = (value) => margin.top + innerHeight - (value / maxValue) * innerHeight;
    const pathFor = (key) => weekly.map((week, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(week[key]).toFixed(1)}`).join(" ");
    const registeredPath = pathFor("registered");
    const activatedPath = pathFor("activated");
    const areaPath = `${registeredPath} L${x(weekly.length - 1)},${margin.top + innerHeight} L${x(0)},${margin.top + innerHeight} Z`;
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((fraction) => {
      const value = maxValue * (1 - fraction);
      const lineY = margin.top + innerHeight * fraction;
      return `<line class="grid-line" x1="${margin.left}" y1="${lineY}" x2="${width - margin.right}" y2="${lineY}"></line><text class="axis-label" x="5" y="${lineY + 3}">${Math.round(value)}</text>`;
    }).join("");
    const xLabels = weekly.map((week, index) => `<text class="axis-label" text-anchor="middle" x="${x(index)}" y="${height - 10}">${compactDateFormat.format(week.start)}</text>`).join("");
    const points = weekly.map((week, index) => `
      <circle class="chart-point" fill="#2563eb" cx="${x(index)}" cy="${y(week.registered)}" r="3"></circle>
      <circle class="chart-point" fill="#159a6e" cx="${x(index)}" cy="${y(week.activated)}" r="3"></circle>
    `).join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
        <defs><linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2563eb" stop-opacity="0.16"></stop><stop offset="100%" stop-color="#2563eb" stop-opacity="0"></stop></linearGradient></defs>
        ${gridLines}
        <path class="area-registered" d="${areaPath}"></path>
        <path class="line-registered" d="${registeredPath}"></path>
        <path class="line-activated" d="${activatedPath}"></path>
        ${points}
        ${xLabels}
      </svg>
    `;
  }

  function renderBottlenecks(rows) {
    const openStatuses = [...new Set(rows.filter((row) => !["Activated", "Rejected"].includes(row.current_stage)).map((row) => row.current_stage))];
    const metrics = openStatuses.map((status) => {
      const stageRows = rows.filter((row) => row.current_stage === status);
      return {
        status,
        total: stageRows.length,
        averageAge: average(stageRows.map((row) => row.stage_age_hours)),
        breached: stageRows.filter((row) => !row.sla_met).length
      };
    }).sort((a, b) => b.breached - a.breached || b.total - a.total);
    const maximum = Math.max(1, ...metrics.map((metric) => metric.total));
    const container = document.getElementById("bottleneckList");

    if (!metrics.length) {
      container.innerHTML = '<div class="empty-state">No open workflow stages in this selection.</div>';
      return;
    }

    container.innerHTML = metrics.map((metric) => {
      const breachRate = percent(metric.breached, metric.total);
      const level = breachRate >= 45 ? "danger" : breachRate >= 20 ? "warning" : "";
      return `
        <div class="bottleneck-row">
          <span class="bottleneck-name"><strong>${escapeHtml(metric.status)}</strong><small>${metric.breached} SLA breaches</small></span>
          <div class="progress-track"><div class="progress-fill ${level}" style="width:${percent(metric.total, maximum).toFixed(1)}%"></div></div>
          <span class="bottleneck-metrics"><span><strong>${metric.total}</strong><small>Cases</small></span><span><strong>${metric.averageAge.toFixed(1)}h</strong><small>Avg. age</small></span></span>
        </div>
      `;
    }).join("");
  }

  function renderChannels(rows) {
    const metrics = channelMetrics(rows);
    const body = document.getElementById("channelTableBody");
    if (!metrics.length) {
      body.innerHTML = '<tr><td colspan="5" class="empty-state">No channel data available.</td></tr>';
      return;
    }

    body.innerHTML = metrics.map((metric) => `
      <tr>
        <td><span class="channel-name">${escapeHtml(metric.channel)}</span></td>
        <td>${numberFormat.format(metric.total)}</td>
        <td><span class="rate-cell"><span class="mini-bar"><i style="width:${metric.activationRate.toFixed(1)}%"></i></span>${metric.activationRate.toFixed(1)}%</span></td>
        <td>${metric.slaRate.toFixed(1)}%</td>
        <td>${metric.averageTat.toFixed(1)}h</td>
      </tr>
    `).join("");
  }

  function renderRootCauses(rows) {
    const causes = rootCauseMetrics(rows).slice(0, 6);
    const maximum = causes[0]?.count || 1;
    const container = document.getElementById("rootCauseList");
    if (!causes.length) {
      container.innerHTML = '<div class="empty-state">No non-activated applications in this selection.</div>';
      return;
    }

    container.innerHTML = causes.map((cause) => `
      <div class="cause-row">
        <span>${escapeHtml(cause.cause)}</span>
        <div class="progress-track"><div class="cause-fill" style="width:${percent(cause.count, maximum).toFixed(1)}%"></div></div>
        <strong>${cause.count} · ${cause.share.toFixed(1)}%</strong>
      </div>
    `).join("");
  }

  function renderQuality(rows) {
    const total = rows.length;
    const complete = rows.filter((row) => row.document_completeness_pct >= 80).length;
    const duplicates = rows.filter((row) => row.duplicate_flag).length;
    const p95Latency = percentile(rows.map((row) => row.api_response_ms), 0.95);
    const flagged = rows.filter((row) => row.data_quality_flag).length;
    const cards = [
      { label: "Document completeness", value: `${percent(complete, total).toFixed(1)}%`, note: "Applications with ≥80% required data" },
      { label: "Possible duplicates", value: numberFormat.format(duplicates), note: "Records queued for entity matching" },
      { label: "API latency P95", value: `${Math.round(p95Latency)}ms`, note: p95Latency > 1000 ? "Above the 1,000ms watch threshold" : "Within the operating threshold" },
      { label: "Quality flags", value: numberFormat.format(flagged), note: "Records requiring source-data correction" }
    ];

    document.getElementById("qualityGrid").innerHTML = cards.map((card) => `
      <div class="quality-card"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong><small>${escapeHtml(card.note)}</small></div>
    `).join("");
  }

  function renderExceptions(rows) {
    const exceptions = getExceptions(rows);
    setText("exceptionCount", numberFormat.format(exceptions.length));
    setText("exceptionSummary", `${exceptions.filter((item) => item.severity === "Critical").length} critical and ${exceptions.filter((item) => item.severity === "Medium").length} watch-list cases based on operational rules.`);
    const container = document.getElementById("exceptionList");

    if (!exceptions.length) {
      container.innerHTML = '<div class="empty-state">No operational exceptions found in this selection.</div>';
      return;
    }

    container.innerHTML = exceptions.slice(0, 6).map((item) => `
      <article class="exception-item">
        <div class="exception-top"><span class="severity ${item.severity === "Medium" ? "medium" : ""}">${item.severity}</span><span class="exception-id">${escapeHtml(item.row.application_id)}</span></div>
        <h4>${escapeHtml(item.row.company_name)}</h4>
        <p>${escapeHtml(item.reasons.slice(0, 2).join(" · "))}</p>
      </article>
    `).join("");
  }

  function recordSignal(row) {
    const openCase = !["Activated", "Rejected"].includes(row.current_stage);
    if (row.failed_transaction || row.duplicate_flag || (openCase && row.stage_age_hours > row.sla_target_hours * 2)) return { label: "Critical", className: "critical" };
    if ((openCase && !row.sla_met) || row.api_response_ms > 1000 || row.data_quality_flag) return { label: "Watch", className: "watch" };
    return { label: "Normal", className: "normal" };
  }

  function renderRecords() {
    const query = elements.search.value.trim().toLowerCase();
    const rows = filteredApplications
      .filter((row) => !query || row.application_id.toLowerCase().includes(query) || row.company_name.toLowerCase().includes(query))
      .sort((a, b) => exceptionDetails(b).score - exceptionDetails(a).score || new Date(b.registered_at) - new Date(a.registered_at));

    const body = document.getElementById("recordsTableBody");
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="7" class="empty-state">No applications match the current filters.</td></tr>';
    } else {
      body.innerHTML = rows.slice(0, 15).map((row) => {
        const signal = recordSignal(row);
        return `
          <tr>
            <td><strong>${escapeHtml(row.application_id)}</strong><small>${escapeHtml(row.company_name)}</small></td>
            <td>${shortDateFormat.format(new Date(row.registered_at))}</td>
            <td>${escapeHtml(row.channel)}</td>
            <td><span class="risk-badge risk-${slug(row.risk_level)}">${escapeHtml(row.risk_level)}</span></td>
            <td><span class="status-badge status-${slug(row.current_stage)}">${escapeHtml(row.current_stage)}</span></td>
            <td>${row.stage_age_hours.toFixed(1)}h</td>
            <td><span class="signal-badge signal-${signal.className}">${signal.label}</span></td>
          </tr>
        `;
      }).join("");
    }

    setText("recordsCount", `${numberFormat.format(rows.length)} matching records`);
  }

  function renderAll() {
    filterApplications();
    renderKpis(filteredApplications);
    renderInsights(filteredApplications);
    renderFunnel(filteredApplications);
    renderTrend(filteredApplications);
    renderBottlenecks(filteredApplications);
    renderChannels(filteredApplications);
    renderRootCauses(filteredApplications);
    renderQuality(filteredApplications);
    renderExceptions(filteredApplications);
    renderRecords();
  }

  function csvEscape(value) {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
  }

  function downloadFilteredCsv() {
    if (!filteredApplications.length) return;
    const columns = Object.keys(filteredApplications[0]);
    const csv = [
      columns.join(","),
      ...filteredApplications.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "kyb_filtered_applications.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetFilters() {
    elements.period.value = "90";
    elements.channel.value = "all";
    elements.risk.value = "all";
    elements.industry.value = "all";
    elements.search.value = "";
    renderAll();
  }

  function setupMobileNavigation() {
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const backdrop = document.getElementById("mobileBackdrop");

    function closeMenu() {
      sidebar.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      backdrop.hidden = true;
    }

    menuButton.addEventListener("click", () => {
      const nextOpen = !sidebar.classList.contains("open");
      sidebar.classList.toggle("open", nextOpen);
      menuButton.setAttribute("aria-expanded", String(nextOpen));
      backdrop.hidden = !nextOpen;
    });
    backdrop.addEventListener("click", closeMenu);
    sidebar.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  function setupActiveNavigation() {
    const links = [...document.querySelectorAll(".sidebar-nav a")];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  buildFilters();
  filterIds.forEach((id) => document.getElementById(id).addEventListener("change", renderAll));
  elements.search.addEventListener("input", renderRecords);
  document.getElementById("resetFilters").addEventListener("click", resetFilters);
  document.getElementById("downloadCsv").addEventListener("click", downloadFilteredCsv);
  setupMobileNavigation();
  setupActiveNavigation();
  renderAll();
})();
