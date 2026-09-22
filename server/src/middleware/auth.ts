import { createClient } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import type { Request, Response, NextFunction } from "express";

// Verifierar token och lägger användaren på req.user
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ error: "Ingen token skickades med" });
  }
  const token = authHeader.slice(7); // för att klippa bort "Bearer"

  // Kontroll om token är giltig samt vem den tillhör
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Ogiltig eller utgången token " });
  }

  // En join mot subscription_level för att hämta profilen + access_level
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("id, role, level_id, subscription_level(access_level)")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return res.status(401).json({ error: "Hittade ingen profil" });
  }

  // subscription_level kan komma som objekt eller array beroende på typning
  const level = Array.isArray(profile.subscription_level)
    ? profile.subscription_level[0]
    : profile.subscription_level;

  req.user = {
    id: profile.id,
    role: profile.role,
    level_id: profile.level_id,
    acces_level: level.access_level,
  };
  next();
}

// Kontroll gällande nivå. Körs efter requireAuth
export function requireLevel(minLevel: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Ej inloggad" });
    }
    if (req.user.acces_level < minLevel) {
      return res.status(403).json({
        error: "Din nivå räcker inte för den här sidan",
        requireLevel: minLevel,
      });
    }
    next();
  };
}

// För admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Ej inloggad" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Du har inte admin behörighet" });
  }
  next();
}