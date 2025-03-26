"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  role: "ADMIN" | "USER";
  orderedFoods: string[];
  isVerified: boolean;
  createdAt?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState<boolean>(false); // Toggle visibility

  // Fetch logged-in user data from localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing user data:", err);
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  // Function to fetch all users with pagination
  const fetchAllUsers = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:5000/auth/users?page=${page}&limit=10`;
      console.log("Request URL:", url);
      const response = await axios.get(url);
      console.log("Response data:", response.data);
      setAllUsers(response.data.users);
      setPagination(response.data.pagination);
      setShowUsers(true); // Show users when fetched
    } catch (err: any) {
      console.error(
        "Fetch all users error:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch users. Please try again.";
      setError(errorMessage);
      setAllUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to close the users list
  const closeUsersList = () => {
    setShowUsers(false);
    setAllUsers([]);
    setPagination(null);
  };

  // Pagination navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchAllUsers(page);
    }
  };

  const food = () => router.push("/food");
  const order = () => router.push("/order");
  const profile = () => router.push("/dashboard/profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[100px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <div
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={profile}
        >
          <span className="text-xl font-bold text-white">
            {user?.name?.[0] || "U"}
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[100px] p-6">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">User Information</h1>
        </header>

        {/* Button to Fetch All Users */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => fetchAllUsers(1)} // Start at page 1
            className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            Show All Users
          </button>
        </div>

        {/* Users List with Pagination and Close Button */}
        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {showUsers && allUsers.length > 0 && (
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">All Users</h2>
              <button
                onClick={closeUsersList}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
              {allUsers.map((user) => (
                <li
                  key={user._id}
                  className="p-4 bg-gray-700 rounded-lg flex flex-col space-y-2"
                >
                  <p>
                    <strong>Name:</strong> {user.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
                  </p>
                  {user.phoneNumber && (
                    <p>
                      <strong>Phone:</strong> {user.phoneNumber}
                    </p>
                  )}
                  {user.orderedFoods.length > 0 && (
                    <p>
                      <strong>Ordered Foods:</strong>{" "}
                      {user.orderedFoods.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {pagination && (
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full disabled:bg-gray-600 hover:bg-orange-600 transition-all duration-300"
                >
                  Previous
                </button>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalUsers} total users)
                </span>
                <button
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full disabled:bg-gray-600 hover:bg-orange-600 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Section */}
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-4xl text-center space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Admin <span className="text-orange-500">Dashboard</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Manage foods and orders efficiently from your admin panel.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={food}
                className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
              >
                Manage Foods
              </button>
              <button
                onClick={order}
                className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
              >
                Manage Orders
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
