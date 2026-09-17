export function getProfile() {

  return {

    name: localStorage.getItem("name"),

    email: localStorage.getItem("email"),

    role: localStorage.getItem("role"),

    createdAt: localStorage.getItem("createdAt"),

    lastLogin: localStorage.getItem("lastLogin"),
    
  };

}