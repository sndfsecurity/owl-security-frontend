import API_BASE_URL from "./api";

export async function uploadImages(files: File[]) {

  const token = localStorage.getItem("token");

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    `${API_BASE_URL}/api/upload/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload images");
  }

  return response.json();
}


export async function uploadVideo(file: File) {

  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/upload/video`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload video");
  }

  return response.text();
}