---
title: FileSearchClientResponse
description: FileSearchClientResponse interface
sidebar:
  order: 3
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

```ts
interface FileSearchClientResponse {
  id: number;
  text: string;
  type: string;
  url: string;
  _extras: {
    distance: number;
    projectid: string;
  };
}
```

- `id`: The ID of the file.
- `text`: The text of the file.
- `type`: The type of the file.
- `url`: The URL of the file.
- `_extras`: Extra information about the file.
  - `distance`: The distance of the file from the query.
  - `projectid`: The ID of the project the file belongs to.
