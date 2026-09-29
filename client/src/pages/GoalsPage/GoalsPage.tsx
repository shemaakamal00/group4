import { useCallback, useEffect, useState } from "react";
import Modal from "../../components/shared/modal";
import { apiFetch } from "../../lib/api";
import { useUpgradeModal } from "../../context/UpgradeModalContext";
import type { Goal, GoalUsage } from "../../types/goal";
import GoalForm from "./GoalForm";
import "./GoalsPage.css";

function GoalsPage() {
  const { openUpgradeModal } = useUpgradeModal();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [usage, setUsage] = useState<GoalUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>(undefined);

  const loadAll = useCallback(async () => {
    try {
      const [goalsData, usageData] = await Promise.all([
        apiFetch<Goal[]>("/api/goals"),
        apiFetch<GoalUsage>("/api/goals/usage"),
      ]);
      setGoals(goalsData);
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

  const atLimit =
    usage !== null && usage.limit !== null && usage.used >= usage.limit;
  const isLocked = usage !== null && usage.limit === 0;

  function openNewForm() {
    setEditing(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(goal: Goal) {
    setEditing(goal);
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
        <p className="muted">Laddar mål…</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="pill pill--rejected">Kunde inte hämta mål: {error}</p>
      </div>
    );

  return (
    <section className="container goals-page">
      <div className="row between goals-page__head">
        <div>
          <h1>Mål</h1>
          <p className="subtitle">
            Sätt upp mål och bocka av delkriterier på vägen.
          </p>
        </div>
        {!isLocked && (
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
            + Nytt mål
          </button>
        )}
      </div>

      {isLocked ? (
        <div className="card goals-page__locked">
          <h3>🎯 Mål är en Plus/Premium-funktion</h3>
          <p className="muted">
            Med Plus kan du skapa upp till 2 mål och bryta ner dem i
            delkriterier. Med Premium får du obegränsat antal mål.
          </p>
          <p>
            <button type="button" className="link-button" onClick={openUpgradeModal}>
              Uppgradera
            </button>{" "}
            för att komma igång.
          </p>
        </div>
      ) : (
        <>
          {usage && (
            <div className="card usage-banner">
              <p className="usage-banner__text muted">
                {usage.limit === null
                  ? `Du har ${usage.used} mål (${usage.level_name} — obegränsat)`
                  : `Du har använt ${usage.used} av ${usage.limit} mål (${usage.level_name})`}
              </p>
              {atLimit && (
                <p className="usage-banner__upgrade">
                  Du har nått taket.{" "}
                  <button type="button" className="link-button" onClick={openUpgradeModal}>
                    Uppgradera
                  </button>{" "}
                  för att skapa fler mål.
                </p>
              )}
            </div>
          )}

          {goals.length === 0 ? (
            <p className="muted goals-page__empty">
              Du har inga mål än. Klicka på "+ Nytt mål" för att komma igång.
            </p>
          ) : (
            <div className="goals-page__list">
              {goals.map((goal) => {
                const total = goal.goal_criteria.length;
                const done = goal.goal_criteria.filter((c) => c.is_done).length;
                const percent =
                  total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <article
                    key={goal.id}
                    className="card goal-card"
                    onClick={() => openEditForm(goal)}
                  >
                    <h3>{goal.goal_name}</h3>
                    {goal.goal_description && (
                      <p className="muted goal-card__description">
                        {goal.goal_description}
                      </p>
                    )}
                    <div className="goal-card__progress">
                      <div className="progress">
                        <div
                          className="progress__bar progress__bar--rust"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="faint goal-card__progress-label">
                        {done} av {total} kriterier klara ({percent}%)
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? "Redigera mål" : "Nytt mål"}
      >
        <GoalForm
          goal={editing}
          onSaved={handleSaved}
          onDeleted={handleSaved}
        />
      </Modal>
    </section>
  );
}

export default GoalsPage;