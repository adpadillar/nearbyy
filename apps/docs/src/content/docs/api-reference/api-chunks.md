---
title: Chunks endpoint
description: API /chunks endpoint
sidebar:
  order: 4
---

- Endpoints: `https://nearbyy.com/api/chunks`
- Methods: `GET`

## Get chunks

Retrieves chunks from the Nearbyy platform in a semanic search.

### Request

- Method: `GET`
- Endpoint: `https://nearbyy.com/api/chunks`

### Query Parameters

[`ChunkEndpointGetParams`](../types#chunkendpointgetparams)

- `query`: The term or phrase to search for.
- `limit`: The maximum number of chunks to return (between 1 and 100).

```json "query" "limit" title="Query Parameters"
?query=value&limit=number
```

### Response

[`ChunkEndpointGetResponse`](../types#chunkendpointgetresponse)

- `data.items`: The chunks that were found.
