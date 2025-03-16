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
  ingredients: string; // Matches backend schema
  category: { _id: string; categoryName: string }; // Populated category object
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
  const [category1Foods, setCategory1Foods] = useState<FoodItem[]>([]);
  const [category2Foods, setCategory2Foods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const CATEGORY_1_ID = "67bef9404497237cdd8454ec";
  const CATEGORY_2_ID = "65a7b2d8e12e3c4fbc123456";

  // Fetch foods on component mount
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/food");
        const data = await response.json();
        if (response.ok) {
          const foods: FoodItem[] = data.foods || [];
          setCategory1Foods(foods.filter(food => food.category._id === CATEGORY_1_ID));
          setCategory2Foods(foods.filter(food => food.category._id === CATEGORY_2_ID));
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoods();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/food-category");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const updateFoodField = (field: keyof FoodFormData) => (value: string) => {
    setFoodFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCategoryField = (field: keyof CategoryFormData) => (value: string) => {
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
        ingredients: foodFormData.ingredients, // Kept as string per schema
        category: foodFormData.category,
      };

      const response = await fetch("http://localhost:5000/food", { // Corrected endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Food created successfully!");
        if (data.food.category._id === CATEGORY_1_ID) {
          setCategory1Foods(prev => [...prev, data.food]);
        } else if (data.food.category._id === CATEGORY_2_ID) {
          setCategory2Foods(prev => [...prev, data.food]);
        }
        setFoodFormData({
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

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const requestBody = {
        categoryName: categoryFormData.categoryName,
      };

      const response = await fetch("http://localhost:5000/food-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Category created successfully!");
        setCategories(prev => [...prev, data.category]);
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

  const back = () => router.push("/dashboard");
  const foods = () => router.push("/foods");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative max-w-2xl w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <button
          onClick={back}
          className="absolute top-4 left-4 bg-white h-6 w-6 rounded-full flex items-center justify-center text-black font-bold"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-white text-center mb-6">Food Management</h1>
        <button
          className="bg-[red] h-[50px] w-[100px] rounded-3xl m-[2px]"
          onClick={foods}
        >
          Foods
        </button>

        {/* Create Category Form */}
        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Create Category</h2>
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={categoryFormData.categoryName}
              onChange={(e) => updateCategoryField("categoryName")(e.target.value)}
              placeholder="Category Name"
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400"
              required
            />
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
              required // Matches backend schema
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
              <option value="" disabled>Select a category</option>
              {categories.map(category => (
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

        {message && <p className="mt-4 text-green-400 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {/* Display foods separated by category */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {categories.find(c => c._id === CATEGORY_1_ID)?.categoryName || "Category 1"} Foods
          </h2>
          <div className="space-y-4">
            {category1Foods.length > 0 ? (
              category1Foods.map((food) => (
                <div key={food._id} className="p-4 bg-gray-800 rounded-xl text-white shadow-md">
                  <p><strong>Name:</strong> {food.foodName}</p>
                  <p><strong>Price:</strong> ${food.price.toFixed(2)}</p>
                  <img src={food.image} alt={food.foodName} className="mt-2 w-full h-32 object-cover rounded-lg" />
                  <p><strong>Ingredients:</strong> {food.ingredients}</p>
                  <p><strong>Category:</strong> {food.category.categoryName}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No foods in this category yet.</p>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">
            {categories.find(c => c._id === CATEGORY_2_ID)?.categoryName || "Category 2"} Foods
          </h2>
          <div className="space-y-4">
            {category2Foods.length > 0 ? (
              category2Foods.map((food) => (
                <div key={food._id} className="p-4 bg-gray-800 rounded-xl text-white shadow-md">
                  <p><strong>Name:</strong> {food.foodName}</p>
                  <p><strong>Price:</strong> ${food.price.toFixed(2)}</p>
                  <img src={food.image} alt={food.foodName} className="mt-2 w-full h-32 object-cover rounded-lg" />
                  <p><strong>Ingredients:</strong> {food.ingredients}</p>
                  <p><strong>Category:</strong> {food.category.categoryName}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No foods in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}