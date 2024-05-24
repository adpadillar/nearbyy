---
title: React and Express.js
description: Setting up your first project with Nearbyy
sidebar:
  order: 2
---

In this guide, we'll build an AI chat app, giving the chatbot the ability to retrieve information from a knowledge base. We'll use the Nearbyy API to store and retrieve the information.

:::note[About using Typescript]
This guide is written in Javascript, but you can also use Typescript. Regardless of the language you choose, you can still take advantage of the types and autocompletion provided by the SDK.
:::

## Project setup

First, lets understand the structure we are going to use for our project. We will use the following structure:

```plaintext
ai-chat-app
|-- client
|   ... your react app
|-- server
|   ... your express app
```

We will have a `client` directory for our React app and a `server` directory for our Express.js app. We will use the `server` directory to create an API that our React app can use to communicate with the Nearbyy API.

Start creating the folders for your project:

```bash
mkdir ai-chat-app
cd ai-chat-app
mkdir client
mkdir server
```

### Client setup

We will use [Vite](https://vitejs.dev/) to create our React app. Run the following command in the `client` directory to create a new React app:

```bash
cd client # move to the client directory
npm create vite@latest . --template react
npm install
```

This will create a new React app in the `client` directory. You can now move back to the root of your project:

```bash
cd ..
```

We will move on to setting up the server.

### Server setup

We will use [Express.js](https://expressjs.com/) to create our server. Run the following command in the `server` directory to create a new Express.js app:

```bash
cd server # move to the server directory
npm init -y
npm install express cors dotenv @nearbyy/core openai
```

Also, modify the `package.json` file to add the following:

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

## Server configuration

### Environment variables

Create a new file named `.env` in the `server` directory and add the following:

```env title="server/.env"
NEARBYY_API_KEY=YOUR_NEARBYY_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

### Initialization code

You can get your Nearbyy API key from the Nearbyy dashboard. The OpenAI API key is required to use the OpenAI API, which we will use to generate responses for the chatbot. Feel free to use any other AI API.

Create a new file named `index.js` in the `server` directory and add the following code:

```javascript title="server/index.js"
// Setting up the environment variables,
// loading .env file
import cors from "cors";
import dotenv from "dotenv";
// Importing the required packages for
// express.js
import express from "express";
// OpenAI Client setup
import OpenAI from "openai";

// Nearbyy Client setup
import { NearbyyClient } from "@nearbyy/core";

dotenv.config();

// Creating a new express app, and using
// the required middleware
const app = express();
app.use(express.json());
app.use(cors());

const nearbyy = new NearbyyClient({
  API_KEY: process.env.NEARBYY_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

This code does a few things:

1. It loads the environment variables from the `.env` file.
2. It imports the required packages for Express.js.
3. It creates a new Express app and uses the required middleware.
4. It sets up the Nearbyy and OpenAI clients.

### Creating the `/chat` endpoint

After setting up the clients, we can create the `/chat` endpoint that our React app will use to communicate with the Nearbyy API. Add the following code to the `index.js` file:

```javascript title="server/index.js"
// ... previous code
app.get("/chat", async (req, res) => {
  const { message } = req.query;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  res.send(response.choices[0].message.content);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
```

After adding this code, you can start the server by running the following command in the `server` directory:

```bash
npm start
```

Your server will start running on port 3001. If you visit `http://localhost:3001/chat?message=Hello`, you should see a response from the OpenAI API. This is the chatbot's response to the message `Hello`.

### Adding a Knowledge Base

Now that we have a backend server serving the chatbot responses, we can modify the `/chat` endpoint to use the Nearbyy API to retrieve information from a knowledge base. We will use the Nearbyy API to store and retrieve the information.

First, go to the Nearbyy dashboard and select your project. Go to the **Files** tab and upload some files that contain the information you want the chatbot to retrieve. You can upload files in various formats, such as `.txt`, `.pdf`, `.docx`, etc.

After uploading the files, you can modify the `/chat` endpoint to use the Nearbyy API to retrieve information from the knowledge base. Add the following code to the `index.js` file:

```diff lang="js" title="server/index.js"
// ... previous code
app.get("/chat", async (req, res) => {
  const { message } = req.query;

+  // Retrieve information from the nearbyy knowledge base
+  // In this case, we return the top 3 chunks of information
+  const context = await nearbyy.semanticSearch({
+    limit: 3,
+    query: message,
+  });

+  // we return an error message if the context retrieval is not successful
+  if (!context.success) {
+    console.error(context.error);
+    return res.send("I'm sorry, I don't understand.");
+  }

+  // We concatenate the information retrieved from the knowledge base into a single message
+  const ctxMsg = context.data.items.map((item) => item.text).join("\n\n");
  const response = await openai.chat.completions.create({
     messages: [
      {
        role: "system",
-        content: "You are a helpful assistant.",
+        content: "If you are given relevant context, answer the users query with it. If the context does not include the answer, STATE that you don't have enough information to answer the query but still try to answer it without the context.",
      },
+      {
+        // we append the context to the message
+        role: "system",
+        content: "RELEVANT CONTEXT TO THE USER'S QUERY:\n " + ctxMsg,
+      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo",
  })

  res.send(response.choices[0].message.content);
})

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
```

After these changes, you should be able to ask your chatbot questions, and it should respond with information from the knowledge base you uploaded to the Nearbyy dashboard. For example, if I were to upload a PDF of the first Harry Potter book, I could ask the chatbot,
"Who did Dumbledore really trust?" and it should respond with the relevant information from the book.

To ask this question, I would visit `http://localhost:3001/chat?message=Who%20did%20Dumbledore%20really%20trust?` on my browser. Here is the response I got back:

> "Dumbledore trusted several people to help in guarding the Philosopher's Stone. Apart from Harry and Hagrid, he also trusted Fluffy the three-headed dog, Professor Sprout, Professor Flitwick, Professor McGonagall, Professor Quirrell, and unexpectedly, Professor Snape. So, Dumbledore trusted a select group of teachers and individuals at Hogwarts to protect the mysterious stone."

## Frontend configuration
