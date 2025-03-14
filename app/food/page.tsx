
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define interfaces
interface FoodFormData {
  foodName: string;
  price: string;
  image: string;
  ingredients: string;
  category: string;
}

interface FoodItem {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string[];
  category: string;
}

export default function Food() {
  const router = useRouter();
  const [formData, setFormData] = useState<FoodFormData>({
    foodName: "",
    price: "",
    image: "",
    ingredients: "",
    category: "",
  });
  const [createdFood, setCreatedFood] = useState<FoodItem | null>(null); // Store the newly created food
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateField = (field: keyof FoodFormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    setCreatedFood(null); // Clear previous created food

    try {
        const requestBody = {
        foodName: formData.foodName,
        price: parseFloat(formData.price),
        image: formData.image,
        ingredients: formData.ingredients,
        category: formData.category,
        };
      console.log("Request Body:", requestBody);

      const response = await fetch("http://localhost:5000/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setMessage("Food created successfully!");
        setCreatedFood(data.food); // Set the created food from response
        setFormData({
          foodName: "",
          price: "",
          image: "",
          ingredients: "",
          category: "",
        });
      } else {
        setError(data.message || "Failed to create food");
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

  const back = () => {
    router.push("/dashboard");
  };
  const foods = () => {
    router.push("/foods")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <button
          onClick={back}
          className="absolute top-4 left-4 bg-white h-6 w-6 rounded-full flex items-center justify-center text-black font-bold"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Food
        </h1>
        <button className="bg-[red] h-[50px] w-[100px] rounded-3xl m-[2px]" 
        onClick={foods}>
            Foods
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={formData.foodName}
              onChange={(e) => updateField("foodName")(e.target.value)}
              placeholder="Food Name"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => updateField("price")(e.target.value)}
              placeholder="Price"
              step="0.01"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => updateField("image")(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => updateField("ingredients")(e.target.value)}
              placeholder="Ingredients (comma-separated)"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => updateField("category")(e.target.value)}
              placeholder="Category"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Food"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {/* Display the created food */}
        {createdFood && (
          <div className="mt-8 p-4 bg-gray-800 rounded-xl text-white shadow-md">
            <h2 className="text-2xl font-bold mb-2">Created Food</h2>
            <p>
              <strong>Name:</strong> {createdFood.foodName}
            </p>
            <p>
              <strong>Price:</strong> ${createdFood.price.toFixed(2)}
            </p>
            {createdFood.image && (
              <img
                src={createdFood.image}
                alt={createdFood.foodName}
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
            <p>
              <strong>Ingredients:</strong>{" "}
              {Array.isArray(createdFood.ingredients)
                ? createdFood.ingredients.join(", ")
                : createdFood.ingredients || "None"}
            </p>
            <p>
              <strong>Category:</strong> {createdFood.category}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}