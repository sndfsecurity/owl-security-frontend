import API_BASE_URL from "./api";

export async function getDashboardData() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}