"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of a food item
interface FoodItem {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string[] | string; // Allow string as fallback
  category: string | { _id: string; name: string }; // Handle populated category
}

export default function Foods() {
  const router = useRouter();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch foods on mount
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setError("");
        const response = await fetch("http://localhost:5000/food", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
          if (Array.isArray(data)) {
            // Normalize ingredients to always be an array
            const normalizedFoods = data.map((food) => ({
              ...food,
              ingredients: Array.isArray(food.ingredients)
                ? food.ingredients
                : typeof food.ingredients === "string"
                ? food.ingredients.split(",").map((item: string) => item.trim())
                : [],
            }));
            setFoods(normalizedFoods);
          } else {
            setError("Unexpected response format: Data is not an array");
          }
        } else {
          setError(data.message || "Failed to fetch foods");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          `Network error: ${err instanceof Error ? err.message : "Unknown"}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const back = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative max-w-2xl w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <button
          onClick={back}
          className="absolute top-4 left-4 bg-white h-6 w-6 rounded-full flex items-center justify-center text-black font-bold"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          All Foods
        </h1>

        {isLoading ? (
          <p className="text-white text-center">Loading foods...</p>
        ) : error ? (
          <p className="mt-4 text-red-400 text-center">{error}</p>
        ) : foods.length === 0 ? (
          <p className="text-white text-center">No foods found.</p>
        ) : (
          <div className="space-y-4">
            {foods.map((food) => (
              <div
                key={food._id}
                className="p-4 bg-gray-800 rounded-xl text-white shadow-md"
              >
                <h2 className="text-lg font-semibold">{food.foodName}</h2>
                <p>Price: ${food.price.toFixed(2)}</p>
                {food.image && (
                  <img
                    src={food.image}
                    alt={food.foodName}
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
                <p>
                  Ingredients:{" "}
                  {Array.isArray(food.ingredients)
                    ? food.ingredients.join(", ")
                    : food.ingredients || "None"}
                </p>
                <p>
                  Category:{" "}
                  {typeof food.category === "string"
                    ? food.category
                    : food.category?.name || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
