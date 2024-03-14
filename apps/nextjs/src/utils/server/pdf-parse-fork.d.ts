declare module "pdf-parse-fork" {
  export = PdfParse;

  declare function PdfParse(
    dataBuffer: Buffer,
    options?: PdfParse.Options,
  ): Promise<PdfParse.Result>;

  declare namespace PdfParse {
    type Version =
      | "default"
      | "v1.9.426"
      | "v1.10.100"
      | "v1.10.88"
      | "v2.0.550";
    interface Result {
      numpages: number;
      numrender: number;
      info: unknown;
      metadata: unknown;
      version: Version;
      text: string;
    }
    interface Options {
      pagerender?: ((pageData: unknown) => string) | undefined;
      max?: number | undefined;
      version?: Version | undefined;
    }
  }
}