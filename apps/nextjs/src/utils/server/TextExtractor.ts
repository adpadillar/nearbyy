import { File } from "@web-std/file";
import { DOMParser } from "@xmldom/xmldom";
import JSZip from "jszip";
import { extractRawText } from "mammoth";
import OpenAI from "openai";
import pdfparse from "pdf-parse-fork";
// import pptxtotxt from "pptxto.txt";
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

  // getTextFromNodes(node: XMLDocument, tagName: string, namespaceURI: string) {
  //   let text = "";
  //   const textNodes = node.getElementsByTagNameNS(namespaceURI, tagName);
  //   for (let i = 0; i < textNodes.length; i++) {
  //     text += textNodes[i].textContent + " ";
  //   }
  //   console.log(text.trim());
  //   return text.trim();
  // }

  // async extractFromPptx() {
  //   try {
  //     const zip = new JSZip();
  //     await zip.loadAsync(await this.arrayBufferPromise);

  //     const aNamespace =
  //       "https://dzpv5o2pvfxys.cloudfront.net/powerpoint-namespace.xml";
  //     let text = "";

  //     let slideIndex = 1;
  //     // eslint-disable-next-line no-constant-condition
  //     while (true) {
  //       const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);

  //       if (!slideFile) break;

  //       const slideXmlStr = await slideFile.async("text");

  //       const parser = new DOMParser();
  //       const xmlDoc = parser.parseFromString(slideXmlStr, "application/xml");

  //       text += this.getTextFromNodes(xmlDoc, "t", aNamespace) + " ";

  //       slideIndex++;
  //     }

  //     console.log(text.trim());
  //     return text.trim();
  //   } catch (err) {
  //     console.error("Error extracting text from PPTX:", err);
  //     return "";
  //   }
  // }

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

    if (this.mimeType === MIME_TYPES.pptx) {
      return { text: await this.extractFromPptx(), error: null } as const;
    }
    if (
      this.mimeType === MIME_TYPES.png ||
      this.mimeType === MIME_TYPES.jpg ||
      this.mimeType === MIME_TYPES.jpeg
    ) {
      return { text: await this.extractFromImage(), error: null } as const;
    }
    return { text: null, error: "Unsupported file type" } as const;
  }
}
