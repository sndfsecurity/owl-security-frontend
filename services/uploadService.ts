import API_BASE_URL from "./api";

export async function uploadImage(
  file: File
) {
  const token =
    localStorage.getItem("token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/upload`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to upload image"
    );
  }

  return response.text();
}