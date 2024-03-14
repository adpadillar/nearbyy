declare module "pdf2json" {
  declare class PDFParser extends EventEmitter {
    constructor(context?: ImplicitAny, needRawText?: number, password?: string);
    parseBuffer(buffer: Buffer, verbosity?: number): void;
    loadPDF(pdfFilePath: string, verbosity?: number): Promise<void>;
    createParserStream(): ParserStream;
    getRawTextContent(): string;
    on<K extends keyof EventMap>(eventName: K, listener: EventMap[K]): this;
  }

  export interface EventMap {
    pdfParser_dataError: (errMsg: Record<"parserError", Error>) => void;
    pdfParser_dataReady: (pdfData: Output) => void;
    readable: (meta: Output["Meta"]) => void;
    data: (data: Output["Pages"][number] | null) => void;
  }

  declare class ParserStream {
    //TODO
  }

  export interface Output {
    Transcoder: string;
    Meta: Record<string, ImplicitAny>;
    Pages: Page[];
  }

  export declare interface Page {
    Width: number;
    Height: number;
    HLines: Line[];
    VLines: Line[];
    Fills: Fill[];
    Texts: Text[];
    Fields: Field[];
    Boxsets: Boxset[];
  }

  export declare interface Fill {
    x: number;
    y: number;
    w: number;
    h: number;
    oc?: string;
    clr?: number;
  }

  export declare interface Line {
    x: number;
    y: number;
    w: number;
    l: number;
    oc?: string;
    clr?: number;
  }

  export declare interface Text {
    x: number;
    y: number;
    w: number;
    sw: number;
    A: "left" | "center" | "right";
    R: TextRun[];
    oc?: string;
    clr?: number;
  }

  export declare interface TextRun {
    T: string;
    S: number;
    TS: [number, number, 0 | 1, 0 | 1];
    RA?: number;
  }

  export declare interface Boxset {
    boxes: Box[];
    id: {
      Id: string;
      EN?: number;
    };
  }

  export declare interface Field {
    id: {
      Id: string;
      EN?: number;
    };
    style: number;
    TI: number;
    AM: number;
    TU: string;
    x: number;
    y: number;
    w: number;
    h: number;
    T: {
      Name: "alpha" | "link";
      TypeInfo: object;
    };
  }

  export declare interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
    oc?: string;
    clr?: number;
  }

  export declare interface Box {
    id: {
      Id: string;
      EN?: number;
    };
    T: {
      Name: string;
      TypeInfo?: object;
    };
    x: number;
    y: number;
    w: number;
    h: number;
    TI: number;
    AM: number;
    checked?: boolean;
    style: number;
  }

  export default PDFParser;
}
