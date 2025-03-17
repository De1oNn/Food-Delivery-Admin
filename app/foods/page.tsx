"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
          "http://localhost:5000/food-category",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const categoryData = await categoryResponse.json();
        console.log("Category response data:", categoryData);

        if (!categoryResponse.ok) {
          throw new Error(categoryData.message || "Failed to fetch categories");
        }

        const foodResponse = await fetch("http://localhost:5000/food", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const foodData = await foodResponse.json();
        console.log("Food response data:", foodData);

        if (!foodResponse.ok) {
          throw new Error(foodData.message || "Failed to fetch foods");
        }

        const validFoods = (foodData.foods || []).filter(
          (food: FoodItem, index: number) => {
            if (!food.category) {
              console.warn(
                `Food ${index} (${food.foodName}) has null category`
              );
              return true;
            }
            const categoryExists = (categoryData.categories || []).some(
              (cat: CategoryItem) => cat._id === food.category?._id
            );
            if (!categoryExists) {
              console.warn(
                `Food ${index} (${food.foodName}) has unmatched category: ${food.category?._id}`
              );
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

  const uncategorizedFoods = foods.filter((food) => !food.category);

  const back = () => router.push("/food");

  const handleImageError =
    (foodId: string) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error(
        `Image failed to load for food ID ${foodId}: ${e.currentTarget.src}`
      );
      e.currentTarget.style.display = "none"; // Hide broken image
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
        ) : categories.length === 0 && foods.length === 0 ? (
          <p className="text-white text-center">
            No foods or categories found.
          </p>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category._id}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {category.categoryName}
                </h2>
                {groupedFoods[category._id]?.length > 0 ? (
                  <div className="space-y-4">
                    {groupedFoods[category._id].map((food) => (
                      <div
                        key={food._id}
                        className="p-4 bg-gray-800 rounded-xl text-white shadow-md"
                      >
                        <h3 className="text-lg font-semibold">
                          {food.foodName}
                        </h3>
                        <p>Price: ${food.price.toFixed(2)}</p>
                        {food.image &&
                        food.image.trim() !== "" &&
                        food.image.startsWith("http") ? (
                          <img
                            src={food.image}
                            alt={food.foodName}
                            className="mt-2 w-full h-32 object-cover rounded-lg"
                            onError={handleImageError(food._id)}
                            onLoad={() =>
                              console.log(`Image loaded: ${food.image}`)
                            }
                          />
                        ) : (
                          <p className="text-gray-400">
                            No valid image available
                          </p>
                        )}
                        <p>Ingredients: {food.ingredients || "None"}</p>
                        <p>
                          Category: {food.category?.categoryName || "Unknown"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white">No foods in this category yet.</p>
                )}
              </div>
            ))}

            {uncategorizedFoods.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Uncategorized Foods
                </h2>
                <div className="space-y-4">
                  {uncategorizedFoods.map((food) => (
                    <div
                      key={food._id}
                      className="p-4 bg-gray-800 rounded-xl text-white shadow-md"
                    >
                      <h3 className="text-lg font-semibold">{food.foodName}</h3>
                      <p>Price: ${food.price.toFixed(2)}</p>
                      {food.image &&
                      food.image.trim() !== "" &&
                      food.image.startsWith("http") ? (
                        <img
                          src={food.image}
                          alt={food.foodName}
                          className="mt-2 w-full h-32 object-cover rounded-lg"
                          onError={handleImageError(food._id)}
                          onLoad={() =>
                            console.log(`Image loaded: ${food.image}`)
                          }
                        />
                      ) : (
                        <p className="text-gray-400">
                          No valid image available
                        </p>
                      )}
                      <p>Ingredients: {food.ingredients || "None"}</p>
                      <p>Category: None</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
