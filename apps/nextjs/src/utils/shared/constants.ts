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
};

export const ALLOWED_EXTENSIONS = Object.keys(MIME_TYPES);

export const FILE_QUOTA = 250; // temporary value for testing
export const FILE_UPLOAD_URL_TTL = 60 * 60 * 1000;
