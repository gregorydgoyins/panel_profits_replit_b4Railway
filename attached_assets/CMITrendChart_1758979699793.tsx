import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type Point = {
  date: string;       // ISO date
  cmi: number;        // CMI index level
  c20: number;        // Top-20 index level
  volume?: number;    // optional volume
};

type RangeKey = "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

export interface CMITrendChartProps {
  title?: string;
  data?: Point[];      // pass your own data if you have it
  height?: number;     // default 360
  showVolume?: boolean;// default true
  currency?: boolean;  // format as currency instead of index pts
}

// -------- utilities --------
const fmtNum = (n: number, currency = false) =>
  currency
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : n.toLocaleString(undefined, { maximumFractionDigits: 0 });

const fmtPct = (n: number) =>
  (n >= 0 ? "+" : "") + (n * 100).toFixed(2) + "%";

const dateToLabel = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
};

// sample data generator (only used if props.data is absent)
function generateSample(years = 5): Point[] {
  const days = Math.round(years * 365);
  const start = new Date();
  start.setDate(start.getDate() - days);

  let cmi = 1000;
  let c20 = 1000;
  const out: Point[] = [];

  for (let i = 0; i <= days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    // simple random walk with light seasonality
    const season = Math.sin((i / 365) * Math.PI * 2) * 0.002;
    cmi *= 1 + (Math.random() - 0.5) * 0.006 + season;
    c20 *= 1 + (Math.random() - 0.5) * 0.007 + season * 1.2;

    const volume = 500000 + Math.round(Math.random() * 600000);

    out.push({
      date: d.toISOString().slice(0, 10),
      cmi: Math.max(100, cmi),
      c20: Math.max(100, c20),
      volume,
    });
  }
  return out;
}

export default function CMITrendChart({
  title = "CMI & Top-20 Index",
  data,
  height = 360,
  showVolume = true,
  currency = false,
}: CMITrendChartProps) {
  const chartId = React.useId();
  const allData = React.useMemo(() => (data?.length ? data : generateSample(5)), [data]);

  const [range, setRange] = React.useState<RangeKey>("1Y");
  const [show, setShow] = React.useState({ cmi: true, c20: true, volume: showVolume });

  const ranged = React.useMemo(() => {
    if (range === "MAX") return allData;
    const last = new Date(allData[allData.length - 1].date);
    const from = new Date(last);
    const months =
      range === "1M" ? 1 : range === "3M" ? 3 : range === "6M" ? 6 : range === "1Y" ? 12 : 60;
    from.setMonth(from.getMonth() - months);
    return allData.filter((p) => new Date(p.date) >= from);
  }, [allData, range]);

  const kpi = React.useMemo(() => {
    if (!ranged.length) return null;
    const first = ranged[0];
    const last = ranged[ranged.length - 1];
    const change = (last.cmi - first.cmi) / first.cmi;
    const change20 = (last.c20 - first.c20) / first.c20;
    return {
      cmiNow: last.cmi,
      c20Now: last.c20,
      cmiDelta: change,
      c20Delta: change20,
    };
  }, [ranged]);

  // custom legend toggles
  const handleLegendClick = (o: any) => {
    const key = o?.dataKey as keyof typeof show;
    setShow((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="w-full">
      {/* Header + KPIs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-white/60">Simulated market behavior of the CBSE universe</p>
        </div>
        {kpi && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/60">CMI</div>
              <div className="text-base font-semibold">{fmtNum(kpi.cmiNow, currency)}</div>
              <div className={`text-xs ${kpi.cmiDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {fmtPct(kpi.cmiDelta)}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/60">Top-20 (C20)</div>
              <div className="text-base font-semibold">{fmtNum(kpi.c20Now, currency)}</div>
              <div className={`text-xs ${kpi.c20Delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {fmtPct(kpi.c20Delta)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Range Filters */}
      <div className="flex items-center gap-1 mb-3">
        {(["1M", "3M", "6M", "1Y", "5Y", "MAX"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              "px-2.5 py-1.5 rounded-lg text-xs border transition",
              range === r
                ? "bg-white/15 border-white/20"
                : "bg-white/5 hover:bg-white/10 border-white/10",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[--chart-h]" style={{ ["--chart-h" as any]: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={ranged} margin={{ top: 8, right: 12, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id={`${chartId}-cmi`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id={`${chartId}-c20`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={dateToLabel}
              minTickGap={28}
              stroke="rgba(255,255,255,0.45)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => fmtNum(v, currency)}
              stroke="rgba(255,255,255,0.45)"
              tick={{ fontSize: 12 }}
              width={60}
            />
            {show.volume && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0.35)"
                tick={{ fontSize: 11 }}
                width={40}
              />
            )}

            <Tooltip
              contentStyle={{
                background: "rgba(13,18,28,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
              }}
              labelFormatter={(l) => dateToLabel(String(l))}
              formatter={(value: any, name: any) => {
                if (name === "volume") return [value.toLocaleString(), "Volume"];
                const v = Number(value);
                return [fmtNum(v, currency), name === "cmi" ? "CMI" : "C20"];
              }}
            />

            <Legend
              onClick={handleLegendClick}
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value) => (value === "cmi" ? "CMI" : value === "c20" ? "C20" : "Volume")}
            />

            {show.volume && (
              <Bar
                yAxisId="right"
                dataKey="volume"
                name="volume"
                opacity={0.5}
                barSize={16}
              />
            )}

            {show.cmi && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cmi"
                name="cmi"
                stroke="#22c55e"
                strokeWidth={2}
                fill={`url(#${chartId}-cmi)`}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}

            {show.c20 && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="c20"
                name="c20"
                stroke="#60a5fa"
                strokeWidth={2}
                fill={`url(#${chartId}-c20)`}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

