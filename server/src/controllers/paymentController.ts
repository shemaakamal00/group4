import type { Request, Response } from "express";
import * as service from "../services/paymentService";

export async function purchase(req: Request, res: Response) {
  const levelId = Number(req.body.subscription_level_id);
  if (!levelId) {
    return res.status(400).json({ error: "subscription_level_id krävs" });
  }

  const { data, error } = await service.purchaseLevel(req.user!.id, levelId);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
}