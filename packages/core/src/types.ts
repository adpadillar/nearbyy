export interface FileSearchClientResponse {
  id: number;
  text: string;
  type: string;
  url: string;
  _extras: {
    distance?: number;
    projectid: string;
  };
}
