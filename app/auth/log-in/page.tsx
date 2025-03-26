"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

  // Left half background images
  const leftBackgroundImages = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=3571&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2R8ZW58MHx8MHx8fDA%3D",
  ];

  // Right half background images
  const rightBackgroundImages = [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1624726175512-19b9baf9fbd1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHN8ZW58MHx8MHx8fDA%3D",
  ];

  // Auto-swipe for left half
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex(
        (prevIndex) => (prevIndex + 1) % leftBackgroundImages.length
      );
    }, 5000); // 2 seconds
    return () => clearInterval(interval);
  }, [leftBackgroundImages.length]);

  // Auto-swipe for right half
  useEffect(() => {
    const interval = setInterval(() => {
      setRightImageIndex(
        (prevIndex) => (prevIndex + 1) % rightBackgroundImages.length
      );
    }, 5000); // 2 seconds
    return () => clearInterval(interval);
  }, [rightBackgroundImages.length]);

  const handleLogin = async () => {
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        setTimeout(() => {
          router.push(`/dashboard?userId=${data.user._id}`);
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };
 const back = () => router.push("/");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Left Half: Form with Slideshow Background */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Left Slideshow */}
        <div className="absolute inset-0">
          {leftBackgroundImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Left Slideshow Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === leftImageIndex ? "opacity-70" : "opacity-0"
              }`}
            />
          ))}
        </div>
        {/* Form Card */}
        <div className="relative z-10 max-w-md w-full bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-700/50">
          <button 
          className="h-[20px] w-[20px] bg-[gray] flex justify-center items-center rounded-4xl"
          onClick={back}>
            +
          </button>
          <h1 className="text-4xl font-extrabold text-center text-orange-400 mb-6">
            Log In
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
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full p-3 rounded-full text-white font-semibold bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
            >
              Log In
            </button>
          </div>

          {message && (
            <p className="mt-4 text-green-400 text-center">{message}</p>
          )}
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </div>
      </div>

      {/* Right Half: Slideshow Background */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        {/* Right Slideshow */}
        <div className="absolute inset-0">
          {rightBackgroundImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Right Slideshow Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                index === rightImageIndex ? "opacity-70" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 to-transparent" />
      </div>
    </div>
  );
}
