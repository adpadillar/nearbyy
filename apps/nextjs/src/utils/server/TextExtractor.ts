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

  async extract() {
    if (this.mimeType.startsWith("text/")) {
      return { text: this.extractFromText(), error: null } as const;
    }

    return { text: null, error: "Unsupported file type" } as const;
  }
}
