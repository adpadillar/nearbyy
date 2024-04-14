---
title: Getting Started with Typescript
description: Setting up your first project with Nearbyy
sidebar:
  order: 1
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, [please contact us here](mailto:adpadillar25@gmail.com).
:::

In this guide, you will be setting up your first Nearbyy project in Typescript. Make sure you have an account on [Nearbyy](https://nearbyy.com) before you begin.

## Creating a new project

Open the [Nearbyy Dashboard](https://nearbyy.com/dashboard) and click on the **Create a new project** button. You will be asked to enter a name for your project, a description, and a project-id. Enter each one and click on **OK**.

## Installing npm package

After creating your project, click on it. This will direct you to the project's Getting Started guide. To start using Nearbyy in your project, you need to install the npm package. Run the following command in your project directory:

```bash
npm install @nearbyy/core
```

The `@nearbyy/core` package contains the core Nearbyy SDK. It is the only package you need to install to start using Nearbyy in your project.

### Supported runtimes

For now, the Nearbyy sdk runs from the server. We support the following runtimes:

- Node.js
- Edge Runtime

:::danger[Running in the browser]
While running our SDK is technically possible in the browser, we strongly advise against it. This will leak your API keys. We plan to support running in the browser in the future, eliminating the need for your own backend. However, this is not supported yet.
:::

## Getting your API key

Now, click on Get API Key. This will generate an API key for your project. You will need this API key to authenticate your requests to the Nearbyy API. This API will not be shown again, so make sure to store it in a safe place. You can manage your API keys from the `dashboard/<project-id>/keys` page

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

To upload a file, use the [`uploadFile`](../../typescript-sdk/nearbyy-client#uploadfile) method of the client.

```typescript title="example.ts"
const { success, error, data } = await client.uploadFile({
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

When you upload a file, our backend service will download it from the `fileUrl` and convert it into plain text. The text will then be processed, embedded and stored into a vector database, where the file will be available for search after a few seconds.

#### Supported file types

Different file types are supported by Nearbyy. Our backend service will look at the `Content-Type` header of the file to determine how to process it. The following table shows the supported file types:

| File Type | MIME Type                                                                 |
| --------- | ------------------------------------------------------------------------- |
| Markdown  | `text/markdown`                                                           |
| Text      | `text/plain`                                                              |
| PDF       | `application/pdf`                                                         |
| MP3       | `audio/mpeg`                                                              |
| Docx      | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Jpeg,Jpg  | `image/jpeg`                                                              |
| Png       | `image/png`                                                               |

:::tip[Your file type is not supported?]
We plan to aggressively expand the list of supported file types. If you want to request support for a file type, please [contact us](mailto:adpadillar25@gmail.com).
:::

### Semantic Search

Once you have uploaded a file, you can search for it using the [`queryDatabase`](../../typescript-sdk/nearbyy-client#querydatabase) method of the client. The [`queryDatabase`](../../typescript-sdk/nearbyy-client#querydatabase) method takes a [`FileEndpointGetParams`](../../api-reference/types#fileendpointgetparams) object and returns a [`Promise<FileEndpointGetResponse>`](../../api-reference/types#fileendpointgetresponse).

```typescript title="example.ts" ""What are the benefits of eating garlic?""
const files = await client.queryDatabase({
  query: "What are the benefits of eating garlic?", // Replace with your query
  limit: 5,
});
```

### Deleting a file

To delete a file, use the [`deleteFile`](../../typescript-sdk/nearbyy-client#deletefile) method of the client.

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
