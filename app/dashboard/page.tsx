"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminRestaurant from "../_components/admin/adminRestaurant";
import AdminNotification from "../_components/admin/adminNotification";
import AdminUserList from "../_components/admin/adminUserList";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

  const profile = () => router.push("/dashboard/profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      <aside className="fixed top-0 left-0 h-full w-20 bg-orange-600 flex flex-col items-center py-6 space-y-6 z-10">
        <div
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={profile}
          title="Profile"
        >
          <span className="text-xl font-bold text-white">
            {user?.name?.[0] || "U"}
          </span>
        </div>
        <AdminNotification />
        <AdminRestaurant />
      </aside>
      <div className="flex-1 ml-[100px] p-6">
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">User Information</h1>
        </header>
          <AdminUserList/>
      </div>
    </div>
  );
}
