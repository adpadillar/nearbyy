---
title: Types
description: The API Types
sidebar:
  order: 4
---

## Files

### FileEndpointGetParams

```typescript title="FileEndpointGetParams.ts"
type FileEndpointGetParams = {
  limit: number;
  query: string;
};
```

### FileEndpointGetResponse

```typescript title="FileEndpointGetResponse.ts"
type FileEndpointGetResponse =
  | {
      error: null;
      data: {
        items: {
          type: string;
          id: string;
          text: string;
          url: string;
          _extras: {
            projectid: string;
            distance?: number | undefined;
          };
        }[];
      };
      success: true;
    }
  | {
      error: string;
      data: null;
      success: false;
    };
```

### FileEndpointPostBody

```typescript title="FileEndpointPostBody.ts"
type FileEndpointPostBody = {
  fileUrls: string[];
};
```

### FileEndpointPostResponse

```typescript title="FileEndpointPostResponse.ts"
type FileEndpointPostResponse =
  | {
      error: null;
      data: {
        ids: string[];
      };
      success: true;
    }
  | {
      error: string;
      data: {
        ids: string[];
        rejectedUrls: string[];
      };
      success: false;
    };
```

### FileEndpointDeleteBody

```typescript title="FileEndpointDeleteBody.ts"
type FileEndpointDeleteBody = {
  ids: string[];
};
```

### FileEndpointDeleteResponse

```typescript title="FileEndpointDeleteParams.ts"
type FileEndpointDeleteResponse =
  | {
      error: null;
      data: {
        ids: string[];
      };
      success: true;
    }
  | {
      error: string;
      data: {
        ids: string[];
        rejectedIds: string[];
      };
      success: false;
    };
```
