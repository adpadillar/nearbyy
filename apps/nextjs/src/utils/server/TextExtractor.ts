import { extractRawText } from "mammoth";
import PDF from "pdf2json";

const MIME_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  md: "text/markdown",
  html: "text/html",
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
    const PDFParser = new PDF();
    PDFParser.parseBuffer(Buffer.from(this.arrayBuffer));

    const v = new Promise<string>((resolve) => {
      PDFParser.on("pdfParser_dataReady", (data) => {
        const v = data.Pages.map((p) => {
          return p.Texts.map((t) => {
            return t.R.map((r) => r.T);
          });
        });

        const str = v.flat(2).join(" ");
        const decodedStr = decodeURIComponent(str);
        resolve(decodedStr);
      });
    });

    return v;
  }

  async extract() {
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
