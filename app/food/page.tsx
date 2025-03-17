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
  category: { _id: string; categoryName: string } | null; // Allow null for uncategorized foods
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
  const [foods, setFoods] = useState<FoodItem[]>([]); // Store foods
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch foods and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch foods
        const foodResponse = await fetch("http://localhost:5000/food");
        const foodData = await foodResponse.json();
        if (!foodResponse.ok) {
          throw new Error(foodData.message || "Failed to fetch foods");
        }
        setFoods(foodData.foods || []);

        // Fetch categories
        const categoryResponse = await fetch(
          "http://localhost:5000/food-category"
        );
        const categoryData = await categoryResponse.json();
        if (!categoryResponse.ok) {
          throw new Error(categoryData.message || "Failed to fetch categories");
        }
        setCategories(categoryData.categories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const updateFoodField = (field: keyof FoodFormData) => (value: string) => {
    setFoodFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCategoryField =
    (field: keyof CategoryFormData) => (value: string) => {
      setCategoryFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

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
        // Update foods list after successful creation
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

  // Calculate food counts per category
  const getFoodCountByCategory = (categoryId: string) => {
    return foods.filter((food) => food.category?._id === categoryId).length;
  };

  // Calculate total food count
  const totalFoodCount = foods.length;

  const back = () => router.push("/dashboard");
  const foodsPage = () => router.push("/foods");

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
          Food Management
        </h1>

        {/* Create Category Form */}
        <h2 className="text-2xl font-bold text-white mt-6 mb-4">
          Create Category
        </h2>
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={categoryFormData.categoryName}
              onChange={(e) =>
                updateCategoryField("categoryName")(e.target.value)
              }
              placeholder="Category Name"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <button
            className="bg-[white] h-[50px] w-[150px] rounded-3xl m-[2px] text-black font-semibold"
            onClick={foodsPage}
          >
            Foods <span>{totalFoodCount}</span>
          </button>
          <div>
            {categories.length > 0 ? (
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="flex items-center h-[30px] gap-3"
                  >
                    <span className="bg-black text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                      {category.categoryName}
                    </span>
                    <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                      {getFoodCountByCategory(category._id)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white text-lg font-medium text-center">
                No categories available
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        </form>

        {/* Create Food Form */}
        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Create Food</h2>
        <form onSubmit={handleFoodSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={foodFormData.foodName}
              onChange={(e) => updateFoodField("foodName")(e.target.value)}
              placeholder="Food Name"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={foodFormData.price}
              onChange={(e) => updateFoodField("price")(e.target.value)}
              placeholder="Price"
              step="0.01"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={foodFormData.image}
              onChange={(e) => updateFoodField("image")(e.target.value)}
              placeholder="Image URL"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={foodFormData.ingredients}
              onChange={(e) => updateFoodField("ingredients")(e.target.value)}
              placeholder="Ingredients (comma-separated)"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <select
              value={foodFormData.category}
              onChange={(e) => updateFoodField("category")(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
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
      </div>
    </div>
  );
}
