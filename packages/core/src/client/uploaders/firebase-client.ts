import type { FirebaseStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import type { FileUploader } from ".";

export class FirebaseClientAdapter implements FileUploader {
  db: FirebaseStorage;

  constructor(db: FirebaseStorage) {
    this.db = db;
  }

  async upload(files: File[]): Promise<string[]> {
    const promiseArray = files.map(async (file) => {
      const storageRef = ref(this.db, file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    });

    return await Promise.all(promiseArray);
  }
}
