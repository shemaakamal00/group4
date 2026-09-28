import { useState, type FormEvent } from "react";
import { apiFetch } from "../../lib/api";
import type { Goal, GoalCriteria } from "../../types/goal";

type GoalFormProps = {
  goal?: Goal;
  onSaved: () => void;
  onDeleted?: () => void;
};

type CriteriaDraft = {
  criteria_name: string;
  is_done: boolean;
};

function toDraft(c: GoalCriteria): CriteriaDraft {
  return { criteria_name: c.criteria_name, is_done: c.is_done };
}

function GoalForm({ goal, onSaved, onDeleted }: GoalFormProps) {
  const isEdit = !!goal;

  const [goalName, setGoalName] = useState(goal?.goal_name ?? "");
  const [goalDescription, setGoalDescription] = useState(
    goal?.goal_description ?? "",
  );
  const [criteria, setCriteria] = useState<CriteriaDraft[]>(
    goal?.goal_criteria?.map(toDraft) ?? [],
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addCriterion() {
    setCriteria((prev) => [...prev, { criteria_name: "", is_done: false }]);
  }

  function removeCriterion(index: number) {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCriterionName(index: number, value: string) {
    setCriteria((prev) =>
      prev.map((c, i) => (i === index ? { ...c, criteria_name: value } : c)),
    );
  }

  function toggleCriterion(index: number) {
    setCriteria((prev) =>
      prev.map((c, i) => (i === index ? { ...c, is_done: !c.is_done } : c)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!goalName.trim()) {
      setError("Målnamn krävs");
      return;
    }

    const body = {
      goal_name: goalName.trim(),
      goal_description: goalDescription.trim() || null,
      criteria: criteria
        .map((c) => ({
          criteria_name: c.criteria_name.trim(),
          is_done: c.is_done,
        }))
        .filter((c) => c.criteria_name.length > 0),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await apiFetch(`/api/goals/${goal.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch("/api/goals", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara målet");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!goal) return;
    const confirmed = window.confirm(
      `Är du säker på att du vill radera målet "${goal.goal_name}"? Detta går inte att ångra.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await apiFetch(`/api/goals/${goal.id}`, { method: "DELETE" });
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte radera målet");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <div className="field">
        <label className="label" htmlFor="goal-name">
          Målnamn *
        </label>
        <input
          id="goal-name"
          className="input"
          type="text"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          placeholder="t.ex. Lära mig React"
          required
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="goal-description">
          Beskrivning
        </label>
        <textarea
          id="goal-description"
          className="textarea"
          value={goalDescription}
          onChange={(e) => setGoalDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="field">
        <label className="label">Delkriterier</label>
        <div className="goal-form__criteria">
          {criteria.length === 0 && (
            <p className="faint goal-form__criteria-empty">
              Inga kriterier än — lägg till några för att kunna följa framsteg.
            </p>
          )}
          {criteria.map((c, index) => (
            <div key={index} className="goal-form__criterion">
              <input
                type="checkbox"
                className="goal-form__criterion-toggle"
                checked={c.is_done}
                onChange={() => toggleCriterion(index)}
                aria-label="Klar"
              />
              <input
                type="text"
                className="input goal-form__criterion-input"
                value={c.criteria_name}
                onChange={(e) => updateCriterionName(index, e.target.value)}
                placeholder="Beskriv kriteriet…"
              />
              <button
                type="button"
                className="goal-form__criterion-remove"
                onClick={() => removeCriterion(index)}
                aria-label="Ta bort"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn--secondary goal-form__add-criterion"
            onClick={addCriterion}
          >
            + Lägg till kriterium
          </button>
        </div>
      </div>

      {error && <p className="goal-form__error">{error}</p>}

      <div className="goal-form__actions">
        {isEdit && (
          <button
            type="button"
            className="btn goal-form__delete"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? "Raderar…" : "🗑 Radera"}
          </button>
        )}
        <div className="goal-form__actions-right">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving || deleting}
          >
            {saving ? "Sparar…" : isEdit ? "Spara ändringar" : "Skapa mål"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default GoalForm;
