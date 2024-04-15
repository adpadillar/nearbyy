---
title: NearbyyClient
description: NearbyyClient class reference
sidebar:
  order: 2
---

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
async uploadFile(body: FileEndpointPostBody): Promise<FileEndpointPostResponse>
```

#### Parameters

- [`FileEndpointPostBody`](../../api-reference/types#fileendpointpostbody): The body of the request.

#### Returns

- [`Promise<FileEndpointPostResponse>`](../../api-reference/types#fileendpointpostresponse): The response from the server.

### queryDatabase

Performs a semantic search on the Nearbyy platform.

```typescript title="queryDatabase.ts"
async queryDatabase(params: FileEndpointGetParams): Promise<FileEndpointGetResponse>
```

#### Parameters

- [`FileEndpointGetParams`](../../api-reference/types#fileendpointgetparams): The parameters of the request.

#### Returns

- [`Promise<FileEndpointGetResponse>`](../../api-reference/types#fileendpointgetresponse): The response from the server.

### deleteFile

Deletes a file from the Nearbyy platform.

```typescript title="deleteFile.ts"
async deleteFile(params: FileEndpointDeleteParams): Promise<FileEndpointDeleteResponse>
```

#### Parameters

- [`FileEndpointDeleteParams`](../../api-reference/types#fileendpointdeleteparams): The parameters of the request.

#### Returns

- [`Promise<FileEndpointDeleteResponse>`](../../api-reference/types#fileendpointdeleteresponse): The response from the server.
