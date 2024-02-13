export interface FileSearchClientResponse {
  id: string;
  text: string;
  type: string;
  url: string;
  _extras: {
    distance?: number;
    projectid: string;
  };
}

export type FileEndpointPostResponse =
  | {
      success: true;
      error: null;
      ids: string[];
      rejectedUrls?: undefined;
    }
  | {
      success: false;
      error: string;
      ids: string[];
      rejectedUrls: string[];
    };
