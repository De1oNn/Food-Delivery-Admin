"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added isLoading for consistency
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

  const leftBackgroundImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1504672281656-e3e7b0ae83ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1565299624946-baccd305181c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
  ];
  const rightBackgroundImages = [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1511690656952-34372de2f617?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex(
        (prevIndex) => (prevIndex + 1) % leftBackgroundImages.length
      );
    }, 2000); 
    return () => clearInterval(interval);
  }, [leftBackgroundImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRightImageIndex(
        (prevIndex) => (prevIndex + 1) % rightBackgroundImages.length
      );
    }, 2000); 
    return () => clearInterval(interval);
  }, [rightBackgroundImages.length]);

  const handleSignup = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://food-delivery-back-end-three.vercel.app/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        const userId = data.user?.id;
        if (userId) {
          setTimeout(() => {
            router.push(`/hello?userId=${userId}`);
          }, 1000);
        } else {
          setError("User ID not returned from server");
        }
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please check your backend server.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
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
              } `}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-md w-full bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-700/50">
          <h1 className="text-4xl font-extrabold text-center text-orange-400 mb-6">
            Create Account
          </h1>
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 text-white text-xl font-bold hover:text-orange-400 transition-all duration-200"
            disabled={isLoading}
          >
            X
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="space-y-6"
          >
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 rounded-full text-white font-semibold bg-orange-500 shadow-lg transform transition-all duration-300 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-600 active:scale-95 hover:shadow-orange-500/30"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-green-400 text-center">{message}</p>
          )}
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </div>
      </div>

      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          {rightBackgroundImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Right Slideshow Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
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
