import { useState, type FormEvent } from "react";
import { apiFetch } from "../../lib/api";
import type { Application } from "../../types/application";

type ApplicationFormProps = {
  application?: Application;
  onSaved: () => void;
  onDeleted?: () => void;
};

const STATUS_OPTIONS = [
  { id: 1, name: "Ansökt" },
  { id: 2, name: "Intervju" },
  { id: 3, name: "Erbjudande" },
  { id: 4, name: "Nej tack" },
];

function ApplicationForm({
  application,
  onSaved,
  onDeleted,
}: ApplicationFormProps) {
  const isEdit = !!application;

  const [title, setTitle] = useState(application?.title ?? "");
  const [company, setCompany] = useState(application?.company ?? "");
  const [link, setLink] = useState(application?.link ?? "");
  const [notes, setNotes] = useState(application?.notes ?? "");
  const [statusId, setStatusId] = useState<number>(
    application?.application_status_id ?? 1,
  );
  const [appliedAt, setAppliedAt] = useState(application?.applied_at ?? "");
  const [responseDate, setResponseDate] = useState(
    application?.response_date ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Titel är obligatoriskt");
      return;
    }

    const body = {
      title: title.trim(),
      company: company.trim() || null,
      link: link.trim() || null,
      notes: notes.trim() || null,
      application_status_id: statusId,
      applied_at: appliedAt || null,
      response_date: responseDate || null,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await apiFetch(`/api/applications/${application.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch("/api/applications", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara ansökan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!application) return;
    const confirmed = window.confirm(
      `Är du säker på att du vill radera ansökan "${application.title}"? Detta går inte att ångra.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await apiFetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
      onDeleted?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunde inte radera ansökan",
      );
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className="field">
        <label className="label" htmlFor="title">
          Titel *
        </label>
        <input
          id="title"
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="t.ex. Frontend-utvecklare"
          required
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="company">
          Företag
        </label>
        <input
          id="company"
          className="input"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="link">
          Länk till annonsen
        </label>
        <input
          id="link"
          className="input"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="select"
          value={statusId}
          onChange={(e) => setStatusId(Number(e.target.value))}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label" htmlFor="applied_at">
          Ansökt datum
        </label>
        <input
          id="applied_at"
          className="input"
          type="date"
          value={appliedAt}
          onChange={(e) => setAppliedAt(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="response_date">
          Svarsdatum
        </label>
        <input
          id="response_date"
          className="input"
          type="date"
          value={responseDate}
          onChange={(e) => setResponseDate(e.target.value)}
        />
      </div>

      <div className="field application-form__notes">
        <label className="label" htmlFor="notes">
          Anteckningar
        </label>
        <textarea
          id="notes"
          className="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {error && <p className="application-form__error">{error}</p>}

      <div className="application-form__actions">
        {isEdit && (
          <button
            type="button"
            className="btn application-form__delete"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? "Raderar…" : "🗑 Radera"}
          </button>
        )}
        <div className="application-form__actions-right">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving || deleting}
          >
            {saving ? "Sparar…" : isEdit ? "Spara ändringar" : "Skapa ansökan"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ApplicationForm;
