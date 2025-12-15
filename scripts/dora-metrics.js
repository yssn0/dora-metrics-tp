import fs from "fs";

// Dynamic repository detection from GitHub Actions environment
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "yssn0/dora-metrics-tp";
const [OWNER, REPO] = GITHUB_REPOSITORY.split("/");
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `token ${TOKEN}`,
  Accept: "application/vnd.github+json",
};

async function github(url) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Fetch error: ${err.message}`);
    return null;
  }
}

// Calculate MTTR from workflow runs
function calculateMTTR(runs) {
  const sortedRuns = [...runs].sort((a, b) =>
    new Date(a.created_at) - new Date(b.created_at)
  );

  let mttrValues = [];
  let lastFailure = null;

  for (const run of sortedRuns) {
    if (run.conclusion === "failure") {
      lastFailure = run;
    } else if (run.conclusion === "success" && lastFailure) {
      // Time from failure to recovery
      const failureTime = new Date(lastFailure.created_at);
      const recoveryTime = new Date(run.created_at);
      const mttr = (recoveryTime - failureTime) / 60000; // in minutes
      mttrValues.push(mttr);
      lastFailure = null;
    }
  }

  if (mttrValues.length === 0) return 0;
  return Math.round(mttrValues.reduce((a, b) => a + b, 0) / mttrValues.length);
}

// Calculate deployment frequency over last N days
function calculateDeploymentFrequency(runs, days = 7) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recentRuns = runs.filter(run => {
    const runDate = new Date(run.created_at);
    return runDate >= cutoff && run.conclusion === "success";
  });

  return {
    total: recentRuns.length,
    perDay: Math.round((recentRuns.length / days) * 100) / 100,
    periodDays: days
  };
}

async function main() {
  console.log(`Fetching DORA metrics for ${OWNER}/${REPO}...`);

  // 1️⃣ Workflow runs = deployments
  const runsData = await github(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?per_page=100`
  );

  if (!runsData || !runsData.workflow_runs) {
    console.error("Failed to fetch workflow runs");
    process.exit(1);
  }

  const runs = runsData.workflow_runs;
  const totalDeployments = runs.length;
  const failed = runs.filter(r => r.conclusion === "failure").length;

  // Deployment Frequency
  const dfMetrics = calculateDeploymentFrequency(runs, 7);

  // MTTR
  const mttr = calculateMTTR(runs);

  // 2️⃣ Pull Requests = lead time
  const prs = await github(
    `https://api.github.com/repos/${OWNER}/${REPO}/pulls?state=closed&per_page=50`
  );

  let avgLeadTime = 0;
  if (prs && prs.length > 0) {
    const mergedPRs = prs.filter(pr => pr.merged_at);

    if (mergedPRs.length > 0) {
      const leadTimes = mergedPRs.map(pr =>
        (new Date(pr.merged_at) - new Date(pr.created_at)) / 60000
      );
      avgLeadTime = Math.round(
        leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length
      );
    }
  }

  // 3️⃣ Build metrics object
  const metrics = {
    deploymentFrequency: dfMetrics.perDay,
    deploymentFrequencyRaw: dfMetrics.total,
    deploymentPeriodDays: dfMetrics.periodDays,
    totalDeployments: totalDeployments,
    leadTimeMinutes: avgLeadTime,
    changeFailureRate: totalDeployments > 0
      ? Math.round((failed / totalDeployments) * 100)
      : 0,
    failedDeployments: failed,
    mttrMinutes: mttr,
    lastUpdated: new Date().toISOString()
  };

  console.log("DORA Metrics calculated:");
  console.log(JSON.stringify(metrics, null, 2));

  // Ensure data directory exists
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data", { recursive: true });
  }

  fs.writeFileSync(
    "data/dora-metrics.json",
    JSON.stringify(metrics, null, 2)
  );

  console.log("Metrics saved to data/dora-metrics.json");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
