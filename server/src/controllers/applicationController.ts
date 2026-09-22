import * as service from "../services/applicationService";
import type { ApplicationInput } from "../types/application";
import type { Request, Response } from "express";

function pickApplicationFields(body: any): Partial<ApplicationInput> {
  const {
    title,
    company,
    link,
    notes,
    application_status_id,
    applied_at,
    status_changed_at,
    response_date,
  } = body;
  return {
    title,
    company,
    link,
    notes,
    application_status_id,
    applied_at,
    status_changed_at,
    response_date,
  };
}

export async function list(req: Request, res: Response) {
  const { data, error } = await service.listApplications(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function getOne(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ error: "id saknas" });
  const { data, error } = await service.getApplication(req.user!.id, id);
  if (error) return res.status(404).json({ error: "Ansökan hittades inte" });
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const fields = pickApplicationFields(req.body);
  if (!fields.title) {
    return res.status(400).json({ error: "title krävs" });
  }
  const { data, error } = await service.createApplication(req.user!.id, {
    ...fields,
    title: fields.title,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

export async function update(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ error: "id saknas" });
  const fields = pickApplicationFields(req.body);
  const { data, error } = await service.updateApplication(
    req.user!.id,
    id,
    fields,
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function remove(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ error: "id saknas" });
  const { error } = await service.deleteApplication(req.user!.id, id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}
