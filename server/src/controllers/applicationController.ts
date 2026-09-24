import * as service from "../services/applicationService";
import type { ApplicationInput } from "../types/application";
import type { Request, Response } from "express";
import PDFDocument from "pdfkit";

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

export async function getUsage(req: Request, res: Response) {
  const { data, error } = await service.getUsage(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const fields = pickApplicationFields(req.body);
  if (!fields.title) {
    return res.status(400).json({ error: "title krävs" });
  }

  const { data: usage, error: usageError } = await service.getUsage(
    req.user!.id,
  );
  if (usageError) return res.status(500).json({ error: usageError.message });
  if (usage && usage.limit !== null && usage.used >= usage.limit) {
    return res.status(403).json({
      error: `Du har nått taket för ${usage.level_name} (${usage.limit} ansökningar). Uppgradera för att skapa fler.`,
    });
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

export async function getStats(req: Request, res: Response) {
  const { data, error } = await service.getStats(req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function exportApplications(req: Request, res: Response) {
  const format = String(req.query.format ?? "csv").toLowerCase();

  const { data: usage, error: usageError } = await service.getUsage(
    req.user!.id,
  );
  if (usageError || !usage)
    return res.status(500).json({ error: usageError?.message });

  const accessLevel = (usage as any).access_level ?? 1;
  if (format === "csv" && accessLevel < 2) {
    return res
      .status(403)
      .json({ error: "CSV-export kräver Plus eller Premium." });
  }
  if (format === "pdf" && accessLevel < 3) {
    return res.status(403).json({ error: "PDF-export kräver Premium." });
  }

  const { data: apps, error } = await service.getApplicationsForExport(
    req.user!.id,
  );
  if (error) return res.status(500).json({ error: error.message });

  const rows = (apps ?? []).map((a: any) => ({
    title: a.title ?? "",
    company: a.company ?? "",
    status: a.application_status?.status_name ?? "",
    applied_at: a.applied_at ?? "",
    response_date: a.response_date ?? "",
    link: a.link ?? "",
    notes: (a.notes ?? "").replace(/[\r\n]+/g, " "),
  }));

  const dateSuffix = new Date().toISOString().slice(0, 10);
  const filename = `ansokningar-${dateSuffix}.${format}`;

  if (format === "csv") {
    const header = [
      "Titel",
      "Företag",
      "Status",
      "Ansökt",
      "Svar",
      "Länk",
      "Anteckningar",
    ];
    const csvLines = [header.join(",")];
    for (const r of rows) {
      const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
      csvLines.push(
        [
          r.title,
          r.company,
          r.status,
          r.applied_at,
          r.response_date,
          r.link,
          r.notes,
        ]
          .map(escape)
          .join(","),
      );
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send("\uFEFF" + csvLines.join("\n"));
  }

  if (format === "pdf") {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    doc.fontSize(18).text("Mina ansökningar", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`Exporterad ${dateSuffix}`, { align: "center" });
    doc.moveDown(1.5);

    doc.fillColor("#000");
    for (const r of rows) {
      doc.fontSize(12).text(r.title, { continued: false });
      if (r.company) doc.fontSize(10).fillColor("#555").text(r.company);
      doc
        .fontSize(9)
        .fillColor("#333")
        .text(
          `Status: ${r.status}${r.applied_at ? "  ·  Ansökt: " + r.applied_at : ""}${r.response_date ? "  ·  Svar: " + r.response_date : ""}`,
        );
      if (r.notes) doc.fontSize(9).fillColor("#666").text(r.notes);
      doc.moveDown(0.8);
      doc.fillColor("#000");
    }

    doc.end();
    return;
  }

  return res
    .status(400)
    .json({ error: "Okänt format. Använd 'csv' eller 'pdf'." });
}
