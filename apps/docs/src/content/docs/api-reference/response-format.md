---
title: Response format
description: Response format
sidebar:
  order: 2
---

All of the API responses are in JSON format, and they follow a common structure. The response body contains the following fields:

```ts
{
  "success": boolean,
  "error": string | null,
  "data": any // determined by the endpoint
}
```

To understand what the `data` field contains for a specific endpoint, refer to the documentation for that endpoint.
