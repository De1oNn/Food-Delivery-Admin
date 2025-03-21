"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FoodOrderItem {
  food: {
    foodName: string;
    price: number;
    image: string;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  userName: string | null;
  foodOrderItems: FoodOrderItem[];
  createdAt: string;
}

export default function Order({ username }: { username?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first");

        const url = username
          ? `http://localhost:5000/order?username=${encodeURIComponent(
              username
            )}`
          : "http://localhost:5000/order";

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const orderData = await response.json();
        console.log("Fetched Orders:", orderData);

        if (!response.ok)
          throw new Error(orderData.message || "Failed to fetch orders");

        setOrders(orderData.orders || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          `Failed to load data: ${
            err instanceof Error ? err.message : "Unknown"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [username]);

  const back = () => router.push("/dashboard");

  const randomImg =
    "https://images.unsplash.com/photo-1604908550665-32…xMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center p-6">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getTotalQuantity = (order: Order) =>
    order.foodOrderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[100px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <div
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={back}
        >
          <span className="text-xl font-bold text-white">←</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[100px] p-6">
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <h1 className="text-3xl font-bold text-center">
            {username ? `Orders for ${username}` : "All Orders!"}
          </h1>
        </header>

        <main className="flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center">No orders found.</p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="group bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 w-[calc(33.33%-1rem)] relative hover:bg-gray-700/70 transition-all duration-300"
                  >
                    {/* Default visible content */}
                    <h2 className="text-xl font-semibold">
                      {order.userName ?? "Unknown User"}
                    </h2>
                    <p className="text-gray-300">
                      Total Items: {getTotalQuantity(order)}
                    </p>

                    {/* Hover content */}
                    <div className="absolute top-full left-0 mt-2 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <p className="text-gray-400 text-sm">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {order.foodOrderItems &&
                        order.foodOrderItems.length > 0 ? (
                          order.foodOrderItems.map((item, index) => {
                            if (!item.food) {
                              return (
                                <li key={index} className="text-gray-400">
                                  Unknown Food (x{item.quantity})
                                </li>
                              );
                            }
                            const displayImage = item.food.image || randomImg;
                            const foodName =
                              item.food.foodName || "Unknown Food";
                            return (
                              <li
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <Image
                                  src={displayImage}
                                  width={48}
                                  height={48}
                                  alt={foodName}
                                  className="w-12 h-12 object-cover rounded-md border-2 border-gray-600"
                                />
                                <div className="flex-1 flex justify-between">
                                  <span>
                                    {foodName} (x{item.quantity})
                                  </span>
                                  <span>
                                    $
                                    {(item.food.price && item.quantity
                                      ? item.food.price * item.quantity
                                      : 0
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-gray-400">
                            No items in this order
                          </li>
                        )}
                      </ul>
                      <p className="mt-2 font-bold">
                        Total: $
                        {order.foodOrderItems && order.foodOrderItems.length > 0
                          ? order.foodOrderItems
                              .reduce((acc, item) => {
                                if (!item.food) return acc;
                                return (
                                  acc +
                                  (item.food.price ?? 0) * (item.quantity ?? 0)
                                );
                              }, 0)
                              .toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
