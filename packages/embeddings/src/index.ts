import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const getSingleEmbedding = async (toEmbed: string) => {
  const embeddings = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: [toEmbed],
  });

  return embeddings.data[0]?.embedding;
};
