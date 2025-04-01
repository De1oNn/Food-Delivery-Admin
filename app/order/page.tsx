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

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setError("");
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = usernameFilter
        ? `http://localhost:5000/order?username=${encodeURIComponent(
            usernameFilter
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

      if (!response.ok) {
        throw new Error(orderData.message || "Failed to fetch orders");
      }

      console.log("Fetched orders:", orderData.orders);
      setOrders(orderData.orders || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        `Failed to load orders: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [usernameFilter, router]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      setError("");
      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus as Order["status"] }
            : order
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(
        `Failed to update status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");
      setError("");
      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok && response.status !== 404) {
        throw new Error(result.message || "Failed to delete order");
      }

      await fetchOrders();
      // alert(
      //   response.status === 404
      //     ? "Order already deleted"
      //     : "Order deleted successfully"
      // );
    } catch (err) {
      console.error("Delete order error:", err);
      // setError(
      //   `Failed to delete order: ${
      //     err instanceof Error ? err.message : "Unknown error"
      //   }`
      // );
    }
  };

  const toggleItems = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getTotalQuantity = (order: Order) =>
    order.foodOrderItems.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPrice = (order: Order) =>
    order.foodOrderItems
      .reduce((acc, item) => {
        if (!item.food) return acc;
        return acc + (item.food.price ?? 0) * (item.quantity ?? 0);
      }, 0)
      .toFixed(2);

  const handleUsernameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameFilter(e.target.value);
  };

  const statusOptions: Order["status"][] = ["PENDING", "CANCELED", "DELIVERED"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <aside className="fixed top-0 left-0 h-full w-[80px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300"
          aria-label="Back to dashboard"
        >
          <span className="text-xl font-bold text-white">←</span>
        </button>
      </aside>

      <div className="ml-[80px] p-8">
        <header className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-extrabold text-center text-orange-400">
            Order Management
          </h1>
          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              value={usernameFilter}
              onChange={handleUsernameFilter}
              placeholder="Filter by username..."
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
            />
          </div>
        </header>

        <main className="w-full max-w-6xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 rounded-md text-red-200">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <p className="text-gray-400 text-center text-lg">
              No orders found{usernameFilter ? ` for "${usernameFilter}"` : ""}.
            </p>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl p-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-orange-600/20 text-left">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Quantity</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="p-4">{order._id.slice(-6)}</td>
                      <td className="p-4">{order.user?.name ?? "N/A"}</td>
                      <td className="p-4">
                        {order.foodOrderItems.length > 3 &&
                        expandedOrder !== order._id ? (
                          <button
                            onClick={() => toggleItems(order._id)}
                            className="text-orange-400 hover:underline"
                          >
                            {order.foodOrderItems.length} items
                          </button>
                        ) : (
                          <ul className="space-y-3">
                            {order.foodOrderItems.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <Image
                                  src={
                                    item.food?.image || "/fallback-image.jpg"
                                  }
                                  width={48}
                                  height={48}
                                  alt={item.food?.foodName || "Food item"}
                                  className="w-12 h-12 object-cover rounded-lg shadow-md border border-gray-600"
                                  onError={(e) =>
                                    (e.currentTarget.src =
                                      "/fallback-image.jpg")
                                  }
                                />
                                <div>
                                  <span className="font-medium">
                                    {item.food?.foodName || "Unknown"}
                                  </span>
                                  <span className="text-gray-400 ml-2">
                                    (x{item.quantity})
                                  </span>
                                </div>
                              </li>
                            ))}
                            {order.foodOrderItems.length > 3 && (
                              <button
                                onClick={() => toggleItems(order._id)}
                                className="text-orange-400 hover:underline mt-2"
                              >
                                Hide items
                              </button>
                            )}
                          </ul>
                        )}
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
                          className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-gray-600 transition-colors duration-200 w-full"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>
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
