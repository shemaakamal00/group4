import type { Request, Response } from "express";
import * as service from "../services/goalService";
import type { GoalInput } from "../types/goal";

function pickGoalFields(body: any): GoalInput {
  return {
    goal_name: body.goal_name ?? "",
    goal_description: body.goal_description ?? null,
    criteria: Array.isArray(body.criteria)
      ? body.criteria
          .map((c: any) => ({
            criteria_name: String(c.criteria_name ?? "").trim(),
            is_done: Boolean(c.is_done),
          }))
          .filter((c: any) => c.criteria_name.length > 0)
      : [],
  };
}

export async function list(req: Request, res: Response) {
  const { data, error } = await service.listGoals(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function getUsage(req: Request, res: Response) {
  const { data, error } = await service.getGoalUsage(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const fields = pickGoalFields(req.body);
  if (!fields.goal_name.trim()) {
    return res.status(400).json({ error: "goal_name krävs" });
  }

  const { data: usage, error: usageError } = await service.getGoalUsage(
    req.user!.id,
  );
  if (usageError) return res.status(500).json({ error: usageError.message });
  if (usage && usage.limit !== null && usage.used >= usage.limit) {
    return res.status(403).json({
      error:
        usage.limit === 0
          ? `Mål är en Plus/Premium funktion. Uppgradera för att skapa mål.`
          : `Du har nått taket för ${usage.level_name} (${usage.limit} mål). Uppgradera för att skapa fler.`,
    });
  }
  const { data, error } = await service.createGoal(req.user!.id, fields);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

export async function update(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ error: "id_saknas" });
  const fields = pickGoalFields(req.body);
  if (!fields.goal_name.trim()) {
    return res.status(400).json({ error: "goal_name krävs" });
  }
  const { data, error } = await service.updateGoal(req.user!.id, id, fields);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function remove(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ error: "id saknas" });
  const { error } = await service.deleteGoal(req.user!.id, id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}
