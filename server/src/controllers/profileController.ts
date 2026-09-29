import type {Request, Response} from "express";
import * as service from "../services/profileService";

export async function getMe(req: Request, res: Response){
  const {data, error} = await service.getProfile(req.user!.id);

  if(error || !data){
    return res.status(404).json({
      error: 'Profilen kunde inte hittas',
    });
  }

  res.status(200).json(data);
};