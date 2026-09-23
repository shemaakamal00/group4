import { apiFetch } from "../../lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import ApplicationForm from "./ApplicationForm";
import Modal from "../../components/shared/modal";
import type { Application, ApplicationUsage } from "../../types/application";

type StatusColumn = {
  id: number;
  name: string;
  pillClass: string;
};

const STATUS_COLUMNS: StatusColumn[] = [
  { id: 1, name: "Ansökt", pillClass: "pill--applied" },
  { id: 2, name: "Intervju", pillClass: "pill--interview" },
  { id: 3, name: "Erbjudande", pillClass: "pill--offer" },
  { id: 4, name: "Nej tack", pillClass: "pill--rejected" },
];

function formatShortDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [usage, setUsage] = useState<ApplicationUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);

  const loadAll = useCallback(async () => {
    try {
      const [apps, usageData] = await Promise.all([
        apiFetch<Application[]>("/api/applications"),
        apiFetch<ApplicationUsage>("/api/applications/usage"),
      ]);
      setApplications(apps);
      setUsage(usageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const applicationsByStatus = useMemo(() => {
    const grouped = new Map<number, Application[]>();
    for (const column of STATUS_COLUMNS) grouped.set(column.id, []);
    for (const app of applications) {
      const list = grouped.get(app.application_status_id);
      if (list) list.push(app);
    }
    return grouped;
  }, [applications]);

  const atLimit =
    usage !== null && usage.limit !== null && usage.used >= usage.limit;

  function openNewForm() {
    setEditing(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(app: Application) {
    setEditing(app);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditing(undefined);
  }

  async function handleSaved() {
    closeForm();
    await loadAll();
  }

  if (loading)
    return (
      <div className="container">
        <p className="muted">Laddar ansökningar…</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="pill pill--rejected">
          Kunde inte hämta ansökningar: {error}
        </p>
      </div>
    );

  return (
    <section className="container applications-page">
      <div className="row between applications-page__head">
        <div>
          <h1>Ansökningar</h1>
          <p className="subtitle">
            Klicka på ett kort för att redigera eller lägg till nya.
          </p>
        </div>
        <div className="applications-page__actions">
          <button type="button" className="btn btn--secondary">
            🔍 Sök
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={atLimit}
            onClick={openNewForm}
            title={
              atLimit
                ? "Du har nått taket — uppgradera för att skapa fler"
                : undefined
            }
          >
            + Ny ansökan
          </button>
        </div>
      </div>

      {usage && (
        <div className="card usage-banner">
          <p className="usage-banner__text muted">
            {usage.limit === null
              ? `Du har ${usage.used} ansökningar (${usage.level_name} — obegränsat)`
              : `Du har använt ${usage.used} av ${usage.limit} ansökningar (${usage.level_name})`}
          </p>
          {atLimit && (
            <p className="usage-banner__upgrade">
              Du har nått taket. <a href="/uppgradera">Uppgradera</a> för att
              skapa fler ansökningar.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-4">
        {STATUS_COLUMNS.map((column) => {
          const items = applicationsByStatus.get(column.id) ?? [];
          return (
            <div key={column.id} className="kanban-column">
              <div className={`pill ${column.pillClass} kanban-column__header`}>
                <span>{column.name}</span>
                <span>{items.length}</span>
              </div>
              <div className="kanban-column__cards">
                {items.map((app) => (
                  <article
                    key={app.id}
                    className="card application-card"
                    onClick={() => openEditForm(app)}
                  >
                    <h3>{app.title}</h3>
                    {app.company && (
                      <p className="application-card__company muted">
                        {app.company}
                      </p>
                    )}
                    {formatShortDate(app.applied_at) && (
                      <p className="application-card__date faint">
                        📅 {formatShortDate(app.applied_at)}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? "Redigera ansökan" : "Ny ansökan"}
      >
        <ApplicationForm
          application={editing}
          onSaved={handleSaved}
          onCancel={closeForm}
        />
      </Modal>
    </section>
  );
}

export default ApplicationsPage;
