import type { Tiktoken, TiktokenEncoding } from "js-tiktoken";
import { getEncoding } from "js-tiktoken";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

/**
 *
 * Uses OpenAI's API to embed a string into a 1536 dimensional vector
 *
 * @example
 *
 * ### Create an embedding
 *
 * ```ts
 * const { embedding, success } = await getSingleEmbedding("Hello, world!");
 * if (success) {
 *  console.log(embedding); // [0.1, 0.2, 0.3, ...]
 * }
 * ```
 *
 * @param toEmbed the string to embed
 * @returns
 */
export const getSingleEmbedding = async (toEmbed: string) => {
  try {
    const embeddings = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: [toEmbed],
    });

    const embedding = embeddings.data[0]?.embedding;

    if (!embedding) {
      throw new Error("No embedding found");
    }

    return {
      success: true,
      embedding: embedding,
      error: null,
    } as const;
  } catch (e) {
    return {
      success: false,
      error: e,
      embedding: null,
    } as const;
  }
};

export class Tokenizer {
  encoding: TiktokenEncoding;
  tiktoken: Tiktoken;

  constructor(encoding: TiktokenEncoding = "cl100k_base") {
    this.encoding = encoding;
    this.tiktoken = getEncoding(encoding);
  }

  encode(text: string) {
    return this.tiktoken.encode(text);
  }

  decode(tokens: number[]) {
    return this.tiktoken.decode(tokens);
  }

  static _encode(text: string, encoding: TiktokenEncoding = "cl100k_base") {
    const tiktoken = getEncoding(encoding);
    return tiktoken.encode(text);
  }

  static _decode(tokens: number[], encoding: TiktokenEncoding = "cl100k_base") {
    const tiktoken = getEncoding(encoding);
    return tiktoken.decode(tokens);
  }
}

export const chunking = (text: string) => {
  const parts = text.split("\n").filter((value) => value !== "");

  const tokenizer = new Tokenizer();

  const tokenChunks = parts.map((str) => tokenizer.encode(str));
  const textChunks = tokenChunks.map((tokens) => tokenizer.decode(tokens));

  return textChunks;
};
