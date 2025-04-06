"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Foods() {
  const router = useRouter();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
    
        const categoryResponse = await fetch(
          "https://food-delivery-back-end-three.vercel.app/food-category",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const categoryText = await categoryResponse.text();
        console.log("Categories raw response:", categoryText);
        const categoryData = JSON.parse(categoryText);
        if (!categoryResponse.ok)
          throw new Error(categoryData.message || "Failed to fetch categories");
    
        const foodResponse = await fetch(
          "https://food-delivery-back-end-three.vercel.app/food",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const foodText = await foodResponse.text();
        console.log("Foods raw response:", foodText);
        const foodData = JSON.parse(foodText);
        if (!foodResponse.ok)
          throw new Error(foodData.message || "Failed to fetch foods");
    
        const validFoods = (foodData.foods || []).filter(
          (food: FoodItem, index: number) => {
            if (!food.category) {
              console.warn(`Food ${index} (${food.foodName}) has null category`);
              return true;
            }
            return true;
          }
        );
    
        setCategories(categoryData.categories || []);
        setFoods(validFoods);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          `Network error: ${err instanceof Error ? err.message : "Unknown"}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedFoods = categories.reduce((acc, category) => {
    acc[category._id] = foods.filter(
      (food) => food.category?._id === category._id
    );
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const back = () => router.push("/food");

  const handleDelete = async (foodId: string) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;
  
    try {
      const response = await fetch(
        `https://food-delivery-back-end-three.vercel.app/${foodId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error(`Invalid JSON response: ${text}`);
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete food");
      }
  
      setFoods((prevFoods) => prevFoods.filter((food) => food._id !== foodId));
      alert("Food deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        `Delete error: ${err instanceof Error ? err.message : "Unknown"}`
      );
    }
  };
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category and all its foods?")) return;

    try {
        console.log(`Deleting category with ID: ${categoryId}`); // Debug log
        const response = await fetch(
            `https://food-delivery-back-end-three.vercel.app/food-category/${categoryId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        );

        const text = await response.text();
        console.log("Raw category delete response:", text);

        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (jsonError) {
            console.error("JSON parse error:", jsonError);
            throw new Error(`Invalid JSON response: ${text}`);
        }

        if (!response.ok) {
            console.log("Response not OK:", response.status, data);
            throw new Error(data.message || `Failed to delete category (Status: ${response.status})`);
        }

        setCategories((prevCategories) => 
            prevCategories.filter((cat) => cat._id !== categoryId)
        );
        setFoods((prevFoods) => 
            prevFoods.filter((food) => food.category?._id !== categoryId)
        );
        
        alert("Category deleted successfully!");
    } catch (err) {
        console.error("Delete category error:", err);
        setError(
            `Delete category error: ${err instanceof Error ? err.message : "Unknown"}`
        );
    }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
    <div className="max-w-4xl mx-auto">
      <button
        onClick={back}
        className="mb-6 h-10 w-10 bg-orange-500 text-white rounded-full flex items-center justify-center 
          hover:bg-orange-600 border-2 border-orange-400 transition-all duration-300 shadow-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b-2 border-orange-400 pb-2">
        All Foods
      </h1>

      {isLoading ? (
        <p className="text-gray-400 text-center animate-pulse">
          Loading foods...
        </p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : categories.length === 0 && foods.length === 0 ? (
        <p className="text-gray-400 text-center">
          No foods or categories found.
        </p>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category._id}>
              <div className="flex items-center justify-between mb-6 bg-gray-800/50 border-2 border-orange-500/50 
                rounded-lg p-4 shadow-md">
                <h2 className="text-2xl font-semibold text-orange-400">
                  {category.categoryName}
                </h2>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md border-2 border-red-400 
                    hover:bg-red-700 hover:border-red-300 transition-all duration-300 
                    shadow-sm hover:shadow-red-500/20 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm">Delete</span>
                </button>
              </div>

              {groupedFoods[category._id]?.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {groupedFoods[category._id].map((food) => (
                    <div
                      key={food._id}
                      className="bg-gray-800/70 border-2 border-orange-600/30 p-4 rounded-xl 
                        shadow-lg w-[calc(50%-1.5rem)] hover:border-orange-500/50 
                        transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={food.image}
                            alt={food.foodName}
                            className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-700"
                          />
                          <div>
                            <p className="text-lg font-medium text-white">
                              {food.foodName}
                            </p>
                            <p className="text-sm text-orange-400">
                              ${food.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 italic">
                              {food.ingredients ? "Tasty & Fresh" : "Simple Delight"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center 
                            justify-center border-2 border-red-400 hover:bg-red-700 
                            hover:border-red-300 transition-all duration-300 
                            shadow-sm hover:shadow-red-500/20"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No foods in this category yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
