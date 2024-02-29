---
title: Files
description: API /files endpoint
sidebar:
  order: 3
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, [please contact us here](mailto:adpadillar25@gmail.com).
:::

- Endpoint: `https://nearbyy.com/api/files`
- Methods: `GET`, `POST`, `DELETE`

## Upload files

Uploads files to the Nearbyy platform.

### Request

- Method: `POST`
- Endpoint: `https://nearbyy.com/api/files`

### Body

[`FileEndpointPostBody`](../types#fileendpointpostbody)

```json title="Request Body"
{
  "fileUrls": ["https://example.com/file.txt"]
}
```

- `fileUrls`: The URLs of the files to upload.

### Response

[`FileEndpointPostResponse`](../types#fileendpointpostresponse)

- `data.ids`: The IDs of the files that were uploaded.
- `data.rejectedUrls`: The URLs of the files that were rejected.

```json title="Response Body"
{
  "data": {
    "ids": ["file-id-1"]
  },
  "success": true,
  "error": null
}
```

## Query for files

Performs a semantic search on the Nearbyy platform.

### Request

- Method: `GET`
- Endpoint: `https://nearbyy.com/api/files`

### Query Parameters

[`FileEndpointGetParams`](../types#fileendpointgetparams)

- `limit`: The maximum number of results to return.
- `query`: The query to search for.

```http
GET /api/files?limit=10&query=example
```

### Response

[`FileEndpointGetResponse`](../types#fileendpointgetresponse)

- `data.items`: The files that matched the query.
  - `type`: The type of the file.
  - `id`: The ID of the file.
  - `text`: The text of the file.
  - `url`: The URL of the file.
  - `_extras.projectid`: The ID of the project that the file belongs to.
  - `_extras.distance`: The distance of the file from the query.

```json title="Response Body"
{
  "data": {
    "items": [
      {
        "type": "pdf",
        "id": "file-id-1",
        "text": "Example file",
        "url": "https://example.com/file.txt",
        "_extras": {
          "projectid": "project-id-1",
          "distance": 0.5
        }
      }
    ]
  },
  "success": true,
  "error": null
}
```

## Delete files

Deletes files from the Nearbyy platform.

### Request

- Method: `DELETE`
- Endpoint: `https://nearbyy.com/api/files`

### Body

[`FileEndpointDeleteBody`](../types#fileendpointdeletebody)

```json title="Request Body"
{
  "ids": ["file-id-1"]
}
```

- `ids`: The IDs of the files to delete.

### Response

[`FileEndpointDeleteResponse`](../types#fileendpointdeleteresponse)

- `data.ids`: The IDs of the files that were deleted.
- `data.rejectedIds`: The IDs of the files that were rejected.

```json title="Response Body"
{
  "data": {
    "ids": ["file-id-1"]
  },
  "success": true,
  "error": null
}
```
