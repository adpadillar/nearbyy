import { NearbyyClient } from "@nearbyy/core";

// Create a new NearbyyClient instance
const client = new NearbyyClient({
  API_KEY: "YOUR_API_KEY",
});

// Upload a file
await client.uploadFile({
  fileUrl: "https://example.com/image.jpg",
});

// Query for similar text
await client.queryDatabase({
  query: "This is some cool text",
});
