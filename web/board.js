const selectors = {
  loading: document.querySelector("#board-loading"),
  error: document.querySelector("#board-error"),
  content: document.querySelector("#board-content")
};

const formatDate = (value, note) => {
  if (!value) return note || "Not stated by manufacturer";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00Z`)
  );
};

const labelize = (value) => String(value).replaceAll("_", " ").toUpperCase();

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const expectedValue = (testPoint) => {
  const expected = testPoint.expected;
  if (typeof expected.nominal === "number") {
    const tolerance = expected.tolerance_percent ? ` +/- ${expected.tolerance_percent}%` : "";
    return `${expected.nominal} ${expected.unit ?? ""}${tolerance}`;
  }
  if (expected.frequency) return `${expected.frequency.nominal} ${expected.frequency.unit}`;
  if (expected.baud) return `${expected.baud} baud`;
  return labelize(expected.state ?? expected.idle_state ?? testPoint.type);
};

const renderDocuments = (documents) => {
  document.querySelector("[data-documents]").innerHTML = documents
    .map((document) => {
      const external = document.external ? ' target="_blank" rel="noreferrer"' : "";
      const arrow = document.external ? "↗" : "-&gt;";
      return `
        <a class="document-row" href="${escapeHtml(document.href)}"${external}>
          <span class="document-name">${escapeHtml(document.label)}</span>
          <span class="document-format">${escapeHtml(document.format)}</span>
          <span class="document-status status-${escapeHtml(document.status)}">${escapeHtml(labelize(document.status))}</span>
          <span class="document-arrow" aria-hidden="true">${arrow}</span>
        </a>`;
    })
    .join("");
};

const renderComponents = (components) => {
  const target = document.querySelector("[data-components]");
  if (!components.length) {
    target.innerHTML = `
      <tr class="empty-table-row">
        <td colspan="6"><strong>No component list duplicated here.</strong><span>Use the official KiCad source and manufacturer repository for the authoritative design data.</span></td>
      </tr>`;
    return;
  }
  target.innerHTML = components
    .map(
      (component) => `
        <tr>
          <td><code>${escapeHtml(component.references.join(", "))}</code></td>
          <td><strong>${escapeHtml(component.mpn)}</strong><small>${escapeHtml(component.description)}</small></td>
          <td>${escapeHtml(component.manufacturer)}</td>
          <td>${escapeHtml(component.package)}</td>
          <td><span class="lifecycle">${escapeHtml(labelize(component.lifecycle))}</span></td>
          <td><a class="table-link" href="${escapeHtml(component.datasheet)}" target="_blank" rel="noreferrer">Datasheet</a></td>
        </tr>`
    )
    .join("");
};

const renderTestPoints = (testPoints, note) => {
  const target = document.querySelector("[data-testpoints]");
  if (!testPoints.length) {
    target.innerHTML = `<div class="empty-state"><strong>No verified test-point values imported.</strong><p>${escapeHtml(note || "Refer to the official schematic before probing the board.")}</p></div>`;
    return;
  }
  target.innerHTML = testPoints
    .map(
      (testPoint) => `
        <article class="testpoint">
          <div class="testpoint-id">${escapeHtml(testPoint.id)}</div>
          <div>
            <h3>${escapeHtml(testPoint.name)}</h3>
            <p class="testpoint-value">${escapeHtml(expectedValue(testPoint))}</p>
            <p>${escapeHtml(testPoint.conditions)}</p>
          </div>
          <span class="testpoint-type">${escapeHtml(labelize(testPoint.type))}</span>
        </article>`
    )
    .join("");
};

const renderKnownIssues = (issues) => {
  const target = document.querySelector("[data-known-issues]");
  if (!issues.length) {
    target.innerHTML = '<div class="empty-state"><strong>No known issues recorded.</strong><p>Contributors can propose one through a pull request.</p></div>';
    return;
  }
  target.innerHTML = issues
    .map(
      (issue) => `
        <article class="issue-record">
          <div class="issue-index">
            <span>${escapeHtml(issue.id)}</span>
            <strong>${escapeHtml(labelize(issue.severity))}</strong>
          </div>
          <div class="issue-body">
            <h3>${escapeHtml(issue.title)}</h3>
            <p>${escapeHtml(issue.symptom)}</p>
            <dl>
              <div><dt>Test</dt><dd>${escapeHtml(issue.test.procedure)}</dd></div>
              <div><dt>Expected</dt><dd>${escapeHtml(issue.expected_result)}</dd></div>
              <div><dt>Action</dt><dd>${escapeHtml(issue.action)}</dd></div>
              ${issue.safety ? `<div><dt>Safety</dt><dd>${escapeHtml(issue.safety)}</dd></div>` : ""}
            </dl>
          </div>
        </article>`
    )
    .join("");
};

const renderTroubleshooting = (tree) => {
  const nodes = tree.nodes;
  const orderedIds = tree.display_order ?? Object.keys(nodes);
  document.querySelector("[data-troubleshooting]").innerHTML = orderedIds
    .filter((id) => nodes[id])
    .map((id, index) => {
      const node = nodes[id];
      const copy = node.instruction ?? node.question ?? node.conclusion;
      return `
        <div class="troubleshoot-step">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><small>${escapeHtml(labelize(node.type))}</small><strong>${escapeHtml(copy)}</strong></div>
        </div>`;
    })
    .join("");
};

const renderRevisions = (revisions) => {
  document.querySelector("[data-revisions]").innerHTML = revisions
    .map(
      (revision) => `
        <article>
          <div><strong>${escapeHtml(revision.label)}</strong><span>${escapeHtml(formatDate(revision.date, revision.date_note))}</span></div>
          <p>${escapeHtml(revision.summary)}</p>
          <span class="revision-status">${escapeHtml(labelize(revision.status))}</span>
        </article>`
    )
    .join("");
};

const configureLink = (selector, href, text, external = false) => {
  const link = document.querySelector(selector);
  link.href = href;
  link.textContent = text;
  if (external) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
};

const renderBoard = (data) => {
  const setText = (selector, value) => {
    document.querySelector(selector).textContent = value;
  };

  setText("[data-board-status]", labelize(data.board.status));
  setText("[data-spec-version]", `SPEC ${data.scanpcb_version}`);
  setText("[data-board-name]", data.board.name);
  setText("[data-board-summary]", data.board.summary);
  setText("[data-board-description]", data.board.description);
  setText("[data-board-id]", data.board.id);
  setText("[data-breadcrumb-id]", data.board.id);
  setText("[data-revision]", data.current_revision.label);
  setText("[data-revision-date]", formatDate(data.current_revision.date, data.current_revision.date_note));
  setText("[data-organization-label]", data.board.manufacturer ? "Manufacturer" : "Organization");
  setText("[data-organization]", data.board.manufacturer ?? data.board.organization);
  setText("[data-testpoint-verification]", `Verification: ${labelize(data.test_points_verification)}.`);
  setText("[data-source-label]", data.source_note.label);
  setText("[data-source-text]", data.source_note.text);

  const image = document.querySelector("[data-board-image]");
  image.src = data.media.url;
  image.alt = data.media.alt;
  image.addEventListener("error", () => {
    image.hidden = true;
    document.querySelector("[data-image-fallback]").hidden = false;
  }, { once: true });
  setText("[data-image-caption]", data.media.attribution);

  const dimensions = data.physical?.dimensions_mm;
  if (dimensions) {
    setText("[data-dimensions]", `${dimensions.width} × ${dimensions.height} mm`);
    document.querySelector("[data-dimensions-row]").hidden = false;
  }

  if (data.certification) {
    configureLink("[data-certification]", data.certification.url, `${data.certification.scheme} ${data.certification.uid}`, true);
    document.querySelector("[data-certification-row]").hidden = false;
  }

  configureLink("[data-manifest-link]", data.manifest_href, "View YAML");
  configureLink("[data-footer-manifest-link]", data.manifest_href, "Open manifest");
  configureLink("[data-official-page]", data.board.website, "Official product page ↗", true);

  if (data.repository.placeholder) {
    setText("[data-repository-status]", `Planned path: ${data.repository.board_path}`);
    const repositoryLink = document.querySelector("[data-repository-link]");
    repositoryLink.textContent = "Public repository URL pending";
    repositoryLink.removeAttribute("href");
  } else {
    setText("[data-repository-status]", `${data.repository.branch} / ${data.repository.board_path}`);
    configureLink("[data-repository-link]", data.repository.url, "Upstream repository ↗", true);
  }

  renderDocuments(data.documents);
  renderComponents(data.components);
  renderTestPoints(data.test_points, data.test_points_note);
  renderKnownIssues(data.known_issues);
  renderTroubleshooting(data.troubleshooting);
  renderRevisions(data.revisions);
};

const loadBoard = async () => {
  selectors.loading.hidden = false;
  selectors.error.hidden = true;
  selectors.content.hidden = true;

  try {
    const boardId = decodeURIComponent(location.pathname.split("/").filter(Boolean)[1] || "OLIMEX-ESP32-C6-EVB");
    const indexResponse = await fetch("/web/data/boards.json", { cache: "no-store" });
    if (!indexResponse.ok) throw new Error(`Board index HTTP ${indexResponse.status}`);
    const records = await indexResponse.json();
    const record = records.find((item) => item.id === boardId);
    if (!record) throw new Error(`Unknown board ID: ${boardId}`);

    const response = await fetch(record.data_file, { cache: "no-store" });
    if (!response.ok) throw new Error(`Board data HTTP ${response.status}`);
    const data = await response.json();
    renderBoard(data);
    selectors.loading.hidden = true;
    selectors.content.hidden = false;
    document.title = `${data.board.name} | ${data.board.id}`;
  } catch (error) {
    console.error("Unable to load ScanPCB board data", error);
    selectors.loading.hidden = true;
    selectors.error.hidden = false;
  }
};

document.querySelector("[data-retry]").addEventListener("click", loadBoard);
loadBoard();
