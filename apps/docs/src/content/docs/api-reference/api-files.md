---
title: Files endpoint
description: API /files endpoint
sidebar:
  order: 3
---

- Endpoints: `https://nearbyy.com/api/files`, `https://nearbyy.com/api/files/get-upload-url`
- Methods: `POST`, `DELETE`

## Upload files

Uploads files to the Nearbyy platform.

### Request

- Method: `POST`
- Endpoint: `https://nearbyy.com/api/files`

### Body

[`FileEndpointPostBody`](../types#fileendpointpostbody)

```json title="Request Body"
{
  "fileUrls": ["https://example.com/file.txt"],
  "tag": "tagname"
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

## Get upload URL

Returns a pre-signed URL for uploading a file to the Nearbyy platform.

### Request

- Method: `GET`
- Endpoint: `https://nearbyy.com/api/files/get-upload-url`

### Query parameters

[`GetUploadUrlEndpointGetParams`](../types#getuploadurlendpointgetparams)

- `contentType`: The content type of the file.

```json "contentType" title="Query Parameters"
?contentType=text/plain
```

### Response

[`GetUploadUrlEndpointGetResponse`](../types#getuploadurlendpointgetresponse)

- `data.uploadUrl`: The pre-signed URL for uploading the file.
- `data.fileId`: The ID of the file.
- `data.fields`: The fields required to upload the file.

  ```json title="Response Body"
  {
    "data": {
      "uploadUrl": "https://nearbyy.com/upload",
      "fileId": "file-id-1",
      "fields": {
        "key": "file-id-1",
        "Content-Type": "text/plain",
        "x-amz-meta-userid": "user-id-1"
      }
    },
    "success": true,
    "error": null
  }
  ```
