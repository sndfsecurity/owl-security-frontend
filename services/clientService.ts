import API_BASE_URL from "./api";

export async function getClients() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }

  return response.json();
}

export async function createClient(clientData: any) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create client");
  }

  return response.json();
}

export async function updateClient(
  id: number,
  clientData: any
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update client");
  }

  return response.json();
}


export async function deleteClient(
  id: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.text();
}


export async function getClientById(
  id: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch client");
  }

  return response.json();
}


export async function getClientByUserId(
  userId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients/user/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch client");
  }

  return response.json();
}


export async function updateClientProfile(
  id: number,
  clientData: any
) {

  const token =
    localStorage.getItem("token");

  const response =
    await fetch(
      `${API_BASE_URL}/api/clients/profile/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify(clientData),
      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed to update profile"
    );

  }

  return response.json();
}