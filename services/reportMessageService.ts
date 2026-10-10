
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ReportMessage {
  id: number;
  reportId: number;
  clientId: number;
  senderUserId: number;
  senderRole: "ADMIN" | "CLIENT";
  message: string;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getReportMessages(
  reportId: number
): Promise<ReportMessage[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/reports/${reportId}/messages`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load report messages");
  }

  return response.json();
}

export async function sendReportMessage(
  reportId: number,
  message: string
): Promise<ReportMessage> {
  const response = await fetch(
    `${API_BASE_URL}/api/reports/${reportId}/messages`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to send report message"
    );
  }

  return response.json();
}
