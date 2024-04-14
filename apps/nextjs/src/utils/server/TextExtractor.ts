import { File } from "@web-std/file";
import { extractRawText } from "mammoth";
import OpenAI from "openai";
import pdfparse from "pdf-parse-fork";

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

  // lastModified
  // name
  // size
  // type
  // text

  async extractFromMp3() {
    const file = new File([this.fileBlob], "name.mp3");
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "text",
    });
    console.log(transcription);
    return transcription.text;
  }

  async extract() {
    if (this.mimeType === MIME_TYPES.txt || this.mimeType === MIME_TYPES.md) {
      return { text: await this.extractFromText(), error: null } as const;
    }

    if (this.mimeType === MIME_TYPES.pdf) {
      return { text: await this.extractFromPdf(), error: null } as const;
    }

    if (this.mimeType === MIME_TYPES.docx) {
      return { text: await this.extractFromDocx(), error: null } as const;
    }

    if (this.mimeType === MIME_TYPES.mp3) {
      return { text: await this.extractFromMp3(), error: null } as const;
    }
    return { text: null, error: "Unsupported file type" } as const;
  }
}
