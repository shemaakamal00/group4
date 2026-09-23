import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { apiDownload, apiFetch } from "../../lib/api";
import ApplicationForm from "./ApplicationForm";
import Modal from "../../components/shared/modal";
import type { Application, ApplicationUsage } from "../../types/application";
import "./ApplicationsPage.css";

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

type DraggableCardProps = {
  application: Application;
  onClick: () => void;
};

function DraggableCard({ application, onClick }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: application.id,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`card application-card ${isDragging ? "application-card--dragging" : ""}`}
      onClick={onClick}
    >
      <h3>{application.title}</h3>
      {application.company && (
        <p className="application-card__company muted">{application.company}</p>
      )}
      {formatShortDate(application.applied_at) && (
        <p className="application-card__date faint">
          📅 {formatShortDate(application.applied_at)}
        </p>
      )}
    </article>
  );
}

type DroppableColumnProps = {
  column: StatusColumn;
  items: Application[];
  onCardClick: (app: Application) => void;
};

function DroppableColumn({ column, items, onCardClick }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { statusId: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "kanban-column--over" : ""}`}
    >
      <div className={`pill ${column.pillClass} kanban-column__header`}>
        <span>{column.name}</span>
        <span>{items.length}</span>
      </div>
      <div className="kanban-column__cards">
        {items.map((app) => (
          <DraggableCard
            key={app.id}
            application={app}
            onClick={() => onCardClick(app)}
          />
        ))}
      </div>
    </div>
  );
}

function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [usage, setUsage] = useState<ApplicationUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

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

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter(
      (app) =>
        app.title.toLowerCase().includes(query) ||
        (app.company?.toLowerCase() ?? "").includes(query),
    );
  }, [applications, search]);

  const applicationsByStatus = useMemo(() => {
    const grouped = new Map<number, Application[]>();
    for (const column of STATUS_COLUMNS) grouped.set(column.id, []);
    for (const app of filteredApplications) {
      const list = grouped.get(app.application_status_id);
      if (list) list.push(app);
    }
    return grouped;
  }, [filteredApplications]);

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const applicationId = String(active.id);
    const newStatusId = over.data.current?.statusId as number | undefined;
    if (!newStatusId) return;

    const app = applications.find((a) => a.id === applicationId);
    if (!app || app.application_status_id === newStatusId) return;

    const oldStatusId = app.application_status_id;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, application_status_id: newStatusId }
          : a,
      ),
    );

    try {
      await apiFetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify({ application_status_id: newStatusId }),
      });
    } catch (err) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? { ...a, application_status_id: oldStatusId }
            : a,
        ),
      );
      alert(
        "Kunde inte uppdatera status: " +
          (err instanceof Error ? err.message : ""),
      );
    }
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

  async function handleExport(format: "csv" | "pdf") {
    try {
      await apiDownload(`/api/applications/export?format=${format}`);
    } catch (err) {
      alert(
        "Kunde inte exportera: " + (err instanceof Error ? err.message : ""),
      );
    }
  }

  return (
    <section className="container applications-page">
      <div className="row between applications-page__head">
        <div>
          <h1>Ansökningar</h1>
          <p className="subtitle">
            Dra korten mellan kolumnerna eller klicka för att redigera.
          </p>
        </div>
        <div className="applications-page__actions">
          <input
            type="search"
            className="input applications-page__search"
            placeholder="🔍 Sök titel eller företag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {usage && usage.access_level >= 2 && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleExport("csv")}
            >
              ⬇ CSV
            </button>
          )}
          {usage && usage.access_level >= 3 && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleExport("pdf")}
            >
              ⬇ PDF
            </button>
          )}
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

      {search && filteredApplications.length === 0 && (
        <p className="muted applications-page__no-results">
          Inga ansökningar matchar "{search}".
        </p>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-4">
          {STATUS_COLUMNS.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              items={applicationsByStatus.get(column.id) ?? []}
              onCardClick={openEditForm}
            />
          ))}
        </div>
      </DndContext>

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? "Redigera ansökan" : "Ny ansökan"}
      >
        <ApplicationForm
          application={editing}
          onSaved={handleSaved}
          onDeleted={handleSaved}
        />
      </Modal>
    </section>
  );
}

export default ApplicationsPage;
