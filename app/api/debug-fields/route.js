import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const pdfPath = path.join(process.cwd(), "public", "acord25.pdf");
  const pdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fieldNames = form.getFields().map(f => f.getName());

  return new Response(JSON.stringify(fieldNames, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
