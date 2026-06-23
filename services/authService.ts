import API_BASE_URL from "./api";

// export async function login(
//   email: string,
//   password: string
// ) {
//   const response = await fetch(
//     `${API_BASE_URL}/auth/login`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     }
//   );

//   return response.json();
// }

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("User Registration Failed");
  }

  return response.json();
}



console.log("API URL =", API_BASE_URL);

export async function login(
  email: string,
  password: string
) {

  console.log("calling login");

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  console.log(response);

  return response.json();
}