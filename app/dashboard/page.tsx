"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bell, MapPin } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState<boolean>(false);
  const [restaurantData, setRestaurantData] = useState({
    location: "",
    picture: "",
    name: "",
    information: "",
    phoneNumber: "",
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantLoading, setRestaurantLoading] = useState<boolean>(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  // Fetch user data on mount
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

  // Fetch restaurants when modal opens
  useEffect(() => {
    if (isRestaurantModalOpen) {
      fetchRestaurants();
    }
  }, [isRestaurantModalOpen]);

  // Fetch all users with pagination
  const fetchAllUsers = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/auth/users?page=${page}&limit=10`);
      setAllUsers(response.data.users || []);
      setPagination(response.data.pagination || null);
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

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get<{ notifications: Notification[] }>("http://localhost:5000/notif");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch restaurants
  const fetchRestaurants = async () => {
    setRestaurantLoading(true);
    setRestaurantError(null);
    try {
      const res = await axios.get<{ restaurants: Restaurant[] }>("http://localhost:5000/restaurant");
      setRestaurants(res.data.restaurants || []);
    } catch (error: any) {
      console.error("Fetch Restaurants Error:", error);
      setRestaurantError(error.response?.data?.message || "Failed to load restaurants.");
    } finally {
      setRestaurantLoading(false);
    }
  };

  // Create a new restaurant
  const createRestaurant = async () => {
    const { location, picture, name, information, phoneNumber } = restaurantData;
    if (!location || !picture || !name || !information || !phoneNumber) {
      alert("Please provide all required restaurant information");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/restaurant", {
        location,
        picture,
        name,
        information,
        phoneNumber: Number(phoneNumber),
      });
      alert(response.data.message || "Restaurant created successfully");
      setRestaurantData({ location: "", picture: "", name: "", information: "", phoneNumber: "" });
      fetchRestaurants();
    } catch (error: any) {
      console.error("Create Restaurant Error:", error);
      alert(error.response?.data?.message || "Failed to create restaurant");
    }
  };

  // Create a new notification
  const createNotification = async () => {
    if (!notifMessage.trim()) {
      alert("Please enter a notification message");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/notif", { notif: notifMessage });
      alert(response.data.message || "Notification sent");
      setNotifMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Failed to create notification");
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/notif/${id}`);
      alert(response.data.message || "Notification deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification");
    }
  };

  // Handle restaurant form input changes
  const handleRestaurantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  // Close the users list sidebar
  const closeUsersList = () => {
    setShowUsers(false);
    setAllUsers([]);
    setPagination(null);
  };

  // Navigate to a specific page of users
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchAllUsers(page);
    }
  };

  // Navigation functions
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
        <Bell
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={() => {
            setIsNotifModalOpen(true);
            fetchNotifications();
          }}
        />
        <MapPin
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={() => setIsRestaurantModalOpen(true)}
        />
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
              Manage foods, orders, and restaurants efficiently from your admin panel.
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
                    <p><strong>Name:</strong> {user.name || "N/A"}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                    {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
                    {user.orderedFoods.length > 0 && (
                      <p><strong>Orders:</strong> {user.orderedFoods.join(", ")}</p>
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
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full disabled:bg-gray-600 hover:bg-orange-600 transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                  <span className="text-sm text-gray-300">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} users)
                  </span>
                </div>
              )}
            </>
          )}
        </aside>
      )}

      {/* Notification Modal */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">Create Notification</h2>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder="Enter your notification message..."
              className="w-full h-32 p-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none transition-all duration-300"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsNotifModalOpen(false);
                  setNotifMessage("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={createNotification}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-orange-500/30"
              >
                Send
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                All Notifications ({notifications.length})
              </h3>
              {notifications.length === 0 ? (
                <p className="text-gray-400">No notifications yet</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="p-3 bg-gray-700/50 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="text-gray-200 text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Modal */}
      {isRestaurantModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">Add Restaurant</h2>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleRestaurantInputChange}
              placeholder="Restaurant Name"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleRestaurantInputChange}
              placeholder="Location"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <input
              type="text"
              name="picture"
              value={restaurantData.picture}
              onChange={handleRestaurantInputChange}
              placeholder="Picture URL"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <textarea
              name="information"
              value={restaurantData.information}
              onChange={handleRestaurantInputChange}
              placeholder="Information"
              className="w-full h-20 p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none transition-all duration-300"
            />
            <input
              type="number"
              name="phoneNumber"
              value={restaurantData.phoneNumber}
              onChange={handleRestaurantInputChange}
              placeholder="Phone Number"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsRestaurantModalOpen(false);
                  setRestaurantData({
                    location: "",
                    picture: "",
                    name: "",
                    information: "",
                    phoneNumber: "",
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={createRestaurant}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-orange-500/30"
              >
                Add
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                All Restaurants ({restaurants.length})
              </h3>
              {restaurantLoading && <p className="text-gray-400">Loading restaurants...</p>}
              {restaurantError && <p className="text-red-500">{restaurantError}</p>}
              {!restaurantLoading && !restaurantError && restaurants.length === 0 ? (
                <p className="text-gray-400">No restaurants yet</p>
              ) : (
                !restaurantLoading && !restaurantError && (
                  <div className="max-h-40 overflow-y-auto space-y-3">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant._id} className="p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-200 text-sm font-semibold">{restaurant.name}</p>
                        <p className="text-gray-200 text-sm">{restaurant.location}</p>
                        <p className="text-gray-200 text-sm">{restaurant.information}</p>
                        <p className="text-gray-200 text-sm">Phone: {restaurant.phoneNumber}</p>
                        <img
                          src={restaurant.picture}
                          alt={restaurant.name}
                          className="w-16 h-16 object-cover rounded-md mt-2"
                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(restaurant.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}