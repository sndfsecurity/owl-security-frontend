"use client";

import { useState } from "react";
import { login } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

    const response = await login(email, password);

    console.log("LOGIN RESPONSE:", response);

    if (!response.token) {
      setError(response.message || "Invalid Email or Password");
      return;
    }

    localStorage.setItem("token", response.token);
    localStorage.setItem("role", response.role);
    localStorage.setItem("name", response.name);
    localStorage.setItem("userId",response.userId);
    localStorage.setItem("email", email);
    

   if (response.role === "ADMIN") {
  console.log("ADMIN LOGIN SUCCESS");
  window.location.href = "/dashboard";
}

if (response.role === "CLIENT") {
  console.log("CLIENT LOGIN SUCCESS");
  window.location.href = "/client/dashboard";
}

    } catch (err) {
      setError("Invalid Email or Password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#1f2937",
          }}
        >
          Owl Security Portal
        </h1>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </div>
    </div>
  );
}