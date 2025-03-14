"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [formData, setFormData] = useState<FoodFormData>({
    foodName: "",
    price: "",
    image: "",
    ingredients: "",
    category: "",
  });
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateField = (field: keyof FoodFormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitForm = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create food items");
      setIsLoading(false);
      router.push("/login");
      return;
    }

    try {
      const requestBody = {
        foodName: formData.foodName,
        price: parseFloat(formData.price),
        image: formData.image,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
        category: formData.category,
      };
      console.log("Request Body:", requestBody);

      // Send the token in the Authorization header
      const response = await fetch("http://localhost:5000/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setMessage("Food created successfully!");
        const newFood = data.food || data;
        console.log("New Food Object:", newFood); // Log before validation
        if (
          newFood &&
          newFood._id &&
          newFood.foodName &&
          typeof newFood.price === "number" &&
          Array.isArray(newFood.ingredients) &&
          newFood.category
        ) {
          setFoods((prev) => [...prev, newFood as FoodItem]);
        } else {
          console.error("Invalid food object in response:", newFood);
          setError("Received invalid food data from server");
        }
        setFormData({
          foodName: "",
          price: "",
          image: "",
          ingredients: "",
          category: "",
        });
      } else {
        setError(data.message || `Server error: ${response.status}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Unknown network error"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          Create Food
        </h1>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={formData.foodName}
              onChange={(event) => updateField("foodName")(event.target.value)}
              placeholder="Food Name"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.price}
              onChange={(event) => updateField("price")(event.target.value)}
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
              onChange={(event) => updateField("image")(event.target.value)}
              placeholder="Image URL"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(event) =>
                updateField("ingredients")(event.target.value)
              }
              placeholder="Ingredients (comma-separated)"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={formData.category}
              onChange={(event) => updateField("category")(event.target.value)}
              placeholder="Category ID (ObjectId)"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <button
            onClick={submitForm}
            disabled={isLoading}
            className="w-full p-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Food"}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {foods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Created Foods
            </h2>
            <div className="space-y-4">
              {foods.map((food) =>
                food ? (
                  <div
                    key={food._id}
                    className="p-4 bg-gray-800 rounded-xl text-white shadow-md"
                  >
                    <h3 className="text-lg font-semibold">{food.foodName}</h3>
                    <p>Price: ${food.price.toFixed(2)}</p>
                    {food.image && (
                      <img
                        src={food.image}
                        alt={food.foodName}
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <p>Ingredients: {food.ingredients.join(", ")}</p>
                    <p>Category: {food.category}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
