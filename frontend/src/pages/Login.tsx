import React, { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login({ onSuccess, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(API + "/api/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onSuccess({ token, user });
    } catch (err) {
      setError("Invalid credentials — try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071229]">
      <div className="bg-slate-800/60 p-10 rounded-xl w-[420px] text-slate-100">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            placeholder="Email"
            type="email"
            className="p-3 rounded-md bg-slate-900/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="p-3 rounded-md bg-slate-900/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn w-full mt-2" type="submit">
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm opacity-70">
          Don't have an account?{" "}
          <button onClick={switchToRegister} className="underline text-cyan-300">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
