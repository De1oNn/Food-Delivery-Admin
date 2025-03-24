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
  user: { name: string };
  email?: string;
  foodOrderItems: FoodOrderItem[];
  createdAt: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update status");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus as Order["status"] }
            : order
        )
      );
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Update status error:", err);
      setError(
        `Failed to update status: ${
          err instanceof Error ? err.message : "Unknown"
        }`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getTotalQuantity = (order: Order) =>
    order.foodOrderItems.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPrice = (order: Order) =>
    order.foodOrderItems
      .reduce((acc, item) => {
        if (!item.food) return acc;
        return acc + (item.food.price ?? 0) * (item.quantity ?? 0);
      }, 0)
      .toFixed(2);

  const statusOptions: Order["status"][] = ["PENDING", "CANCELED", "DELIVERED"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <aside className="fixed top-0 left-0 h-full w-[80px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <div
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={back}
        >
          <span className="text-xl font-bold text-white">←</span>
        </div>
      </aside>

      <div className="ml-[80px] p-8">
        <header className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-extrabold text-center text-orange-400">
            {username ? `Orders for ${username}` : "All Orders"}
          </h1>
        </header>

        <main className="w-full max-w-6xl mx-auto">
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center text-lg">
              No orders found.
            </p>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl p-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-orange-600/20 text-left">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Total Quantity</th>
                    <th className="p-4 font-semibold">Total Price</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="p-4">{order._id.slice(-6)}</td>
                      <td className="p-4">
                        {order.user?.name ?? "Unknown User"}
                      </td>
                      <td className="p-4">
                        <ul className="space-y-3">
                          {order.foodOrderItems.map((item, index) => {
                            const foodName =
                              item.food?.foodName || "Unknown Food";
                            return (
                              <li
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <Image
                                  src={item.food?.image || randomImg}
                                  width={48}
                                  height={48}
                                  alt={foodName}
                                  className="w-12 h-12 object-cover rounded-lg shadow-md border border-gray-600"
                                  onError={(e) =>
                                    (e.currentTarget.src = randomImg)
                                  }
                                />
                                <div>
                                  <span className="font-medium">
                                    {foodName}
                                  </span>
                                  <span className="text-gray-400 ml-2">
                                    (x{item.quantity})
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                      <td className="p-4">{getTotalQuantity(order)}</td>
                      <td className="p-4 text-orange-400 font-medium">
                        ${getTotalPrice(order)}
                      </td>
                      <td className="p-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-gray-600 transition-colors duration-200"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
