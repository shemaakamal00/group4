import "dotenv/config";
import cors from "cors";
import express from "express";

import { createClient } from "@supabase/supabase-js";
import { supabase } from "./services/supabase";

//Routes
import applicationRoutes from "./routes/applicationRoutes";
import articleRoutes from "./routes/articleRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", async (_req, res) => {
  const { error, count } = await supabase
    .from("subscription_level")
    .select("*", { count: "exact", head: true });

  if (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
  res.json({ ok: true, message: "Backend fungerar!", levels: count });
});

app.use("/api/applications", applicationRoutes);
app.use("/api/articles", articleRoutes);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server på port ${port}`));
