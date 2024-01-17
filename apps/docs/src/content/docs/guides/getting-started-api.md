---
title: Getting Started with the API
description: Setting up your first project with Nearbyy
sidebar:
  order: 2
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

If we don't support your language, you can still use Nearbyy by using the Nearbyy API. The Nearbyy API is a REST API that allows you to upload and retrieve files from the Nearbyy platform in any language.

## Creating a new project

Open the [Nearbyy Dashboard](https://nearbyy.com/dashboard) and click on the **New Project** button. You will be asked to enter a name for your project. Enter a name and click on **Create**.

## Authenticating requests

All of the endpoints on the Nearbyy API rely on a Bearer token for authentication. Your bearer token is your API key. This is an example of how the authorization header should look like:

```
Authorization: Bearer YOUR_API_KEY
```

## Uploading a file

To upload a file, you need to send a `POST` request to the `/api/files` endpoint. The request body should be a JSON object with the following fields:

```json title="Request body"
{
  "fileUrl": "https://example.com/file.txt"
}
```

If the request is successful, you will receive a `200` http status code. The response body is empty for now. We will add more fields to the response body in the near future.

## Semantic search

To perform a semantic search, you need to send a `GET` request to the `/api/files` endpoint. The request should contain the following query parameters:

- `query`: The query to search for.
- `limit?`: The maximum number of results to return. (_between 1 and 100, default is 10_)

If the request is successful, you will receive a `200` http status code. The response body will be a JSON object of type [`FileSearchClientResponse[]`](../../typescript-sdk/file-search-client-response) with the following fields:

```json title="Response body"
[
  {
    "id": 1, // number
    "text": "The Great Wall in China...", // string
    "type": "markdown", // string
    "url": "https://example.com/china-wall.md", // string
    "_extras": {
      "distance": 0.57123, // number
      "projectid": "project-123" // string
    }
  }
  // ...
]
```
