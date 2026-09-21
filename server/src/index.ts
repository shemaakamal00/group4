import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const app = express ();
app.use(express.json());

app.use(cors());

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

app.get("/api/health", async (_req, res) => {
    const { error, count } = await supabase
    .from ("subscription_level")
    .select ("*", { count: "exact", head: true });

    if (error) {
        return res.status(500).json ({ok: false, error: error.message });
    }
    res.json({ ok: true, message: "Backend fungerar!", levels: count });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server på port ${port}`));