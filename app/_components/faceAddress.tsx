"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import face from "../../public/steve-johnson-okD3TQxIXxw-unsplash.jpg";

export default function FaceAddress() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#8c4e18] via-[#ac6120] to-[#d9772e] h-screen w-screen">
      <div className="w-screen h-screen relative">
        <Image src={face} layout="fill" objectFit="cover" alt="face" />
      </div>
      <div
        className="text-center absolute h-[50%] w-[30%] 
        bg-[rgba(197,195,195,0.4)] backdrop-blur-md 
        rounded-2xl border border-[rgba(255,255,255,0.1)] 
        shadow-[0_0_40px_rgba(0,0,0,0.3)] flex justify-center items-center flex-col"
      >
        <h1
          className="text-4xl font-extrabold text-white 
      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-6 
      bg-clip-text bg-gradient-to-r from-white to-[#d9772e] 
      animate-pulse"
        >
          Welcome To The Team!
        </h1>
        <button
          className="border-2 border-[#d9772e] 
        bg-gradient-to-r from-[#ac6120] to-[#d9772e] 
        text-white rounded-full px-8 py-3 m-2
        hover:from-[#8c4e18] hover:to-[#ac6120] 
        hover:scale-110 transform-gpu 
        transition-all duration-300 
        shadow-[0_0_15px_rgba(217,119,46,0.5)]
        hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
          onClick={() => router.push("/auth/sign-up")}
        >
          Sign Up
        </button>
        <button
          className="border-2 border-[#d9772e] 
        bg-gradient-to-r from-[#ac6120] to-[#d9772e] 
        text-white rounded-full px-8 py-3 m-2
        hover:from-[#8c4e18] hover:to-[#ac6120] 
        hover:scale-110 transform-gpu 
        transition-all duration-300 
        shadow-[0_0_15px_rgba(217,119,46,0.5)]
        hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
          onClick={() => router.push("/auth/log-in")}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
