"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import face from "../../public/steve-johnson-okD3TQxIXxw-unsplash.jpg";

export default function FaceAddress() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () => {
    setCurrentSection((prev) => (prev === 2 ? 0 : prev + 1));
  };
  const handleBack = () => {
    setCurrentSection((prev) => (prev === 0 ? 2 : prev - 1));
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#8c4e18] via-[#ac6120] to-[#d9772e] h-screen w-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={face}
          layout="fill"
          objectFit="cover"
          alt="Abstract Background"
          className="opacity-70"
        />
        <div className="absolute inset-0 bg-black/30"></div> {/* Overlay */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[400px] bg-[rgba(197,195,195,0.4)] backdrop-blur-md rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-[0_0_40px_rgba(0,0,0,0.3)] p-8">
        {/* Section 1 */}
        {currentSection === 0 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1
              className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
                bg-clip-text bg-gradient-to-r from-white to-[#d9772e] animate-pulse"
            >
              Welcome To The Team!
            </h1>
            <p className="text-gray-200">
              Join a crew passionate about delivering great experiences.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
            </div>
            <button
              className="w-full py-3 bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-lg 
                hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transform-gpu transition-all duration-300 
                shadow-[0_0_15px_rgba(217,119,46,0.5)] hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* Section 2 */}
        {currentSection === 1 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1
              className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
                bg-clip-text bg-gradient-to-r from-white to-[#d9772e] animate-pulse"
            >
              Make an Impact
            </h1>
            <p className="text-gray-200">
              Your work fuels our mission every day.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                  hover:scale-105 transform-gpu transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-lg 
                  hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transform-gpu transition-all duration-300 
                  shadow-[0_0_15px_rgba(217,119,46,0.5)] hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Section 3 */}
        {currentSection === 2 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1
              className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
                bg-clip-text bg-gradient-to-r from-white to-[#d9772e] animate-pulse"
            >
              Get Started Now
            </h1>
            <p className="text-gray-200">
              Sign up or log in to dive into the action.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
            </div>
            <button
              className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                hover:scale-105 transform-gpu transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
              onClick={handleBack}
            >
              Back
            </button>
            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-lg 
                  hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transform-gpu transition-all duration-300 
                  shadow-[0_0_15px_rgba(217,119,46,0.5)] hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
                onClick={() => router.push("/auth/sign-up")}
              >
                Sign Up
              </button>
              <button
                className="flex-1 py-3 bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-lg 
                  hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transform-gpu transition-all duration-300 
                  shadow-[0_0_15px_rgba(217,119,46,0.5)] hover:shadow-[0_0_25px_rgba(217,119,46,0.8)]"
                onClick={() => router.push("/auth/log-in")}
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
