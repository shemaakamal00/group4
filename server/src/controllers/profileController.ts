import type { Request, Response } from "express";
import * as service from "../services/profileService";

export async function getMe(req: Request, res: Response) {
  const { data, error } = await service.getProfile(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function updateMe(req: Request, res: Response) {
  const firstName = typeof req.body.first_name === "string" ? req.body.first_name.trim() : "";
  const lastName = typeof req.body.last_name === "string" ? req.body.last_name.trim() : "";
  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Förnamn och efternamn krävs" });
  }

  const { data, error } = await service.updateProfile(req.user!.id, {
    first_name: firstName,
    last_name: lastName,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}