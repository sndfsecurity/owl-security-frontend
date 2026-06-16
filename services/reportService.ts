import API_BASE_URL from "./api";

export async function getReports() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}

export async function getReportsByClientId(
  clientId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/client/${clientId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch client reports"
    );
  }

  return response.json();
}

export async function createReport(
  reportData: any
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create report"
    );
  }

  return response.json();
}


export async function
getReportsByDate(
  reportDate: string
) {

  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/date/${reportDate}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function

getClientReportsByDate(
  clientId: number,
  reportDate: string
) {

  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/client/${clientId}/date/${reportDate}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}


export async function deleteReport(
  id: number
) {

  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed to delete report"
    );

  }

}



export async function
getReportsByDateRange(
  fromDate: string,
  toDate: string,
  clientId?: number
) {

  const token =
    localStorage.getItem(
      "token"
    );

  let url =
    `${API_BASE_URL}/api/reports/range?fromDate=${fromDate}&toDate=${toDate}`;

  if (clientId) {

    url += `&clientId=${clientId}`;

  }

  const response =
    await fetch(
      url,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}