---
title: Types
description: The API Types
sidebar:
  order: 4
---

## Chunks

### ChunkEndpointGetParams

```typescript title="ChunkEndpointGetParams.ts"
type ChunkEndpointGetParams = {
  limit: number;
  query: string;
};
```

### ChunkEndpointGetResponse

```typescript title="ChunkEndpointGetResponse.ts"
type ChunkEndpointGetResponse =
  | {
      error: null;
      data: {
        items: {
          order: number;
          tokenLength: number;
          text: string;
          _extras: {
            fileId: string;
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

## Files

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

### GetUploadUrlEndpointGetParams

```typescript title="GetUploadUrlEndpointGetParams.ts"
type GetUploadUrlEndpointGetParams = {
  contentType: string;
};
```

### GetUploadUrlEndpointGetResponse

```typescript title="GetUploadUrlEndpointGetResponse.ts"
type GetUploadUrlEndpointGetResponse =
  | {
      error: null;
      data: {
        uploadUrl: string;
        fileId: string;
        fields: Record<string, string>;
      };
      success: true;
    }
  | {
      error: string;
      data: null;
      success: false;
    };
```
