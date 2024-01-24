---
title: Authentication
description: API Authentication
sidebar:
  order: 2
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

All requests to the Nearbyy API must be authenticated using an API key. You can get your API key from the [Nearbyy Dashboard](https://nearbyy.com/dashboard).

The API key must be sent in the `Authorization` header of the request. The header should look like this:

```
Authorization: Bearer YOUR_API_KEY
```