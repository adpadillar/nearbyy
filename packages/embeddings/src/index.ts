import type { Tiktoken, TiktokenEncoding } from "js-tiktoken";
import { getEncoding } from "js-tiktoken";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const getMultipleEmbeddings = async (toEmbed: string[]) => {
  if (toEmbed.length === 0) {
    return {
      success: false,
      error: new Error("No strings to embed"),
      embeddings: null,
    } as const;
  }

  try {
    const embeddings = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: toEmbed,
    });

    const embeddingsArray = embeddings.data.map((d) => d.embedding);

    if (embeddingsArray.length === 0) {
      return {
        success: false,
        error: new Error("No embeddings found"),
        embeddings: null,
      } as const;
    }

    return {
      success: true,
      embeddings: embeddingsArray,
      error: null,
    } as const;
  } catch (e) {
    return {
      success: false,
      error: new Error("Unexpected error while generating the embeddings"),
      embeddings: null,
    } as const;
  }
};

export const getSingleEmbedding = async (toEmbed: string) => {
  if (!toEmbed) {
    return {
      success: false,
      error: new Error("No string to embed"),
      embedding: null,
    } as const;
  }

  try {
    const embeddings = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: [toEmbed],
    });

    const embedding = embeddings.data[0]?.embedding;

    if (!embedding) {
      return {
        success: false,
        error: new Error("No embedding found"),
        embedding: null,
      } as const;
    }

    return {
      success: true,
      embedding: embedding,
      error: null,
    } as const;
  } catch (e) {
    return {
      success: false,
      error: new Error("Unexpected error while generating the embedding"),
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

const calculateChunkAmount = (
  tokensLength: number,
  length: number,
  overlap: number,
) => {
  if (tokensLength <= length) {
    return 1;
  }

  return Math.ceil(1 + (tokensLength - length) / (length - overlap));
};

interface Chunk {
  order: number;
  embedding: number[];
  tokens: number[];
  tokenLength: number;
  text: string;
}

export const chunking = async (
  text: string,
  length: number,
  overlap: number,
) => {
  const tokenizer = new Tokenizer();
  const tokenizedString = tokenizer.encode(text);
  const chunkArray: Omit<Chunk, "embedding">[] = [];

  const chunkCount = calculateChunkAmount(
    tokenizedString.length,
    length,
    overlap,
  );

  for (let i = 0; i < chunkCount; i++) {
    const chunk: number[] = [];

    // // define a variable for storing the current token
    // // this get's redefined each chunk
    let currentToken: number | undefined;
    for (let j = 0; j < length; j++) {
      // Example of iterations:
      // len * i - ov * i + j
      // 100 * 0 - 10 * 0 + 0 = 0 -> first token (j = 0) in first chunk (i = 0)
      // 100 * 0 - 10 * 0 + 1 = 1 -> second token (j = 1) in first chunk (i = 0)
      // ...
      // 100 * 1 - 10 * 1 + 0 = 190 -> first token (j = 0) in second chunk (i = 1)
      currentToken = tokenizedString[length * i - overlap * i + j];
      if (currentToken) {
        chunk.push(currentToken);
      } else {
        // if we couldn't find a current token, it
        // means we are done. Example
        // 100 * 5 - 10 * 5 + 32 = 522 -> 33rd token (j = 32) of the 6th chunk (i = 5)
        // if tokenizedString[522] is undefined, it means the last token was tokenizedString[523]
        // Therefore, we are done and we break to stop iterating
        break;
      }
    }

    const chunkWithoutEmbedding: Omit<Chunk, "embedding"> = {
      order: i,
      tokens: chunk,
      tokenLength: chunk.length,
      text: tokenizer.decode(chunk),
    };

    chunkArray.push(chunkWithoutEmbedding);
  }

  const { success, embeddings } = await getMultipleEmbeddings(
    chunkArray.map((c) => c.text),
  );

  if (!success) {
    throw new Error("Could not generate embeddings");
  }

  const chunkArrayWithEmbeddings: Chunk[] = chunkArray.map((c, idx) => ({
    ...c,
    embedding: embeddings[idx]!,
  }));

  return chunkArrayWithEmbeddings;
};
