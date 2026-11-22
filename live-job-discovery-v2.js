/* Career-Ops Live Employer Search v2.1
 * Read-only discovery from public Greenhouse job-board APIs.
 * No automatic applications, no invented postings, no changes to published feed.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) {
    root.CareerOpsLiveDiscoveryV2 = api;
    if (root.document && typeof root.fetch === "function") {
      api.mount(root.document, root.fetch.bind(root));
    }
  }
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  // These are public employer-board slugs, not authenticated APIs.
  const BOARDS = Object.freeze([
    { slug: "zenoti", name: "Zenoti" },
    { slug: "hackerrank", name: "HackerRank" },
    { slug: "gomotive", name: "Motive" },
    { slug: "coherehealth", name: "Cohere Health" },
    { slug: "doordashindia", name: "DoorDash India" },
    { slug: "coursera", name: "Coursera" },
    { slug: "gitlab", name: "GitLab" },
    { slug: "canonical", name: "Canonical" },
    { slug: "cloudflare", name: "Cloudflare" },
    { slug: "braze", name: "Braze" },
    { slug: "gleanwork", name: "Glean" },
    { slug: "instawork", name: "Instawork" }
  ]);
  const DAY_MS = 86400000;
  const LIMIT = 60;
  const TIMEOUT_MS = 9000;
  const ROLE_WORDS = new Set([
    "engineer", "developer", "analyst", "specialist", "architect",
    "consultant", "administrator", "tester", "scientist", "manager",
    "lead", "intern", "trainee", "senior", "junior", "associate",
    "full", "stack", "level", "entry", "staff", "principal"
  ]);
  function normalize(value) {
    return String(value == null ? "" : value).normalize("NFKC").toLowerCase()
      .replace(/\basp\s*\.?\s*net\b/g, "aspnet")
      .replace(/\.net\b/g, "dotnet")
      .replace(/\bdot\s+net\b/g, "dotnet")
      .replace(/c\+\+/g, "cpp")
      .replace(/c#/g, "csharp")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\bservice now\b/g, "servicenow")
      .replace(/\bsales force\b/g, "salesforce");
  }
  function hasPhrase(text, phrase) {
    return Boolean(phrase && (" " + text + " ").includes(" " + phrase + " "));
  }
  function matchesTitle(title, query) {
    const terms = normalize(query).split(" ").filter(Boolean);
    const jobTitle = normalize(title);
    if (!terms.length || !jobTitle) return false;
    const essentials = terms.filter(term => !ROLE_WORDS.has(term));
    return (essentials.length ? essentials : terms)
      .every(term => hasPhrase(jobTitle, term));
  }
  const INDIAN_LOCATIONS = [
    "india", "hyderabad", "bengaluru", "bangalore", "pune", "mumbai",
    "chennai", "delhi", "noida", "gurugram", "gurgaon", "kolkata",
    "kochi", "cochin", "ahmedabad", "jaipur", "indore", "coimbatore",
    "bhubaneswar", "visakhapatnam", "vizag", "trivandrum",
    "thiruvananthapuram", "chandigarh", "mysuru", "mysore", "nagpur",
    "lucknow", "surat", "vadodara", "navi mumbai", "greater noida",
    "telangana", "karnataka", "maharashtra", "tamil nadu",
    "andhra pradesh", "kerala", "uttar pradesh", "west bengal",
    "gujarat", "rajasthan", "madhya pradesh", "odisha"
  ];
  const OVERSEAS_LOCATIONS = [
    "united states", "usa", "us", "united kingdom", "uk", "canada",
    "germany", "australia", "singapore", "poland", "france", "spain",
    "netherlands", "portugal", "united arab emirates", "dubai"
  ];
  function isIndiaLocation(location) {
    const loc = normalize(location);
    if (!loc) return false; // Remote without an India designation is not enough.
    if (OVERSEAS_LOCATIONS.some(value => hasPhrase(loc, value))) return false;
    return INDIAN_LOCATIONS.some(value => hasPhrase(loc, value));
  }
  function matchesLocation(location, selection) {
    if (!isIndiaLocation(location)) return false;
    const city = normalize(selection || "india");
    if (city === "india") return true;
    const loc = normalize(location);
    if (city === "remote") return /\b(remote|wfh)\b/.test(loc) || hasPhrase(loc, "work from home");
    const aliases = {
      bengaluru: ["bengaluru", "bangalore"],
      delhi: ["delhi", "new delhi", "ncr"],
      mumbai: ["mumbai", "navi mumbai"],
      chennai: ["chennai", "madras"]
    };
    return (aliases[city] || [city]).some(value => hasPhrase(loc, value));
  }
  function recentlyUpdated(date, now = Date.now()) {
    const stamp = Date.parse(String(date || ""));
    return Number.isFinite(stamp) && stamp <= now && now - stamp <= 30 * DAY_MS;
  }
  function validPostingUrl(value) {
    try {
      const url = new URL(String(value || ""));
      return url.protocol === "https:" && Boolean(url.hostname) &&
        !url.username && !url.password && !/^(localhost|127\.0\.0\.1)$/.test(url.hostname);
    } catch (_error) {
      return false;
    }
  }
  function selectJobs(allJobs, query, location, now = Date.now()) {
    const seen = new Set();
    const selected = [];
    for (const job of allJobs) {
      if (!job || !validPostingUrl(job.url) ||
          !recentlyUpdated(job.date, now) ||
          !matchesLocation(job.location, location) ||
          !matchesTitle(job.title, query)) continue;
      const key = job.url.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      selected.push(job);
    }
    selected.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return selected;
  }
  function boardUrl(slug) {
    return "https://boards-api.greenhouse.io/v1/boards/" + encodeURIComponent(slug) + "/jobs";
  }
  async function fetchBoard(board, fetcher, timeoutMs = TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(boardUrl(board.slug), {
        signal: controller.signal, headers: { Accept: "application/json" },
        cache: "no-store", credentials: "omit"
      });
      if (!response.ok) {
        throw new Error(response.status === 404 ? "No public board (404)" : "HTTP " + response.status);
      }
      const body = await response.json();
      if (!body || !Array.isArray(body.jobs)) throw new Error("Unexpected API response");
      return {
        board: board.name,
        jobs: body.jobs.map(job => ({
          title: String(job.title || ""),
          company: board.name,
          location: String((job.location && job.location.name) || ""),
          date: String(job.updated_at || ""),
          url: String(job.absolute_url || ""),
          id: String(job.id || "")
        }))
      };
    } catch (error) {
      const reason = controller.signal.aborted ? "Timed out" :
        error instanceof TypeError ? "Blocked by browser/network" :
        (error && error.message) || "Unavailable";
      throw new Error(reason);
    } finally {
      clearTimeout(timer);
    }
  }
  function textNode(doc, tag, value, css) {
    const node = doc.createElement(tag);
    node.textContent = value;
    if (css) node.style.cssText = css;
    return node;
  }
  function createCard(doc, job) {
    const el = doc.createElement("article");
    el.className = "live-discovery-card";
    el.appendChild(textNode(doc, "strong", job.title));
    el.appendChild(textNode(doc, "p",
      job.company + " · " + job.location + " · Updated " + job.date.slice(0, 10),
      "font-size:12px;opacity:.85;margin:7px 0 10px;overflow-wrap:anywhere"));
    const link = textNode(doc, "a", "View official employer listing ↗");
    link.href = job.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    el.appendChild(link);
    return el;
  }
  function createFailures(doc, failures, totalBoards) {
    if (!failures.length) return null;
    const details = doc.createElement("details");
    details.className = "live-discovery-errors";
    const summary = textNode(doc, "summary", failures.length + " of " + totalBoards +
      " employer sources unavailable — view diagnostics");
    details.appendChild(summary);
    const list = doc.createElement("ul");
    for (const failure of failures) {
      list.appendChild(textNode(doc, "li", failure.board + ": " + failure.reason));
    }
    details.appendChild(list);
    return details;
  }
  function mount(doc, fetcher) {
    const get = id => doc.getElementById(id);
    const btn = get("liveDiscoveryV2Run");
    const results = get("liveDiscoveryV2Results");
    const status = get("liveDiscoveryV2Status");
    const panel = get("liveDiscoveryV2");
    if (!btn || !results || !status || !get("jobSearch")) return false;
    let running = false;
    btn.addEventListener("click", async function () {
      if (running) return;
      const query = get("jobSearch").value.trim();
      const selectedLocation = get("locationFilter")?.value || "india";
      if (!query) {
        status.textContent = "Type a job title or skill above, then run Live Employer Search.";
        get("jobSearch").focus();
        return;
      }
      running = true;
      btn.disabled = true;
      btn.textContent = "Searching employers…";
      if (panel) panel.setAttribute("aria-busy", "true");
      results.replaceChildren();
      status.textContent = "Checking " + BOARDS.length + " public employer boards for “" + query + "”…";
      try {
        const settled = await Promise.all(BOARDS.map(async board => {
          try {
            return { ok: true, data: await fetchBoard(board, fetcher) };
          } catch (error) {
            return { ok: false, board: board.name, reason: error.message };
          }
        }));
        const successes = settled.filter(item => item.ok);
        const failures = settled.filter(item => !item.ok);
        const scanned = successes.reduce((sum, item) => sum + item.data.jobs.length, 0);
        const matches = selectJobs(successes.flatMap(item => item.data.jobs),
          query, selectedLocation);
        if (!successes.length) {
          status.textContent = "Live search unavailable: all " + BOARDS.length +
            " employer sources failed. No vacancy result can be confirmed right now.";
          results.appendChild(textNode(doc, "p",
            "The published job feed below is independent and remains available. " +
            "You can also use the external employer-search links."));
        } else {
          status.textContent = matches.length + " matching India job" +
            (matches.length === 1 ? "" : "s") + " updated within 30 days · " +
            successes.length + "/" + BOARDS.length + " sources responded · " +
            scanned + " employer listings checked. Live results are separate from published vacancies.";
          for (const job of matches.slice(0, LIMIT)) results.appendChild(createCard(doc, job));
          if (!matches.length) {
            results.appendChild(textNode(doc, "p",
              "No matching recent India-based roles were found on the responding boards. " +
              "This is not a claim that no such vacancies exist elsewhere."));
          } else if (matches.length > LIMIT) {
            results.appendChild(textNode(doc, "p",
              "Showing the newest " + LIMIT + " of " + matches.length + " matching roles."));
          }
        }
        const diagnostics = createFailures(doc, failures, BOARDS.length);
        if (diagnostics) results.appendChild(diagnostics);
        const exp = get("experienceFilter");
        if (exp && exp.value) results.appendChild(textNode(doc, "p",
          "Note: Live employer results use the role and India location above. " +
          "Experience and advanced filters apply to the published vacancy feed only.",
          "font-size:12px;opacity:.82;grid-column:1/-1"));
      } catch (_error) {
        status.textContent = "Live employer lookup encountered an unexpected error. Published jobs remain available.";
      } finally {
        running = false;
        btn.disabled = false;
        btn.textContent = "Find live employer jobs";
        if (panel) panel.removeAttribute("aria-busy");
      }
    });
    return true;
  }
  return Object.freeze({
    BOARDS, normalize, matchesTitle, isIndiaLocation,
    matchesLocation, recentlyUpdated, validPostingUrl,
    selectJobs, fetchBoard, mount
  });
});
