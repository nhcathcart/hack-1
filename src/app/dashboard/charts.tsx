"use client";

/**
 * Hex-style charts, hand-rolled in SVG (zero chart deps).
 * Mimics the Hex chart cell: muted gridlines, right-side legend with
 * color swatches, and a hover tooltip that lists every series at the
 * hovered week — the same interaction as the Hex dashboard.
 *
 * All chrome colors resolve through UDS tokens (--color-stroke-default,
 * --color-on-surface-*, --color-surface-primary, --palette-*), so the charts
 * inherit Canopy's ramps and flip with the .dark class.
 */

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

const fmt = (n: number) => n.toLocaleString("en-US");

// UDS token references used inside SVG attributes / inline styles.
const C = {
  grid: "var(--color-stroke-default)",
  tick: "var(--color-on-surface-primary-subtle)",
  ink: "var(--color-on-surface-primary-default)",
  emphasis: "var(--palette-neutral-850)",
  mono: "var(--font-code)",
};

function useMeasure() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

const PAD = { t: 14, r: 14, b: 28, l: 46 };
const H = 264;

function Legend({ items }: { items: { key: string; color: string }[] }) {
  return (
    <div className="flex w-36 shrink-0 flex-col gap-2.5 pl-3 pt-1">
      {items.map((it) => (
        <span key={it.key} className="text-style-body-caption flex items-center gap-2 text-on-surface-primary-subtle">
          <i className="size-2.5 shrink-0 rounded-xs" style={{ background: it.color }} />
          <span className="text-on-surface-primary-default">{it.key}</span>
        </span>
      ))}
    </div>
  );
}

