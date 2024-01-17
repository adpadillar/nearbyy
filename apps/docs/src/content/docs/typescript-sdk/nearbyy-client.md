---
title: NearbyyClient
description: NearbyyClient class reference
sidebar:
  order: 2
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

The NearbyyClient class is the main class of the Nearbyy SDK. It is used to upload and retrieve files from the Nearbyy platform.

## Constructor

Calling `new NearbyyClient()` will create a new instance of the NearbyyClient class.

```typescript title="NearbyyClient.ts"
interface NearbyyClientOptions {
  API_KEY: string;
  API_URL?: string;
}

constructor(options: NearbyyClientOptions)
```

### Parameters

- `options`: The options to use when creating the client.
  - `API_KEY?`: Your API key. Defaults to `process.env.NEARBYY_API_KEY`.
  - `API_URL?`: The URL of the Nearbyy API. Defaults to `https://nearbyy.com/api`.

## Methods

### uploadFile

Uploads a file to the Nearbyy platform.

```typescript title="uploadFile.ts"
interface UploadFileOptions {
  fileUrl: string;
}

async uploadFile(options: UploadFileOptions): Promise<void>
```

#### Parameters

- `options`: The options to use when uploading the file.
  - `fileUrl`: The URL of the file to be uploaded.

### queryDatabase

Performs a semantic search on the Nearbyy platform.

```typescript title="queryDatabase.ts"
interface QueryDatabaseOptions {
  query: string;
  limit?: number;
}

async queryDatabase(options: QueryDatabaseOptions): Promise<FileSearchClientResponse[]>
```

#### Parameters

- `options`: The options to use when querying the database.
  - `query`: The query to search for.
  - `limit?`: The maximum number of results to return. (_between 1 and 100, default is 10_)

#### Return value

[`FileSearchClientResponse[]`](./file-search-client-response)
