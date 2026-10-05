import API_BASE_URL from "./api";

export async function getReports(
  page: number = 0,
  size: number = 10
) {
  const token =
    localStorage.getItem("token");

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch reports"
    );
  }

  return response.json();
}

export async function getReportsByClientId(
  clientId: number,
  page: number = 0,
  size: number = 5,
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/client/${clientId}?page=${page}&size=${size}`,
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
  reportData: any,
  pdfFile?: File | null
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [JSON.stringify(reportData)],
      { type: "application/json" }
    )
  );

  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
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
  clientId?: number,
  page: number = 0,
  size: number = 10
) {

  const token =
    localStorage.getItem(
      "token"
    );

  let url =
`${API_BASE_URL}/api/reports/range?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${size}`;

  if (clientId) {

    url += `&clientId=${clientId}`;

  }

 const response = await fetch(url,{
  headers:{
    Authorization:`Bearer ${token}`,
  },
});

if (!response.ok) {
  throw new Error(await response.text());
}

return response.json();

}

export async function getRecentReports() {

  const token =
    localStorage.getItem("token");

  const response =
    await fetch(
      `${API_BASE_URL}/api/reports/recent`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch recent reports"
    );

  }

  return response.json();
}


export async function downloadImage(imageName: string) {

  const response = await fetch(
    `${API_BASE_URL}/uploads/${imageName}`
  );

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = imageName;

  document.body.appendChild(a);

  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);

}


export async function createDraft(
  reportData: any,
  pdfFile?: File | null
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [JSON.stringify(reportData)],
      { type: "application/json" }
    )
  );

  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reports/draft`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}


export async function getDraftsByClientId(
  clientId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/client/${clientId}/drafts`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch client drafts"
    );
  }

  return response.json();
}


export async function updateDraft(
  id: number,
  reportData: any
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/draft/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function updateDraftWithPdf(
  id: number,
  reportData: any,
  pdfFile?: File | null
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [JSON.stringify(reportData)],
      { type: "application/json" }
    )
  );

  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reports/draft/${id}/save`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function submitDraft(
  id: number,
  reportData: any,
  pdfFile?: File | null
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [JSON.stringify(reportData)],
      { type: "application/json" }
    )
  );

  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reports/draft/${id}/submit`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}


export async function getSubmittedReportsByClientId(
  clientId: number,
  page: number = 0,
  size: number = 5
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/client/${clientId}/submitted?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch submitted client reports"
    );
  }

  return response.json();
}


export async function getSubmittedReports(
  page: number = 0,
  size: number = 10
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/reports/submitted?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch submitted reports"
    );
  }

  return response.json();
}

export async function getSubmittedReportsByDateRange(
  fromDate: string,
  toDate: string,
  clientId?: number,
  page: number = 0,
  size: number = 10
) {
  const token = localStorage.getItem("token");

  let url =
    `${API_BASE_URL}/api/reports/submitted/range` +
    `?fromDate=${fromDate}` +
    `&toDate=${toDate}` +
    `&page=${page}` +
    `&size=${size}`;

  if (clientId) {
    url += `&clientId=${clientId}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

