export const MIME_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  md: "text/markdown",
  html: "text/html",
  mp3: "audio/mpeg",
  jpg: "image/jpeg",
  png: "image/png",
  jpeg: "image/jpeg",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export const ALLOWED_EXTENSIONS = Object.keys(MIME_TYPES);

export const FILE_QUOTA = 250; // temporary value for testing
export const FILE_UPLOAD_URL_TTL = 60 * 60 * 1000;

export const ONE_MB = 1024 * 1024;
export const MAX_FILE_SIZE = 20 * ONE_MB;
