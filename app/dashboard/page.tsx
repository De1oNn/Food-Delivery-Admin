"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  address?: string;
  role: "ADMIN" | "USER";
  orderedFoods: string[];
  isVerified: boolean;
  profilePicture?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");


  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);

  
  const food = () => router.push("/food");
  const order = () => router.push("/order");
  const profile = () => router.push("/dashboard/profile");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[100px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <div
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={profile}
        >
          <span className="text-xl font-bold text-white">
            {user?.name?.[0] || "U"}
          </span>
        </div>
        {/* Removed Bell and ShoppingCart */}
      </aside>

      {/* Main Content */}
      <div className="ml-[100px] p-6">
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <div className="relative flex items-center w-full max-w-md">
            <input
              placeholder="Search users by name or email..."
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-12 px-5 pr-10 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <svg
              className="absolute right-3 w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          
            <div className="w-full max-w-4xl">
              <h1 className="text-3xl font-bold text-center mb-8">
                Admin Dashboard
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button
                  onClick={food}
                  className="group relative flex items-center justify-center h-16 bg-white text-black rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <span className="text-lg">Food</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"></span>
                </button>
                <button
                  onClick={order}
                  className="group relative flex items-center justify-center h-16 bg-white text-black rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <span className="text-lg">Orders</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-500 transition-all duration-300"></span>
                </button>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
