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

export const chunking = (text: string, length: number, overlap: number) => {
  const tokenizer = new Tokenizer();
  const tokenizedString = tokenizer.encode(text);
  let chunk: number[] = [];
  const textChunks = [];
  let chunkString = "";

  const chunkCount = calculateChunkAmount(
    tokenizedString.length,
    length,
    overlap,
  );

  for (let i = 0; i < chunkCount; i++) {
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
    // we decode the current chunk and append the result to the textChunks
    chunkString = tokenizer.decode(chunk);
    textChunks.push({
      text: chunkString,
      tokenLenght: chunk.length,
    });
    // clear current chunk
    chunk = [];
  }
  return textChunks;
};

// const tokenChunks =  tokenizedString.splice
//   for (let i = 0; i <chunkCount; i++) {
//     if (i % length === 0) {
//       if (i !== 0) {
//         chunkString = tokenizer.decode(chunk);
//         textChunks.push({
//           text: chunkString,
//           tokenLenght: chunk.length,
//         });
//         chunk = [];
//         i = i - overlap - 1;
//       }
//       chunk.push(tokenizedString[i]!);
//     } else {
//       chunk.push(tokenizedString[i]!);
//     }
//   }
//   chunkString = tokenizer.decode(chunk);
//   textChunks.push({
//     text: chunkString,
//     tokenLenght: chunk.length,
//   });

//   return textChunks;
// };

// const parts = text.split("\n").filter((value) => value !== "");
// const tokenChunks = parts.map((str) => tokenizer.encode(str));
// const textChunks = tokenChunks.map((tokens) => tokenizer.decode(tokens));
