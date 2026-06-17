"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "@/services/authService";
import styles from "./login.module.css";

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

      if (!response.token) {
        setError(response.message || "Invalid Email or Password");
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("name", response.name);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("email", email);

      if (response.role === "ADMIN") {
        window.location.href = "/dashboard";
      }

      if (response.role === "CLIENT") {
        window.location.href = "/client/dashboard";
      }
    } catch {
      setError("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Image
          src="/LOGO.png"
          alt="OWL"
          width={95}
          height={95}
          className={styles.logo}
        />

        <h1>OWL SECURITY PORTAL</h1>

        <p className={styles.subtitle}>
          CCTV Live Monitoring & Surveillance
        </p>

        <div className={styles.form}>
          <label>Email ID</label>

          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
              onClick={handleLogin}
              disabled={loading}
              className={styles.loginBtn}>

              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  ⏳ Please Wait...
                </>
              ) : (
                "Login"
              )}
            </button>

        </div>

       <div className={styles.bottomSection}>
          <p>Secure Access • Real-Time Monitoring</p>

          <span className={styles.version}>
            OWL Security Portal v1.0
          </span>
        </div>
      </div>

       <div className={styles.copyright}>
        © 2026 Owl Security Services
      </div>

    </div>
  );
}