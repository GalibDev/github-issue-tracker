const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const tabButtons = document.querySelectorAll(".tab");
const issueModal = document.getElementById("issueModal");
const modalContent = document.getElementById("modalContent");

let allIssues = [];
let currentTab = "all";

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    errorMsg.textContent = "";
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    loadIssues();
  } else {
    errorMsg.textContent = "Invalid username or password";
  }
});

function formatDate(dateString) {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString();
}

function getApiArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.issues)) return data.issues;
  if (Array.isArray(data.result)) return data.result;
  return [];
}

function getSingleIssue(data) {
  if (data && data.data) return data.data;
  return data;
}

function normalizeStatus(status) {
  return String(status || "").toLowerCase() === "closed" ? "closed" : "open";
}

function normalizePriority(priority) {
  const value = String(priority || "").toLowerCase();

  if (value.includes("high")) return "HIGH";
  if (value.includes("medium")) return "MEDIUM";
  return "LOW";
}

function getPriorityClass(priority) {
  return normalizePriority(priority).toLowerCase();
}

function getStatusIconHTML(status) {
  if (status === "closed") {
    return `
      <span class="status-icon closed">
        <span class="status-ring"></span>
        <span class="status-symbol">✓</span>
      </span>
    `;
  }

  return `
    <span class="status-icon open">
      <span class="status-ring"></span>
      <span class="status-center-dot"></span>
    </span>
  `;
}

function normalizeLabels(issue) {
  const rawLabels = issue.labels || issue.label;

  if (!rawLabels) return [];

  let labels = [];

  if (Array.isArray(rawLabels)) {
    labels = rawLabels
      .map((item) => {
        if (typeof item === "string") return item;

        if (typeof item === "object" && item !== null) {
          return item.name || item.label || item.title || "";
        }

        return "";
      })
      .filter(Boolean);
  } else if (typeof rawLabels === "string") {
    labels = rawLabels
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  } else if (typeof rawLabels === "object" && rawLabels !== null) {
    labels = [rawLabels.name || rawLabels.label || rawLabels.title || ""].filter(Boolean);
  }

  return labels.filter((label) => {
    return !String(label).toLowerCase().includes("good first issue");
  });
}

function getLabelsHTML(issue) {
  const labels = normalizeLabels(issue);

  if (!labels.length) return "";

  return labels
    .map((label) => {
      const text = String(label).toLowerCase().trim();

      if (text.includes("bug")) {
        return `
          <span class="label-badge bug-label">
            <span class="label-icon">🐞</span>
            BUG
          </span>
        `;
      }

      if (text.includes("help")) {
        return `
          <span class="label-badge help-label">
            <span class="label-icon">😕</span>
            HELP WANTED
          </span>
        `;
      }

      if (text.includes("enhancement")) {
        return `
          <span class="label-badge enhancement-label">
            <span class="label-icon">✨</span>
            ENHANCEMENT
          </span>
        `;
      }

      return `
        <span class="label-badge default-label">
          <span class="label-icon">•</span>
          ${label}
        </span>
      `;
    })
    .join("");
}

