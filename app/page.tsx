// "use client";

// import { useRouter } from "next/navigation";

// export default function Page() {
//   const router = useRouter();

//   return (
//     <div className="h-screen w-screen flex justify-center items-center gap-4">
//       <button 
//         className="border-2 bg-white text-black rounded-md h-12 w-24"
//         onClick={() => router.push("/sign-up")}>
//         Sign-up
//       </button>
      
//       <button 
//         className="border-2 bg-white text-black rounded-md h-12 w-24"
//         onClick={() => router.push("/log-in")}>
//         Log-in
//       </button>
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function Page() {
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () => {
    // Move to the next section, loop back to 0 if at the end
    setCurrentSection((prev) => (prev === 2 ? 0 : prev + 1));
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      {/* Section 1 */}
      {currentSection === 0 && (
        <div className="bg-blue-200 p-8 rounded-lg text-center">
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
        <div className="bg-green-200 p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold">Section 2</h1>
          <p>This is the second section.</p>
          <button
        className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
        onClick={handleNext}
      >
        Next
      </button>
        </div>
      )}

      {/* Section 3 */}
      {currentSection === 2 && (
        <div className="bg-yellow-200 p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold">Section 3</h1>
          <p>This is the third section.</p>
          <button
        className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
        onClick={handleNext}
      >
        Next
      </button>
        </div>
      )}

      {/* Next Button */}
    </div>
  );
}
