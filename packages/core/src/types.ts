export interface FileSearchClientResponse {
  type: string;
  id: number;
  text: string;
  url: string;
  projectid: string;
  _extras: {
    distance: number;
  };
}
