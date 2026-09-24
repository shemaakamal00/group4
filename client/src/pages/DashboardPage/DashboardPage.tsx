import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiFetch } from "../../lib/api";
import type { ApplicationStats } from "../../types/application";
import "./DashboardPage.css";

const CHART_MARGIN = { top: 12, right: 12, bottom: 0, left: -12 } as const;
const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];
const AXIS_TICK = { className: "dashboard-page__chart-tick" } as const;

function formatMonth(iso: string): string {
  const [year, month] = iso.split("-");
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ];
  return `${monthNames[Number(month) - 1]} ${year.slice(2)}`;
}

function DashboardPage() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<ApplicationStats>(
          "/api/applications/stats",
        );
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Något gick fel");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="container">
        <p className="muted"> Laddar statistik...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="pill pill--rejected">
          Kunde inte hämta statistik: {error}
        </p>
      </div>
    );
  if (!stats) return null;

  const chartData =
    stats.applications_per_month?.map((m) => ({
      name: formatMonth(m.month),
      ansökningar: m.count,
    })) ?? [];

  return (
    <section className="container dashboard-page">
      <div className="dashboard-page__head">
        <h1>Översikt</h1>
        <p className="subtitle">Din statistik för {stats.level_name}.</p>
      </div>

      {/* Nivå 1+: Räknare per status */}
      <div className="dashboard-page__stats">
        <div className="stat">
          <p className="stat__label">Totalt</p>
          <p className="stat__value">{stats.total}</p>
        </div>
        {stats.counts_by_status.map((s) => (
          <div key={s.status_id} className="stat">
            <p className="stat__label">{s.status_name}</p>
            <p className="stat__value">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Nivå 2+: Diagram */}
      {stats.applications_per_month ? (
        <div className="card dashboard-page__chart">
          <h3>Ansökningar per månad</h3>
          {chartData.length === 0 ? (
            <p className="muted">Inga ansökningar än att visa i diagrammet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tick={AXIS_TICK}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="var(--text-muted)"
                  tick={AXIS_TICK}
                />
                <Tooltip wrapperClassName="dashboard-page__tooltip" />
                <Bar
                  dataKey="ansökningar"
                  fill="var(--orange)"
                  radius={BAR_RADIUS}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="card dashboard-page__locked">
          <h3>📊 Diagram över tid</h3>
          <p className="muted">
            Se hur dina ansökningar utvecklas över tid med ett diagram.
          </p>
          <p>
            <a href="/uppgradera">Uppgradera till Plus</a> för att låsa upp
            diagram.
          </p>
        </div>
      )}

      {/* Nivå 3+: insikter */}
      {stats.insights ? (
        <div className="grid grid-2 dashboard-page__insights">
          <div className="stat">
            <p className="stat__label">Svarsfrekvens</p>
            <p className="stat__value">{stats.insights.response_rate}%</p>
            <p className="stat__delta">av dina ansökningar har fått svar</p>
          </div>
          <div className="stat">
            <p className="stat__label">Snitt-tid till svar</p>
            <p className="stat__value">
              {stats.insights.average_days_to_response === null
                ? "—"
                : `${stats.insights.average_days_to_response} dagar`}
            </p>
            <p className="stat__delta">från ansökt till första svar</p>
          </div>
        </div>
      ) : (
        <div className="card dashboard-page__locked">
          <h3>💡 Insikter</h3>
          <p className="muted">
            Se svarsfrekvens och snitt-tid till svar för att förstå dina
            ansökningsvanor.
          </p>
          <p>
            <a href="/uppgradera">Uppgradera till Premium</a> för att låsa upp
            insikter.
          </p>
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
