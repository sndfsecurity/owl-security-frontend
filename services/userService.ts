import API_BASE_URL from "./api";

export async function resetPassword(
  userId: number,
  password: string
) {

  const token =
    localStorage.getItem("token");

  const response =
    await fetch(
      `${API_BASE_URL}/api/users/${userId}/reset-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: password,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to reset password"
    );
  }

  return response.text();
}