function truncateText(text, maxLength = 90) {
  if (!text) return "No description available";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function getFilteredIssues(list = allIssues) {
  if (currentTab === "open") {
    return list.filter((issue) => normalizeStatus(issue.status) === "open");
  }

  if (currentTab === "closed") {
    return list.filter((issue) => normalizeStatus(issue.status) === "closed");
  }

  return list;
}

async function loadIssues() {
  try {
    loader.classList.remove("hidden");
    issuesContainer.innerHTML = "";

    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await response.json();

    allIssues = getApiArray(data);
    renderIssues(getFilteredIssues());
  } catch (error) {
    issuesContainer.innerHTML = `<p class="no-data">Failed to load issues</p>`;
  } finally {
    loader.classList.add("hidden");
  }
}

function renderIssues(issues) {
  issuesContainer.innerHTML = "";
  issueCount.textContent = `${issues.length} Issues`;

  if (!issues.length) {
    issuesContainer.innerHTML = `<p class="no-data">No issues found</p>`;
    return;
  }

  issues.forEach((issue) => {
    const status = normalizeStatus(issue.status);
    const priorityText = normalizePriority(issue.priority);
    const priorityClass = getPriorityClass(issue.priority);

    const card = document.createElement("div");
    card.className = `issue-card ${status}`;

    card.innerHTML = `
      <div class="card-top">
        ${getStatusIconHTML(status)}
        <span class="priority-badge ${priorityClass}">
          ${priorityText}
        </span>
      </div>

      <h3 class="issue-title">${issue.title || "No title"}</h3>

      <p class="issue-desc">
        ${truncateText(issue.description, 90)}
      </p>

      <p class="issue-status">
        Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
      </p>

      <div class="card-labels">
        ${getLabelsHTML(issue)}
      </div>

      <div class="card-footer">
        <p>#${issue.id || 1} by ${issue.author || "Unknown"}</p>
        <p>${formatDate(issue.createdAt)}</p>
      </div>
    `;

    card.addEventListener("click", function () {
      loadSingleIssue(issue.id);
    });

    issuesContainer.appendChild(card);
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    tabButtons.forEach((tab) => tab.classList.remove("active"));
    btn.classList.add("active");

    currentTab = btn.dataset.tab;

    if (searchInput.value.trim()) {
      searchIssues();
    } else {
      renderIssues(getFilteredIssues());
    }
  });
});

async function searchIssues() {
  const searchText = searchInput.value.trim();

  if (!searchText) {
    renderIssues(getFilteredIssues());
    return;
  }

  try {
    loader.classList.remove("hidden");
    issuesContainer.innerHTML = "";

    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`
    );
    const data = await response.json();

    const searchedIssues = getApiArray(data);
    const filteredSearchedIssues = getFilteredIssues(searchedIssues);

    renderIssues(filteredSearchedIssues);
  } catch (error) {
    issuesContainer.innerHTML = `<p class="no-data">Search failed</p>`;
  } finally {
    loader.classList.add("hidden");
  }
}

searchInput.addEventListener("keyup", function () {
  searchIssues();
});

searchBtn.addEventListener("click", function () {
  searchIssues();
});

async function loadSingleIssue(id) {
  try {
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    );
    const data = await response.json();
    const issue = getSingleIssue(data);

    const status = normalizeStatus(issue.status);
    const priorityText = normalizePriority(issue.priority);
    const priorityClass = getPriorityClass(issue.priority);

    modalContent.innerHTML = `
      <h2 class="modal-title">${issue.title || "No title"}</h2>

      <div class="modal-meta">
        <span class="modal-status">
          ${status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span>Created by ${issue.author || "Unknown"}</span>
        <span>•</span>
        <span>${formatDate(issue.createdAt)}</span>
      </div>

      <div class="modal-labels">
        ${getLabelsHTML(issue)}
      </div>

      <p class="modal-desc">
        ${issue.description || "No description available"}
      </p>

      <div class="modal-info-row">
        <div class="modal-info-box">
          <h4>Status:</h4>
          <p>${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        </div>

        <div class="modal-info-box">
          <h4>Priority:</h4>
          <p>
            <span class="priority-badge ${priorityClass}">
              ${priorityText}
            </span>
          </p>
        </div>
      </div>

      <div class="modal-info-row">
        <div class="modal-info-box">
          <h4>Author:</h4>
          <p>${issue.author || "Unknown"}</p>
        </div>

        <div class="modal-info-box">
          <h4>Created At:</h4>
          <p>${formatDate(issue.createdAt)}</p>
        </div>
      </div>

      <button class="modal-close-btn" id="closeModalBtn">Close</button>
    `;

    issueModal.classList.remove("hidden");

    document.getElementById("closeModalBtn").addEventListener("click", function () {
      issueModal.classList.add("hidden");
    });
  } catch (error) {
    alert("Failed to load issue details");
  }
}

issueModal.addEventListener("click", function (e) {
  if (e.target === issueModal) {
    issueModal.classList.add("hidden");
  }
});