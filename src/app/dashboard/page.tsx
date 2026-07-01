/* eslint-disable @next/next/no-img-element */
import { kindlingData as d } from "@/lib/kindling-data";
import { HexLineChart, HexStackedBar } from "./charts";

const fmt = (n: number) => n.toLocaleString("en-US");

/* Ember heat by funnel depth (0..1): cold kindling -> blazing offer.
   Stops are UDS primitives (amber-400 → amber-600 → danger-600/700), kept as
   literals here because the gradient is interpolated numerically in JS. */
function heatRGB(t: number): [number, number, number] {
  const stops: [number, [number, number, number]][] = [
    [0.0, [251, 191, 36]], // amber-400
    [0.4, [245, 158, 11]], // amber-500
    [0.68, [217, 119, 6]], // amber-600
    [0.85, [220, 38, 38]], // danger-600
    [1.0, [185, 28, 28]], // danger-700
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i];
    const [b, cb] = stops[i + 1];
    if (t <= b) {
      const f = (t - a) / (b - a || 1);
      return ca.map((v, k) => Math.round(v + (cb[k] - v) * f)) as [number, number, number];
    }
  }
  return [185, 28, 28];
}
const heat = (t: number) => {
  const [r, g, b] = heatRGB(t);
  return `rgb(${r},${g},${b})`;
};
const heatA = (t: number, a: number) => {
  const [r, g, b] = heatRGB(t);
  return `rgba(${r},${g},${b},${a})`;
};

function Delta({ n }: { n: number }) {
  if (n === 0) return <span className="text-style-body-sm text-on-surface-primary-subtle">→ no change</span>;
  const up = n > 0;
  return (
    <span className="text-style-body-sm-semibold" style={{ color: up ? "var(--palette-success-600)" : "var(--palette-danger-600)" }}>
      {up ? "↑" : "↓"} {Math.abs(n)} vs prev
    </span>
  );
}

