"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setMessage("");
    setError("");

    const response = await fetch("http://localhost:5000/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setError(data.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <div className="absolute -top-2 left-2 w-full h-full bg-white/10 rounded-3xl shadow-lg blur-md"></div>

        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
          Create Account
        </h1>
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">
              Password!
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full p-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform active:scale-95 transition-all duration-300 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-purple-700"
          >
            Sign Up
          </button>
        </div>
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md h-12 w-24 font-semibold hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 shadow-md"
            onClick={() => router.push("/log-in")}
          >
            Log-in
        </button>

        {message && (
          <p className="mt-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}