"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Food {
  _id: string;
  foodName: string;
  price: number;
  category: { _id: string; categoryName: string } | null;
}

interface FoodOrderItem {
  food: { foodName: string; price: number; _id?: string } | null; // Ensure food is nullable
  quantity: number;
}

interface Order {
  _id: string;
  user: { username: string } | null;
  foodOrderItems: FoodOrderItem[];
  createdAt: string;
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        // Fetch orders
        const orderResponse = await fetch("http://localhost:5000/order", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const orderData = await orderResponse.json();
        console.log("Fetched Orders:", orderData); // Debugging

        if (!orderResponse.ok) {
          throw new Error(orderData.message || "Failed to fetch orders");
        }

        // Fetch foods
        const foodResponse = await fetch("http://localhost:5000/food", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const foodData = await foodResponse.json();
        console.log("Fetched Foods:", foodData); // Debugging

        if (!foodResponse.ok) {
          throw new Error(foodData.message || "Failed to fetch foods");
        }

        // Set state
        setOrders(orderData.orders || []);
        setFoods(foodData.foods || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to load data: ${err instanceof Error ? err.message : "Unknown"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get full food details by ID
  const getFoodDetails = (foodId: string): Food | null => {
    return foods.find((food) => food._id === foodId) || null;
  };
  const back = () => {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <button
          onClick={back}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          All Orders!
        </h1>

        {isLoading ? (
          <p className="text-white text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-white text-center">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 bg-gray-800 rounded-xl text-white shadow-md"
              >
                <h2 className="text-xl font-semibold">
                  Order by {order.user?.username ?? "Unknown User"}
                </h2>
                <p className="text-gray-400 text-sm">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <ul className="mt-4 space-y-2">
                  {order.foodOrderItems && order.foodOrderItems.length > 0 ? (
                    order.foodOrderItems.map((item, index) => {
                      if (!item.food)
                        return (
                          <li key={index} className="text-gray-400">
                            Unknown Food (x{item.quantity})
                          </li>
                        );

                      const fullFood = item.food._id
                        ? getFoodDetails(item.food._id)
                        : null;

                      return (
                        <li key={index} className="flex justify-between">
                          <span>
                            {fullFood?.foodName ??
                              item.food?.foodName ??
                              "Unknown Food"}{" "}
                            (x
                            {item.quantity}){" "}
                            {fullFood?.category && (
                              <span className="text-gray-400">
                                [{fullFood.category.categoryName}]
                              </span>
                            )}
                          </span>
                          <span>
                            $
                            {(fullFood?.price && item.quantity
                              ? fullFood.price * item.quantity
                              : item.food?.price && item.quantity
                              ? item.food.price * item.quantity
                              : 0
                            ).toFixed(2)}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-400">No items in this order</li>
                  )}
                </ul>
                <p className="mt-4 font-bold">
                  Total: $
                  {order.foodOrderItems && order.foodOrderItems.length > 0
                    ? order.foodOrderItems
                        .reduce((acc, item) => {
                          if (!item.food) return acc;

                          const fullFood = item.food._id
                            ? getFoodDetails(item.food._id)
                            : null;

                          return (
                            acc +
                            (fullFood?.price ?? item.food?.price ?? 0) *
                              (item.quantity ?? 0)
                          );
                        }, 0)
                        .toFixed(2)
                    : "0.00"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