function Tooltip({
  x,
  weekLabel,
  rows,
  plotWidth,
}: {
  x: number;
  weekLabel: string;
  rows: { key: string; color: string; value: number | null }[];
  plotWidth: number;
}) {
  const flip = x > plotWidth - 180;
  return (
    <div
      className="pointer-events-none absolute z-[10] min-w-40 rounded-lg border border-stroke-default bg-surface-primary px-3 py-2 shadow-elevation"
      style={{ left: x, top: 8, transform: `translateX(${flip ? "calc(-100% - 14px)" : "14px"})` }}
    >
      <div className="text-style-body-code mb-1.5 border-b border-stroke-default pb-1 text-on-surface-primary-subtle uppercase">
        {weekLabel}
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((r) => (
          <div key={r.key} className="text-style-body-sm flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-on-surface-primary-default">
              <i className="size-2 rounded-xs" style={{ background: r.color }} />
              {r.key}
            </span>
            <span className="tabular-nums text-on-surface-primary-default" style={{ fontWeight: 600 }}>
              {r.value == null ? "—" : fmt(r.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Line chart ----------------------------- */
export function HexLineChart({
  weeks,
  series,
}: {
  weeks: string[];
  series: { key: string; color: string; data: number[] }[];
}) {
  const { ref, width } = useMeasure();
  const [hover, setHover] = useState<number | null>(null);

  const plotW = Math.max(width - 144, 220);
  const innerW = plotW - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const maxY = Math.max(...series.flatMap((s) => s.data), 1) * 1.1;
  const stepX = innerW / Math.max(weeks.length - 1, 1);
  const xFor = (i: number) => PAD.l + i * stepX;
  const yFor = (v: number) => PAD.t + (1 - v / maxY) * innerH;
  const ticks = 4;

  function onMove(e: MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left) / stepX);
    setHover(Math.min(Math.max(i, 0), weeks.length - 1));
  }

  return (
    <div className="flex items-start">
      <div ref={ref} className="relative flex-1">
        <svg width={plotW} height={H} className="block overflow-visible">
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const v = (maxY * i) / ticks;
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={PAD.l} y1={y} x2={plotW - PAD.r} y2={y} stroke={C.grid} strokeWidth={1} />
                <text x={PAD.l - 8} y={y + 3} textAnchor="end" fill={C.tick} fontFamily={C.mono} fontSize={10}>
                  {Math.round(v)}
                </text>
              </g>
            );
          })}
          {weeks.map((w, i) => (
            <text key={w} x={xFor(i)} y={H - 9} textAnchor="middle" fill={C.tick} fontFamily={C.mono} fontSize={10}>
              {w}
            </text>
          ))}
          {hover != null && (
            <line x1={xFor(hover)} y1={PAD.t} x2={xFor(hover)} y2={H - PAD.b} stroke={C.emphasis} strokeWidth={1} strokeDasharray="3 3" opacity={0.35} />
          )}
          {series.map((s) => (
            <polyline
              key={s.key}
              points={s.data.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2.4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {series.map((s) =>
            s.data.map((v, i) => (
              <circle key={s.key + i} cx={xFor(i)} cy={yFor(v)} r={hover === i ? 4 : 2.6} fill={s.color} stroke="var(--color-surface-primary)" strokeWidth={hover === i ? 1.5 : 0} />
            ))
          )}
          <rect x={PAD.l} y={PAD.t} width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
        </svg>
        {hover != null && (
          <Tooltip x={xFor(hover)} plotWidth={plotW} weekLabel={weeks[hover]} rows={series.map((s) => ({ key: s.key, color: s.color, value: s.data[hover] ?? null }))} />
        )}
      </div>
      <Legend items={series} />
    </div>
  );
}

/* -------------------------- Stacked bar chart -------------------------- */
export function HexStackedBar({
  weeks,
  order,
  colors,
  data,
}: {
  weeks: string[];
  order: string[];
  colors: Record<string, string>;
  data: Record<string, number[]>;
}) {
  const { ref, width } = useMeasure();
  const [hover, setHover] = useState<number | null>(null);

  const plotW = Math.max(width - 144, 220);
  const innerW = plotW - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const totals = weeks.map((_, i) => order.reduce((s, k) => s + (data[k]?.[i] ?? 0), 0));
  const maxY = Math.max(...totals, 1) * 1.08;
  const band = innerW / weeks.length;
  const barW = band * 0.56;
  const yFor = (v: number) => PAD.t + (1 - v / maxY) * innerH;
  const cxFor = (i: number) => PAD.l + band * i + band / 2;
  const ticks = 4;

  return (
    <div className="flex items-start">
      <div ref={ref} className="relative flex-1">
        <svg width={plotW} height={H} className="block overflow-visible">
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const v = (maxY * i) / ticks;
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={PAD.l} y1={y} x2={plotW - PAD.r} y2={y} stroke={C.grid} strokeWidth={1} />
                <text x={PAD.l - 8} y={y + 3} textAnchor="end" fill={C.tick} fontFamily={C.mono} fontSize={10}>
                  {Math.round(v)}
                </text>
              </g>
            );
          })}
          {weeks.map((w, i) => {
            const cx = cxFor(i);
            let acc = 0;
            const active = hover === i;
            return (
              <g key={w} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={cx - band / 2} y={PAD.t} width={band} height={innerH} fill={C.emphasis} opacity={active ? 0.04 : 0} />
                {order.map((k) => {
                  const v = data[k]?.[i] ?? 0;
                  if (!v) return null;
                  const y0 = yFor(acc);
                  const y1 = yFor(acc + v);
                  acc += v;
                  return <rect key={k} x={cx - barW / 2} y={y1} width={barW} height={Math.max(y0 - y1, 0)} fill={colors[k]} rx={1.5} />;
                })}
                <text x={cx} y={yFor(totals[i]) - 6} textAnchor="middle" fill={C.ink} fontFamily={C.mono} fontSize={10} fontWeight={600}>
                  {fmt(totals[i])}
                </text>
                <text x={cx} y={H - 9} textAnchor="middle" fill={C.tick} fontFamily={C.mono} fontSize={10}>
                  {w}
                </text>
              </g>
            );
          })}
        </svg>
        {hover != null && (
          <Tooltip
            x={cxFor(hover)}
            plotWidth={plotW}
            weekLabel={weeks[hover]}
            rows={[...order.map((k) => ({ key: k, color: colors[k], value: data[k]?.[hover] ?? 0 })), { key: "Total", color: C.emphasis, value: totals[hover] }]}
          />
        )}
      </div>
      <Legend items={order.map((k) => ({ key: k, color: colors[k] }))} />
    </div>
  );
}
