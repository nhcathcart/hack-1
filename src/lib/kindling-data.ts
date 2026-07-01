/**
 * KINDLING — data contract
 * ------------------------------------------------------------------
 * This is the ONLY file wired to source data. Field names map 1:1 to
 * the Hex / Ashby columns:
 *   STAGE_TITLE -> stageTitle   CANDIDATES_ENTERED -> candidatesEntered
 *   WEEK_START  -> weekStart    JOB_TITLE          -> jobTitle
 *   SOURCE_TITLE -> sourceTitle
 * When the teammate's fake dataset lands in Hex, replace `kindlingData`
 * with a transform of that export — the whole dashboard re-renders.
 */

export type StageMetric = {
  stageNo: string;
  stageTitle: string;
  candidatesEntered: number;
  deltaVsPrevWeek: number;
};

export type TrendSeries = {
  key: string;
  color: string; // css var or hex
  data: number[]; // aligned to trend.weeks
};

export type SourceKey = string;

export type RoleRow = {
  jobTitle: string;
  byStage: number[]; // aligned to roleStages
};

export type Referral = {
  label: string;
  stage: string;
  count: number;
};

export type DashboardData = {
  weekLabel: string;
  kpis: StageMetric[];
  funnel: StageMetric[];
  trend: { weeks: string[]; series: TrendSeries[] };
  sources: {
    weeks: string[];
    order: SourceKey[];
    colors: Record<SourceKey, string>;
    data: Record<SourceKey, number[]>;
  };
  roleStages: string[];
  roles: RoleRow[];
  nextWeekInterviews: number;
  referrals: Referral[];
};

/* ------------------------------------------------------------------
   PLACEHOLDER DATA — reconstructed from the Hex screenshots.
   Swap for the teammate's fake Ashby export when available.
   ------------------------------------------------------------------ */
export const kindlingData: DashboardData = {
  weekLabel: "Jun 23–29, 2026",

  kpis: [
    { stageNo: "01", stageTitle: "Reached Out", candidatesEntered: 46, deltaVsPrevWeek: -198 },
    { stageNo: "02", stageTitle: "Replied", candidatesEntered: 10, deltaVsPrevWeek: -41 },
    { stageNo: "05", stageTitle: "RPS", candidatesEntered: 31, deltaVsPrevWeek: -17 },
    { stageNo: "07", stageTitle: "Onsite", candidatesEntered: 13, deltaVsPrevWeek: 3 },
    { stageNo: "10", stageTitle: "Offer", candidatesEntered: 1, deltaVsPrevWeek: 0 },
  ],

  funnel: [
    { stageNo: "01", stageTitle: "Reached Out", candidatesEntered: 2589, deltaVsPrevWeek: 0 },
    { stageNo: "02", stageTitle: "Replied", candidatesEntered: 232, deltaVsPrevWeek: 0 },
    { stageNo: "03", stageTitle: "Lead RPS", candidatesEntered: 10, deltaVsPrevWeek: 0 },
    { stageNo: "04", stageTitle: "Portfolio Review", candidatesEntered: 6, deltaVsPrevWeek: 0 },
    { stageNo: "05", stageTitle: "RPS", candidatesEntered: 58, deltaVsPrevWeek: 0 },
    { stageNo: "06", stageTitle: "Deep Dive", candidatesEntered: 13, deltaVsPrevWeek: 0 },
    { stageNo: "07", stageTitle: "Onsite", candidatesEntered: 23, deltaVsPrevWeek: 0 },
    { stageNo: "08", stageTitle: "Founders Chat", candidatesEntered: 8, deltaVsPrevWeek: 0 },
    { stageNo: "09", stageTitle: "References", candidatesEntered: 3, deltaVsPrevWeek: 0 },
    { stageNo: "10", stageTitle: "Offer", candidatesEntered: 1, deltaVsPrevWeek: 0 },
  ],

  // Chart colors reference UDS primitives (defined at :root by the UDS layer),
  // so they inherit Canopy's ramps and flip with .dark.
  trend: {
    weeks: ["May 17", "May 24", "Jun 01", "Jun 07", "Jun 14", "Jun 21"],
    series: [
      { key: "Reached Out", color: "var(--palette-blue-600)", data: [810, 485, 728, 108, 244, 140] },
      { key: "Replied", color: "var(--palette-amber-500)", data: [35, 40, 55, 78, 51, 38] },
      { key: "RPS", color: "var(--palette-danger-600)", data: [12, 20, 40, 62, 48, 45] },
      { key: "Onsite", color: "var(--palette-sky-600)", data: [5, 4, 6, 8, 10, 9] },
    ],
  },

  sources: {
    weeks: ["May 17", "May 24", "Jun 01", "Jun 07", "Jun 14", "Jun 21"],
    order: ["Juicebox", "Direct Application", "LinkedIn", "Job Boards", "Other", "Referral"],
    colors: {
      Juicebox: "var(--palette-blue-700)",
      "Direct Application": "var(--palette-neutral-400)",
      LinkedIn: "var(--palette-blue-500)",
      "Job Boards": "var(--palette-danger-600)",
      Other: "var(--palette-warm-neutral-300)",
      Referral: "var(--palette-amber-500)",
    },
    data: {
      Juicebox: [742, 181, 373, 252, 103, 20],
      "Direct Application": [153, 393, 263, 439, 206, 174],
      LinkedIn: [348, 259, 379, 97, 65, 49],
      "Job Boards": [26, 140, 122, 116, 15, 8],
      Other: [4, 150, 4, 12, 5, 3],
      Referral: [6, 22, 4, 3, 2, 2],
    },
  },

  roleStages: ["Reached Out", "Replied", "RPS", "Deep Dive", "Onsite", "Offer"],
  roles: [
    { jobTitle: "Senior Software Engineer, Product", byStage: [319, 67, 13, 0, 0, 0] },
    { jobTitle: "Senior Product Designer", byStage: [272, 0, 5, 8, 6, 1] },
    { jobTitle: "Forward Deployed Software Engineer", byStage: [172, 0, 0, 0, 0, 0] },
    { jobTitle: "Chief Technology Officer", byStage: [160, 22, 4, 0, 2, 0] },
    { jobTitle: "Senior Security Engineer", byStage: [98, 23, 11, 0, 2, 0] },
    { jobTitle: "People Operations Manager", byStage: [0, 64, 6, 2, 1, 0] },
    { jobTitle: "Business Operations Manager", byStage: [327, 1, 0, 0, 0, 0] },
    { jobTitle: "Head of Brand & Storytelling", byStage: [0, 0, 1, 1, 2, 0] },
  ],

  nextWeekInterviews: 24,

  referrals: [
    { label: "Direct referrals", stage: "In review", count: 0 },
    { label: "From referral links", stage: "Sourced", count: 0 },
  ],
};
