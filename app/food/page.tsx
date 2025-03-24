"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FoodFormData {
  foodName: string;
  price: string;
  image: string;
  ingredients: string;
  category: string;
}

interface CategoryFormData {
  categoryName: string;
}

interface FoodItem {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: { _id: string; categoryName: string } | null;
}

interface CategoryItem {
  _id: string;
  categoryName: string;
}

export default function Food() {
  const router = useRouter();
  const [foodFormData, setFoodFormData] = useState<FoodFormData>({
    foodName: "",
    price: "",
    image: "",
    ingredients: "",
    category: "",
  });
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    categoryName: "",
  });
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodResponse = await fetch("http://localhost:5000/food");
        const foodData = await foodResponse.json();
        if (!foodResponse.ok)
          throw new Error(foodData.message || "Failed to fetch foods");
        setFoods(foodData.foods || []);

        const categoryResponse = await fetch(
          "http://localhost:5000/food-category"
        );
        const categoryData = await categoryResponse.json();
        if (!categoryResponse.ok)
          throw new Error(categoryData.message || "Failed to fetch categories");
        setCategories(categoryData.categories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const updateFoodField = (field: keyof FoodFormData) => (value: string) =>
    setFoodFormData((prev) => ({ ...prev, [field]: value }));

  const updateCategoryField =
    (field: keyof CategoryFormData) => (value: string) =>
      setCategoryFormData((prev) => ({ ...prev, [field]: value }));

  const handleFoodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const requestBody = {
        foodName: foodFormData.foodName,
        price: parseFloat(foodFormData.price),
        image: foodFormData.image,
        ingredients: foodFormData.ingredients,
        category: foodFormData.category,
      };

      const response = await fetch("http://localhost:5000/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Food created successfully!");
        setFoodFormData({
          foodName: "",
          price: "",
          image: "",
          ingredients: "",
          category: "",
        });
        setFoods((prev) => [...prev, data.food]);
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

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const requestBody = { categoryName: categoryFormData.categoryName };

      const response = await fetch("http://localhost:5000/food-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Category created successfully!");
        setCategories((prev) => [...prev, data.category]);
        setCategoryFormData({ categoryName: "" });
      } else {
        setError(data.message || "Failed to create category");
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

  const getFoodCountByCategory = (categoryId: string) =>
    foods.filter((food) => food.category?._id === categoryId).length;

  const totalFoodCount = foods.length;

  const back = () => router.push("/dashboard");
  const foodsPage = () => router.push("/foods");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={back}
          className="mb-6 h-10 w-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          Food Management
        </h1>

        {/* Create Category Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">
            Create Category
          </h2>
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <input
                type="text"
                value={categoryFormData.categoryName}
                onChange={(e) =>
                  updateCategoryField("categoryName")(e.target.value)
                }
                placeholder="Category Name"
                className="w-full px-4 py-3 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-500 transition-all duration-300 shadow-md hover:shadow-orange-500/30"
                >
                  {isLoading ? "Creating..." : "Create Category"}
                </button>
                <button
                  onClick={foodsPage}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-orange-500/30"
                >
                  Foods ({totalFoodCount})
                </button>
              </div>
            </form>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6 mt-6 ">
                
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md bg-gray-700/50 "
                  >
                    <p className="text-lg text-white">
                      {category.categoryName}
                    </p>
                    <p className="text-sm text-orange-400">
                      {getFoodCountByCategory(category._id)} items
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Food Section */}
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">
            Create Food
          </h2>
          <form onSubmit={handleFoodSubmit} className="space-y-6">
            <input
              type="text"
              value={foodFormData.foodName}
              onChange={(e) => updateFoodField("foodName")(e.target.value)}
              placeholder="Food Name"
              className="w-full px-4 py-3 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
              required
            />
            <input
              type="number"
              value={foodFormData.price}
              onChange={(e) => updateFoodField("price")(e.target.value)}
              placeholder="Price"
              step="0.01"
              className="w-full px-4 py-3 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
              required
            />
            <input
              type="text"
              value={foodFormData.image}
              onChange={(e) => updateFoodField("image")(e.target.value)}
              placeholder="Image URL"
              className="w-full px-4 py-3 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
              required
            />
            <input
              type="text"
              value={foodFormData.ingredients}
              onChange={(e) => updateFoodField("ingredients")(e.target.value)}
              placeholder="Ingredients (comma-separated)"
              className="w-full px-4 py-3 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
              required
            />
            <select
              value={foodFormData.category}
              onChange={(e) => updateFoodField("category")(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/70 text-white rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
            >
              {isLoading ? "Creating..." : "Create Food"}
            </button>
          </form>
        </div>

        {/* Messages */}
        {message && (
          <p className="mt-6 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-6 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}
