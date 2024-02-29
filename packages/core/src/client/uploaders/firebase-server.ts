import { writeFileSync } from "fs";
import type { App } from "firebase-admin/app";
import { initializeApp } from "firebase-admin";
import { cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import type { FileUploader } from ".";

export class FirebaseServerAdapter implements FileUploader {
  app: App;
  bucket: ReturnType<ReturnType<typeof getStorage>["bucket"]>;

  constructor(options: {
    credential: Record<string, string>;
    storageBucket: string;
  }) {
    this.app = initializeApp({
      credential: cert(options.credential),
      storageBucket: options.storageBucket,
    });

    this.bucket = getStorage().bucket();
  }

  async upload(files: File[]): Promise<string[]> {
    // since firebase admin sdk doesn't support file uploads, we need write
    // the file to a temp location and then upload it to the storage bucket
    const promiseArray = files.map(async (file) => {
      const tempFilePath = `/tmp/${file.name}`;
      const bytes = await file.arrayBuffer();

      // write the file to the temp location using node's fs module
      writeFileSync(tempFilePath, Buffer.from(bytes));

      // upload the file to the storage bucket
      await this.bucket.upload(tempFilePath, {
        destination: file.name,
      });

      const fileRef = this.bucket.file(file.name);

      const downloadURLs = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 30,
      });

      return downloadURLs[0];
    });

    return await Promise.all(promiseArray);
  }
}
