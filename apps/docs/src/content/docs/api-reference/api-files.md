---
title: Files
description: API /files endpoint
sidebar:
  order: 3
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

- Url: `https://nearbyy.com/api/files`
- Methods: `GET`, `POST`

## Upload a file

Uploads a file to the Nearbyy platform.

### Request

- Method: `POST`
- Url: `https://nearbyy.com/api/files`

### Body

```json title="Request Body"
{
  "fileUrl": "https://example.com/image.png"
}
```

- `fileUrl`: The URL of the file to be uploaded.

### Response

`Null`

## Semantic search

Performs a semantic search on the Nearbyy platform.

### Request

- Method: `GET`
- Url: `https://nearbyy.com/api/files`
- Query Parameters:
  - `query`: The query to search for.
  - `limit?`: The maximum number of results to return. Defaults to `10`.

### Body

`Null`

### Response

[`FileSearchClientResponse[]`](../typescript-sdk/file-search-client-response)

```json title="Response Body"
[]
```
