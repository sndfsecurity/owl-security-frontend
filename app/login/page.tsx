// app/login/page.tsx
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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Decorative gradient orb */}
        <div className={styles.glowOrb}></div>
        <div className={styles.glowOrb2}></div>

        <div className={styles.logoWrapper}>
          <Image
            src="/LOGO.png"
            alt="OWL Security"
            width={80}
            height={80}
            className={styles.logo}
          />
        </div>

        <h1 className={styles.title}>OWL SECURITY PORTAL</h1>
        <p className={styles.subtitle}>CCTV Live Monitoring & Surveillance</p>

        <div className={styles.divider}></div>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email ID</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="admin@owl.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={styles.loginBtn}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Authenticating...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                Login
              </>
            )}
          </button>
        </div>

        <div className={styles.bottomSection}>
          <p>🔒 Secure Access • Real-Time Monitoring</p>
          <span className={styles.version}>OWL Security Portal v1.0</span>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 Owl Security Services
      </div>
    </div>
  );
}