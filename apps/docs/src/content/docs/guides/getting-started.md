---
title: Getting Started with Typescript
description: Setting up your first project with Nearbyy
---

In this guide, you will be setting up your first Nearbyy project in Typescript. Make sure you have an account on [Nearbyy](https://nearbyy.com) before you begin.

## Creating a new project

Open the [Nearbyy Dashboard](https://nearbyy.com/dashboard) and click on the **New Project** button. You will be asked to enter a name for your project. Enter a name and click on **Create**.

## Installing npm package

To start using Nearbyy in your project, you need to install the npm package. Run the following command in your project directory:

```bash
npm install @nearbyy/core
```

The `@nearbyy/core` package contains the core Nearbyy SDK. It is the only package you need to install to start using Nearbyy in your project.

### Supported runtimes

The Nearbyy SDK supports the following runtimes:

- Node.js
- Edge Runtime

:::caution[Running in the browser]
We plan to support running in the browser in the future, eliminating the need for your own backend. However, this is not supported yet.
:::

## Getting your API key

To use Nearbyy, you need to have an API key. You can get your API key from the [Nearbyy Dashboard](https://nearbyy.com/dashboard).

After getting your API Key, it is recommended that you store it in a `.env` file, with whatever name you want. For example, if you want to store your API key in a variable named `NEARBYY_API_KEY`, you can create a `.env` file with the following contents:

```env title=".env"
NEARBYY_API_KEY=YOUR_API_KEY
```

## Creating a client

To create a client, import the `NearbyyClient` class from the`@nearbyy/core` package and pass your API key to the constructor like shown below:

```typescript ""YOUR_API_KEY"" title="example.ts"
import { NearbyyClient } from "@nearbyy/core";

const client = new NearbyyClient({
  API_KEY: "YOUR_API_KEY", // Replace with your API key
});
```

Note that if you don't pass your API key, the client will try to use `process.env.NEARBYY_API_KEY` as the API key.

### Uploading a file

To upload a file, use the `uploadFile` method of the client. The `uploadFile` method takes a the `string fileUrl` of the file to be uploaded.

```typescript title="example.ts" ""https://example.com/markdown-file.md""
await client.uploadFile({
  fileUrl: "https://example.com/markdown-file.md",
});
```

When you upload a file, our backend service will download it from the `fileUrl` and convert it into plain text. The text will then be processed, embedded and stored into a vector database, where the file will be available for search after a few seconds.

#### Supported file types

Different file types are supported by Nearbyy. Our backend service will look at the `Content-Type` header of the file to determine how to process it. The following table shows the supported file types:

| File Type | MIME Type       |
| --------- | --------------- |
| Markdown  | `text/markdown` |
| Text      | `text/plain`    |
| Other     | `text/*`        |

:::tip[Your file type is not supported?]
We plan to aggressively expand the list of supported file types. If you want to request support for a file type, please [contact us](https://nearbyy.com/contact).
