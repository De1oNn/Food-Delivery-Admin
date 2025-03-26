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
  const [showUsers, setShowUsers] = useState<boolean>(false);

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

  const fetchAllUsers = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:5000/auth/users?page=${page}&limit=10`;
      const response = await axios.get(url);
      setAllUsers(response.data.users);
      setPagination(response.data.pagination);
      setShowUsers(true);
    } catch (err: any) {
      console.error("Fetch all users error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch users.");
      setAllUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const closeUsersList = () => {
    setShowUsers(false);
    setAllUsers([]);
    setPagination(null);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchAllUsers(page);
    }
  };

  const food = () => router.push("/food");
  const order = () => router.push("/order");
  const profile = () => router.push("/dashboard/profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      {/* Left Sidebar */}
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
      <div className="flex-1 ml-[100px] p-6">
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">User Information</h1>
        </header>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => fetchAllUsers(1)}
            className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            Show All Users
          </button>
        </div>

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

      {/* Right Sidebar for All Users */}
      {showUsers && (
        <aside className="fixed top-0 right-0 h-full w-[350px] bg-gray-800/90 backdrop-blur-lg shadow-lg p-6 overflow-y-auto z-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-orange-500">All Users</h2>
            <button
              onClick={closeUsersList}
              className="px-3 py-1 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all duration-300"
            >
              Close
            </button>
          </div>

          {loading && <p className="text-center text-gray-400">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && allUsers.length > 0 && (
            <>
              <ul className="space-y-4">
                {allUsers.map((user) => (
                  <li
                    key={user._id}
                    className="p-4 bg-gray-700/50 rounded-lg flex flex-col space-y-2 text-sm"
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
                        <strong>Orders:</strong> {user.orderedFoods.join(", ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination && (
                <div className="mt-6 flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => goToPage(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full disabled:bg-gray-600 hover:bg-orange-600 transition-all duration-300"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => goToPage(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full disabled:bg-gray-600 hover:bg-orange-600 transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                  <span className="text-sm text-gray-300">
                    Page {pagination.currentPage} of {pagination.totalPages} (
                    {pagination.totalUsers} users)
                  </span>
                </div>
              )}
            </>
          )}
        </aside>
      )}
    </div>
  );
}