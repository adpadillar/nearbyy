export interface FileUploader {
  upload(files: File[]): Promise<string[]>;
}
