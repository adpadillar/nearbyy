export interface FileSearchClientResponse {
  type: string;
  id: number;
  text: string;
  url: string;
  projectid: string;
  embedding: number[];
  _extras: {
    distance: number;
  };
}
