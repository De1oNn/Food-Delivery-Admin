"use client";

import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const AdminNotification = () => {
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get<{ notifications: Notification[] }>(
        "https://food-delivery-back-end-three.vercel.app/notif"
      );
      setNotifications(res.data.notifications || []);
    } catch (error) {}
  };

  const createNotification = async () => {
    if (!notifMessage.trim()) {
      alert("Please enter a notification message");
      return;
    }
    try {
<<<<<<< HEAD
      const response = await axios.post("https://food-delivery-back-end-three.vercel.app/notif", {
        notif: notifMessage,
      });
=======
      const response = await axios.post(
        "https://food-delivery-back-end-three.vercel.app/notif",
        {
          notif: notifMessage,
        }
      );
>>>>>>> 8507a1fd3a2e0c822a02f4a50d2a50c02e95ea54
      alert(response.data.message || "Notification sent");
      setNotifMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Failed to create notification");
    }
  };
  const deleteNotification = async (id: string) => {
    try {
<<<<<<< HEAD
      const response = await axios.delete(`https://food-delivery-back-end-three.vercel.app/notif/${id}`);
=======
      const response = await axios.delete(
        `https://food-delivery-back-end-three.vercel.app/notif/${id}`
      );
>>>>>>> 8507a1fd3a2e0c822a02f4a50d2a50c02e95ea54
      alert(response.data.message || "Notification deleted");
      fetchNotifications();
    } catch (error) {
      alert("Failed to delete notification");
    }
  };

  return (
    <div >
        <Bell
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={() => {
            setIsNotifModalOpen(true);
            fetchNotifications();
          }}
        />

      {/* Notification Modal */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">
              Create Notification
            </h2>
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
    </div>
  );
};

export default AdminNotification;
