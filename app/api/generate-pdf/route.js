import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const data = await req.json();

    const pdfPath = path.join(process.cwd(), "public", "acord25.pdf");
    const pdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const mappingPath = path.join(
      process.cwd(),
      "acord",
      "acord25",
      "spec",
      "mapping.json"
    );

    const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));

    for (const fieldPath in mapping) {
      const map = mapping[fieldPath];
      const value = fieldPath
        .split(".")
        .reduce((obj, key) => obj?.[key], data);

      if (value === undefined || value === null) continue;

      for (const pdfFieldName of map.pdf_fields) {
        try {
          if (map.type === "checkbox") {
            const checkbox = form.getCheckBox(pdfFieldName);
            value ? checkbox.check() : checkbox.uncheck();
          } else {
            const textField = form.getTextField(pdfFieldName);
            textField.setText(String(value));
          }
        } catch {
          // PDF field not present — safely ignored
        }
      }
    }

    form.flatten();

    const filledPdfBytes = await pdfDoc.save();

    return new Response(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=acord25-filled.pdf"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
