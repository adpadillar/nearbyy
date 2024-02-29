import { extractRawText } from "mammoth";
import { getDocument } from "pdfjs-dist";

// This tells webpack to include the worker file in the bundle
// pdfjs-dist will try to access this file, and it will not be
// available if it's not included in the bundle
import "pdfjs-dist/build/pdf.worker.min";

const MIME_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  md: "text/markdown",
};

export class TextExtractor {
  arrayBuffer: ArrayBuffer;
  mimeType: string;

  constructor({
    arrayBuffer: buffer,
    mimeType,
  }: {
    arrayBuffer: ArrayBuffer;
    mimeType: string;
  }) {
    this.arrayBuffer = buffer;
    this.mimeType = mimeType;
  }

  extractFromText() {
    const text = new TextDecoder().decode(this.arrayBuffer);
    return text;
  }

  async extractFromDocx() {
    const text = await extractRawText({
      buffer: Buffer.from(this.arrayBuffer),
    });
    return text.value;
  }

  async extractFromPdf() {
    const doc = await getDocument(this.arrayBuffer).promise;
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
    console.log(this.mimeType);

    if (this.mimeType === MIME_TYPES.txt || this.mimeType === MIME_TYPES.md) {
      return { text: this.extractFromText(), error: null } as const;
    }

    if (this.mimeType === MIME_TYPES.pdf) {
      return { text: await this.extractFromPdf(), error: null } as const;
    }

    if (this.mimeType === MIME_TYPES.docx) {
      return { text: await this.extractFromDocx(), error: null } as const;
    }

    return { text: null, error: "Unsupported file type" } as const;
  }
}
