import { getDocument } from "pdfjs-dist";

import "pdfjs-dist/build/pdf.worker.min";

export class TextExtractor {
  buffer: ArrayBuffer;
  mimeType: string;

  constructor({ buffer, mimeType }: { buffer: ArrayBuffer; mimeType: string }) {
    this.buffer = buffer;
    this.mimeType = mimeType;
  }

  extractFromText() {
    const text = new TextDecoder().decode(this.buffer);
    return text;
  }

  async extractFromPdf() {
    const doc = await getDocument(this.buffer).promise;
    const textArray: string[] = [];

    for (let i = 0; i < doc.numPages; i++) {
      const page = await doc.getPage(i + 1); // pages start at 1
      const text = await page.getTextContent();
      const finalText = text.items
        .map((s) => {
          const v = s as { str: string };
          return v.str;
        })
        .join(" ");
      textArray.push(finalText);
    }

    const text = textArray.join("\n");
    console.log(text);

    return text;
  }

  async extract() {
    if (this.mimeType.startsWith("text/")) {
      return { text: this.extractFromText(), error: null } as const;
    }

    if (this.mimeType === "application/pdf") {
      return { text: await this.extractFromPdf(), error: null } as const;
    }

    return { text: null, error: "Unsupported file type" } as const;
  }
}