export default function DashboardPage() {
  const maxF = Math.max(...d.funnel.map((f) => f.candidatesEntered));
  const offer = d.funnel[d.funnel.length - 1].candidatesEntered;
  const roleTotals = d.roleStages.map((_, si) => d.roles.reduce((s, r) => s + r.byStage[si], 0));
  const maxByCol = d.roleStages.map((_, si) => Math.max(...d.roles.map((r) => r.byStage[si]), 1));

  const fByName = Object.fromEntries(d.funnel.map((f) => [f.stageTitle, f.candidatesEntered]));
  const rate = (a: string, b: string) => (fByName[a] ? (fByName[b] / fByName[a]) * 100 : 0);
  const convRows: [string, string, string][] = [
    ["Reply rate", "Reached Out", "Replied"],
    ["Reply → Onsite", "Replied", "Onsite"],
    ["Onsite → Offer", "Onsite", "Offer"],
  ];

  return (
    <main className="min-h-screen bg-surface-secondary text-on-surface-primary-default">
      {/* top bar */}
      <header className="sticky top-0 z-[50] border-b border-stroke-default bg-surface-secondary/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-7 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-stroke-default bg-surface-tertiary">
              <img src="/kindling-logo.svg" alt="Kindling" width={30} height={33} />
            </div>
            <div>
              <h1 className="text-style-header-md text-on-surface-primary-default">Kindling</h1>
              <p className="text-style-body-caption text-on-surface-primary-subtle">Recruiting Pipeline · Kaizen Labs · from spark to offer</p>
            </div>
          </div>
          <div className="flex-1" />
          <span className="text-style-body-sm inline-flex items-center gap-2 rounded-full border border-stroke-default bg-surface-primary px-3.5 py-2 text-on-surface-primary-default shadow-elevation">
            <span className="size-2 rounded-full" style={{ background: "var(--palette-success-500)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--palette-success-500) 30%, transparent)" }} />
            Live from Ashby
          </span>
          <span className="text-style-body-sm hidden rounded-full bg-surface-inverse px-3.5 py-2 text-on-surface-inverse-subtle sm:inline-block">
            Week of <span className="text-style-body-sm-semibold text-on-surface-inverse-default">{d.weekLabel}</span>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-7 pb-20">
        {/* THIS WEEK */}
        <section className="mt-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-style-body-overline text-on-surface-primary-subtle">
              This Week <span style={{ color: "var(--ember-3)" }}>▲</span>
            </h2>
            <span className="text-style-body-sm text-on-surface-primary-subtle">Stage entries in the last 7 days · vs. previous week</span>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {d.kpis.map((k, i) => (
              <div key={k.stageTitle} className="relative overflow-hidden rounded-2xl border border-stroke-default bg-surface-primary px-4 pb-3.5 pt-4 shadow-elevation transition-transform hover:-translate-y-0.5">
                <span className="absolute inset-y-0 left-0 w-1" style={{ background: heat(i / (d.kpis.length - 1)) }} />
                <div className="text-style-body-code text-on-surface-primary-subtle">{k.stageNo}</div>
                <div className="text-style-display-sm mt-1.5 text-on-surface-primary-default">{fmt(k.candidatesEntered)}</div>
                <div className="text-style-body-sm text-on-surface-primary-subtle">{k.stageTitle}</div>
                <div className="mt-2">
                  <Delta n={k.deltaVsPrevWeek} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FUNNEL */}
        <section className="mt-10">
          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-style-header-sm text-on-surface-primary-default">Building the Fire</h3>
                <p className="text-style-body-sm text-on-surface-primary-subtle">Cumulative candidates by stage · the pipeline gets hotter as it narrows</p>
              </div>
              <span className="text-style-body-sm-semibold rounded-full bg-surface-success px-2.5 py-1 text-on-surface-success">
                {offer} offer{offer === 1 ? "" : "s"} out
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {d.funnel.map((f, i) => {
                const t = i / (d.funnel.length - 1);
                const w = Math.max((f.candidatesEntered / maxF) * 100, 1.5);
                const prev = i === 0 ? null : d.funnel[i - 1].candidatesEntered;
                const conv = prev ? (f.candidatesEntered / prev) * 100 : null;
                return (
                  <div key={f.stageTitle} className="grid grid-cols-[110px_1fr_64px] items-center gap-3.5 md:grid-cols-[150px_1fr_92px]">
                    <div className="text-style-body-sm text-right text-on-surface-primary-default">
                      {f.stageTitle}
                      <span className="text-style-body-code block text-on-surface-primary-subtle">{f.stageNo}</span>
                    </div>
                    <div className="relative h-[30px] rounded-lg bg-surface-tertiary">
                      <div className="h-full rounded-lg" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${heat(t)}, ${heat(Math.min(t + 0.12, 1))})`, boxShadow: "inset 0 -8px 16px rgba(0,0,0,.1)" }} />
                      <span className="text-style-body-sm-semibold absolute top-0 flex h-full items-center" style={w < 14 ? { left: `calc(${w}% + 6px)`, color: "var(--color-on-surface-primary-default)" } : { left: 12, color: "var(--palette-neutral-0)" }}>
                        {fmt(f.candidatesEntered)}
                      </span>
                    </div>
                    <div className="text-style-body-sm text-right tabular-nums text-on-surface-primary-subtle">
                      {conv == null ? "—" : <span className="text-on-surface-primary-default" style={{ fontWeight: 600 }}>{conv >= 100 ? `+${Math.round(conv - 100)}%` : conv < 10 ? `${conv.toFixed(1)}%` : `${Math.round(conv)}%`}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-style-body-caption mt-4 flex items-center gap-2.5 border-t border-dashed border-stroke-default pt-3.5 text-on-surface-primary-subtle">
              <span>Cold kindling</span>
              <span className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(90deg,var(--ember-1),var(--ember-2),var(--ember-3),var(--ember-4),var(--ember-5))" }} />
              <span>Blazing offer</span>
            </div>
          </div>
        </section>

        {/* TREND + SOURCES */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <h3 className="text-style-header-sm text-on-surface-primary-default">Stage Entry Trend</h3>
            <p className="text-style-body-sm mb-4 text-on-surface-primary-subtle">Weekly candidates entering each stage · hover for detail</p>
            <HexLineChart weeks={d.trend.weeks} series={d.trend.series} />
          </div>
          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <h3 className="text-style-header-sm text-on-surface-primary-default">Where Sparks Come From</h3>
            <p className="text-style-body-sm mb-4 text-on-surface-primary-subtle">New candidates by source, weekly · hover for detail</p>
            <HexStackedBar weeks={d.sources.weeks} order={d.sources.order} colors={d.sources.colors} data={d.sources.data} />
          </div>
        </section>

        {/* BY ROLE */}
        <section className="mt-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-style-body-overline text-on-surface-primary-subtle">By Role</h2>
            <span className="text-style-body-sm text-on-surface-primary-subtle">Active pipeline depth per open req</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-style-body-overline border-b-2 border-stroke-default pb-2.5 text-left text-on-surface-primary-subtle">Role</th>
                  {d.roleStages.map((s) => (
                    <th key={s} className="text-style-body-overline border-b-2 border-stroke-default px-2.5 pb-2.5 text-right text-on-surface-primary-subtle">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.roles.map((r) => (
                  <tr key={r.jobTitle} className="border-b border-stroke-default hover:bg-surface-secondary">
                    <td className="text-style-body-sm py-2.5 text-left text-on-surface-primary-default">{r.jobTitle}</td>
                    {r.byStage.map((v, si) => {
                      if (!v) return <td key={si} className="text-style-body-sm px-2.5 py-2.5 text-right text-on-surface-primary-subtle">·</td>;
                      const alphaFrac = Math.min(v / maxByCol[si], 1) * 0.24 + 0.07;
                      return (
                        <td key={si} className="px-2.5 py-2.5 text-right tabular-nums">
                          <span className="text-style-body-sm-semibold inline-block min-w-7 rounded-md px-2 py-0.5 text-on-surface-primary-default" style={{ background: heatA(si / (d.roleStages.length - 1), alphaFrac) }}>
                            {fmt(v)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="text-style-body-sm-semibold border-t-2 border-stroke-emphasis pt-3 text-left text-on-surface-primary-default">Total</td>
                  {roleTotals.map((t, i) => (
                    <td key={i} className="text-style-body-sm-semibold border-t-2 border-stroke-emphasis px-2.5 pt-3 text-right tabular-nums text-on-surface-primary-default">
                      {fmt(t)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* NEXT WEEK / REFERRALS / CONVERSION */}
        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <p className="text-style-body-overline text-on-surface-primary-subtle">Next Week</p>
            <div className="text-style-display-md mt-3 text-on-surface-primary-default">{d.nextWeekInterviews}</div>
            <p className="text-style-body-sm mt-2 text-on-surface-primary-subtle">interviews scheduled — the fire keeps burning</p>
          </div>

          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <p className="text-style-body-overline text-on-surface-primary-subtle">Referrals in Flight</p>
            <div className="mt-2.5">
              {d.referrals.map((r) => (
                <div key={r.label} className="text-style-body-sm flex items-center justify-between border-b border-stroke-default py-2.5 last:border-0">
                  <span className="text-on-surface-primary-default">{r.label}</span>
                  <span>
                    <span className="text-style-body-caption rounded-full bg-surface-tertiary px-2.5 py-0.5 text-on-surface-primary-default">{r.stage}</span>
                    <span className="ml-2 text-on-surface-primary-default" style={{ fontWeight: 600 }}>{r.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stroke-default bg-surface-primary p-6 shadow-elevation">
            <p className="text-style-body-overline text-on-surface-primary-subtle">Conversion Snapshot</p>
            <div className="mt-3">
              {convRows.map(([label, a, b]) => {
                const pct = rate(a, b);
                return (
                  <div key={label} className="text-style-body-sm flex items-center justify-between border-b border-stroke-default py-2.5 last:border-0">
                    <span className="text-on-surface-primary-default">{label}</span>
                    <span className="text-on-surface-primary-default" style={{ fontWeight: 600 }}>{pct < 10 ? pct.toFixed(1) : Math.round(pct)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-11 flex items-center gap-3.5 rounded-2xl bg-surface-inverse px-6 py-4">
          <img src="/kindling-logo.svg" alt="" width={22} height={24} className="shrink-0" />
          <div className="text-style-body-sm text-on-surface-inverse-subtle">
            <span className="text-on-surface-inverse-default" style={{ fontWeight: 600 }}>Fed by Ashby, rendered by Kindling.</span> Every number is driven by a single{" "}
            <span className="text-style-body-code text-on-surface-inverse-default">kindlingData</span> object in{" "}
            <span className="text-style-body-code text-on-surface-inverse-default">src/lib/kindling-data.ts</span> — point it at the Ashby export and the whole board re-renders.
          </div>
        </div>
      </div>
    </main>
  );
}
