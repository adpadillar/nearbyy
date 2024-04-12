import { useProjectId } from "~/components/ProjectIdContext";
import { api } from "~/trpc/react";

export const useS3Upload = () => {
  const { id } = useProjectId();
  const { mutateAsync } = api.files.createPresignedUrl.useMutation();

  return {
    uploadFile: async (file: File) => {
      const { fields, fileId, url } = await mutateAsync({
        projectId: id,
        contentType: file.type,
      });

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      const text = (await res.text()) as unknown;

      console.log("File uploaded successfully", text);

      return fileId;
    },
  };
};
