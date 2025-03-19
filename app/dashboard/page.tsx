"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt?: string;
}

export default function Dashboard() {
  const router = useRouter();


  const food = () => {
    router.push("/food");
  };
  const order = () => {
    console.log("Navigating to /order..."); // Debug log
    router.push("/order");
  }
  const profile = () => {
    router.push("/dashboard/profile")
  }

  // Rest of your JSX remains largely the same, with minor improvements:
  return (
    <div className="min-h-screen  text-white">
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-[300px] max-w-md w-">
          <button
            onClick={food}
            className="h-[40px] w-[40px] bg-[white] rounded-2xl text-[black]"
          >
            Food
          </button>
          <button
            onClick={order}
            className="h-[40px] w-[40px] bg-[white] rounded-2xl text-[black]"
          >
            order
          </button>
          <button onClick={profile} className="bg-[black] text-white ">
            profile
          </button>
        </div>
      </div>
    </div>
  );
}
