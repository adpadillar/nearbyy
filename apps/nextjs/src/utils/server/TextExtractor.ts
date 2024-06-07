import { Readability } from "@mozilla/readability";
import { File } from "@web-std/file";
import createDOMPurify from "dompurify";
import { JSDOM, VirtualConsole } from "jsdom";
import { extractRawText } from "mammoth";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { getTextExtractor } from "office-text-extractor";
import OpenAI from "openai";
import pdfparse from "pdf-parse-fork";
import { createWorker } from "tesseract.js";

import { env } from "~/env";
import { MIME_TYPES } from "../shared/constants";

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export class TextExtractor {
  fileBlob: Blob;
  arrayBufferPromise: Promise<ArrayBuffer>;
  mimeType: string;

  constructor({ fileBlob }: { fileBlob: Blob }) {
    this.fileBlob = fileBlob;
    this.arrayBufferPromise = this.fileBlob.arrayBuffer();
    this.mimeType = this.fileBlob.type;
  }

  async extractFromText() {
    const text = new TextDecoder().decode(await this.arrayBufferPromise);
    return text;
  }

  async extractFromDocx() {
    const text = await extractRawText({
      buffer: Buffer.from(await this.arrayBufferPromise),
    });
    return text.value;
  }

  async extractFromPdf() {
    const buffer = Buffer.from(await this.arrayBufferPromise);
    const res = await pdfparse(buffer);
    return res.text.replaceAll("\u0000", "");
  }

  async extractFromMp3() {
    const file = new File([this.fileBlob], "name.mp3");
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "json",
    });
    return transcription.text;
  }

  async extractFromImage() {
    const buffer = Buffer.from(await this.arrayBufferPromise);
    const worker = await createWorker("spa+fra+eng");
    const ret = await worker.recognize(buffer);
    await worker.terminate();
    return ret.data.text;
  }

  async extractFromPptx() {
    const textExtractor = getTextExtractor();
    const buffer = Buffer.from(await this.arrayBufferPromise);
    const text = await textExtractor.extractText({
      input: buffer,
      type: "buffer",
    });
    return text;
  }

  async extractFromHtml() {
    const text = new TextDecoder().decode(await this.arrayBufferPromise);
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => void 0);
    const dom = new JSDOM(text, { virtualConsole });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const window = dom.window;
    const DOMPurify = createDOMPurify(window);

    if (!article) {
      throw new Error("Failed to extract article");
    }

    const clean = DOMPurify.sanitize(article.content);

    const md = NodeHtmlMarkdown.translate(clean);

    return `# ${article.title}\n\n${md}`;
  }

  async extract() {
    if (
      this.mimeType.includes(MIME_TYPES.txt) ||
      this.mimeType.includes(MIME_TYPES.md)
    ) {
      return { text: await this.extractFromText(), error: null } as const;
    }

    if (this.mimeType.includes(MIME_TYPES.pdf)) {
      return { text: await this.extractFromPdf(), error: null } as const;
    }

    if (this.mimeType.includes(MIME_TYPES.docx)) {
      return { text: await this.extractFromDocx(), error: null } as const;
    }

    if (this.mimeType.includes(MIME_TYPES.mp3)) {
      return { text: await this.extractFromMp3(), error: null } as const;
    }

    if (this.mimeType.includes(MIME_TYPES.pptx)) {
      return { text: await this.extractFromPptx(), error: null } as const;
    }

    if (this.mimeType.includes(MIME_TYPES.html)) {
      return { text: await this.extractFromHtml(), error: null } as const;
    }

    if (
      this.mimeType.includes(MIME_TYPES.png) ||
      this.mimeType.includes(MIME_TYPES.jpg) ||
      this.mimeType.includes(MIME_TYPES.jpeg)
    ) {
      return { text: await this.extractFromImage(), error: null } as const;
    }

    console.log("Unsupported file type", this.mimeType);

    return { text: null, error: "Unsupported file type" } as const;
  }
}
