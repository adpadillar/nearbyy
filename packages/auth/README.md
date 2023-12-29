# @nearbyy/auth

This is the authentication service for the Nearbyy app. It is responsible for both user authentication with Clerk, and for authorizing requests to the Nearbyy API.

## Development

If you are using NextJS, please add this to your `next.config.js` file:

```js
transpilePackages: ['@nearbyy/auth'],
```

This enables hot reloading for local packages without a build step. After adding this, you can just run `next dev` in your app, and use it like so:

```js
import { withKeyAuth } from "@nearbyy/auth";

export const GET = withKeyAuth(
  async (req, res) => {
    // ...
  },
  {
    bodyValidator: z.object({
      // ...
    }),
  },
);
```
