
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () => {
    setCurrentSection((prev) => (prev === 2 ? 0 : prev + 1));
  };
  const handleBack = () => {
    setCurrentSection((prev) => (prev === 0 ? 2 : prev - 1));
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-[25%]">
      {/* Section 1 */}
      {currentSection === 0 && (
        <div className="bg-blue-200 p-8 rounded-lg text-center h-[50%] w-[50%]">
          <h1 className="text-2xl font-bold">Section 1</h1>
          <p>This is the first section.</p>
          <button
        className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
        onClick={handleNext}
      >
        Next
      </button>
        </div>
      )}

      {/* Section 2 */}
      {currentSection === 1 && (
        <div className="bg-green-200 p-8 rounded-lg text-center h-[50%] w-[50%] flex flex-col">
          <h1 className="text-2xl font-bold">Section 2</h1>
          <p>This is the second section.</p>
          <button
            className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
            onClick={handleNext}
          >
            Next
          </button>
            <button
              className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
              onClick={handleBack}
              >
              Back
            </button>
        </div>
      )}

      {/* Section 3 */}
      {currentSection === 2 && (
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-2xl text-center w-[50%] h-[50%] flex flex-col justify-between overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-50 animate-pulse"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Ready to Begin?
            </h1>
            <p className="text-gray-300 mt-2">
              Sign up or log in to explore the platform.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-center gap-4 z-10">
            <button
              className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-600 hover:shadow-lg transition-all duration-300"
              onClick={handleBack}
            >
              Back
            </button> 
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4 z-10">
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md h-12 w-24 font-semibold hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => router.push("/sign-up")}
            >
              Start
            </button>
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md h-12 w-24 font-semibold hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 shadow-md"
                onClick={() => router.push("/log-in")}
              >
                Log-in
            </button>                                                                                         
          </div>
        </div>
      )}

      {/* Next Button */}
    </div>
  );
}
