"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminUserList = () => {
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
      const response = await axios.get(
        `https://food-delivery-back-end-three.vercel.app/auth/users?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAllUsers(response.data.users || []);
      setPagination(response.data.pagination || null);
      setShowUsers(true);
    } catch (err: any) {
      console.error(
        "Fetch all users error:",
        err.response?.data || err.message
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      <div className="flex-1  p-6">
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
              Manage foods, orders, and restaurants efficiently from your admin
              panel.
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
                      <strong>Verified:</strong>{" "}
                      {user.isVerified ? "Yes" : "No"}
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
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
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
export default AdminUserList;