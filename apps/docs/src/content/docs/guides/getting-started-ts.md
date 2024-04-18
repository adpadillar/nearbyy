---
title: Getting Started with Typescript
description: Setting up your first project with Nearbyy
sidebar:
  order: 1
---

In this guide, you will be setting up your first Nearbyy project in Typescript. Make sure you have an account on [Nearbyy](https://nearbyy.com) before you begin.

This guide is framework agnostic, and you can use it with any framework that supports running Javascript/Typescript on the server. We are also working on a [Next.js](https://nextjs.org/) and [Express.js](https://expressjs.com/) guides, which will be in these docs soon.

:::note[About using Javascript]
If you want, you can also use Javascript instead of Typescript. You can still take advantage of the types and autocompletion provided by the SDK.
:::

## Creating a new project

Open the [Nearbyy Dashboard](https://nearbyy.com/dashboard/projects) and click on the **Create a new project** button. You will be asked to enter a name for your project and a description. Enter each one and click on **Create project**. Once your project is created, you will be redirected to the project's Getting Started guide

![](/project-dashboard.png)

## Installing npm package

To start using Nearbyy in your project, you need to install the npm package. Run the following command in your project's directory:

```bash
npm install @nearbyy/core
```

The `@nearbyy/core` package contains the core Nearbyy SDK. It is the only package you need to install to start using Nearbyy in your project.

### Supported runtimes

For now, the Nearbyy SDK runs only on the server. We support the following runtimes:

- Node.js
- Edge Runtime

Running the SDK in the browser is not supported yet, but it is something we are working on.

## Getting your API key

Go to the Keys page of your project by clicking on the **Keys** tab on the project's dashboard. From there, click on the **Create a key** button and then on **Generate key**. This will generate an API key for your project. You will need this API key to authenticate your requests to the Nearbyy API. This API key will not be shown again, so make sure to store it in a safe place.

You can manage your existing API keys from this page.

![](/api-key.png)

After getting your API Key, it is recommended that you store it in a `.env` file, with whatever name you want. For example, if you want to store your API key in a variable named `NEARBYY_API_KEY`, you can create a `.env` file with the following contents:

```env title=".env"
NEARBYY_API_KEY=YOUR_API_KEY
```

## Creating a client

To create a client, import the [`NearbyyClient`](../../typescript-sdk/nearbyy-client) class from the`@nearbyy/core` package and pass your API key to the constructor like shown below:

```typescript ""YOUR_API_KEY"" title="example.ts"
import { NearbyyClient } from "@nearbyy/core";

const client = new NearbyyClient({
  API_KEY: "YOUR_API_KEY", // Replace with your API key
});
```

### Understanding the client

The `NearbyyClient` class is the main way to interact with the Nearbyy API. It's methods use a consistent pattern, and are designed to be easy to use.

Every method of the client returns a `Promise` that resolves to a `EndpointResponse` object. This object contains the following properties:

- `success`: A boolean that indicates whether the request was successful.
- `error`: A string that contains the error message if the request was not successful.
- `data`: The data returned by the request, if any.

The SDK is typed in such a way that types narrow down. For example, if the `success` property is `true`, the `error` property will be `null`, and you will get the `data` property.

### Uploading a file

Different file types are supported by Nearbyy. Our backend service will look at the `Content-Type` header of the file to determine how to process it. You can see the [list of supported file types here](/faq/file-processing).

#### Through the dashboard

To upload a file, you can use the Nearbyy dashboard. Go to the Files page of your project by clicking on the **Files** tab on the project's dashboard. From there, click on the **Upload file** button and select the file you want to upload.

![](/upload-file.gif)

#### Through the client

You can also use the client to upload a file, use the [`uploadFiles`](../../typescript-sdk/nearbyy-client#uploadfiles) method of the client.

```typescript title="example.ts"
const { success, error, data } = await client.uploadFiles({
  fileUrls: ["https://example.com/image.jpg"],
});

if (success) {
  console.log("File uploaded successfully");
  console.log(data); // { ids: ["file-id"] }
} else {
  console.error(`Error uploading file: ${error}`);
  console.error(data); // { rejectedUrls: ["https://example.com/image.jpg"] }
}
```

When you upload a file, our backend service will download it from the `fileUrl` and convert it into plain text. The text will then be processed, embedded and stored into a vector database, where the file will be available for search after a few seconds. For more information on how files are processed, see the [file processing FAQ](../../faq/file-processing).

### Semantic Search

Once you have uploaded a file, you can search for it using the [`semanticSearch`](../../typescript-sdk/nearbyy-client#semanticsearch) method of the client. The [`semanticSearch`](../../typescript-sdk/nearbyy-client#semanticsearch) method takes a [`ChunkEndpointGetParams`](../../api-reference/types#chunkendpointgetparams) object and returns a [`Promise<ChunkEndpointGetResponse>`](../../api-reference/types#chunkendpointgetresponse).

```typescript title="example.ts" ""What are the benefits of eating garlic?""
const files = await client.queryDatabase({
  query: "What are the benefits of eating garlic?", // Replace with your query
  limit: 5,
});
```

### Deleting a file

To delete a file, use the [`deleteFiles`](../../typescript-sdk/nearbyy-client#deletefiles) method of the client.

```typescript title="example.ts"
const { success, error, data } = await client.deleteFile({
  ids: ["file-id"], // Replace with the ids of the files you want to delete
});

if (success) {
  console.log("File deleted successfully");
  console.log(data); // { ids: ["file-id"] }
} else {
  console.error(`Error deleting file: ${error}`);
  console.error(data); // { rejectedIds: ["file-id"] }
}
```

## Next steps

Now that you have set up your first Nearbyy project, you can start using the Nearbyy API to upload and retrieve files from the Nearbyy platform. If you have any questions or need help, please [contact us](mailto:adpadillar25@gmail.com)
