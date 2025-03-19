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
    user: { username: string } | null;
    foodOrderItems: FoodOrderItem[];
    createdAt: string;
  }

  export default function Order() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          setError("");
          setIsLoading(true);

          const token = localStorage.getItem("token"); // Add token for authentication
          if (!token) {
            throw new Error("Please login first");
          }

          const response = await fetch("http://localhost:5000/order", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token if required by backend
            },
          });

          const orderData = await response.json();
          console.log("Fetched Orders:", orderData);

          console.log(orderData, );
          
          if (!response.ok) {
            throw new Error(orderData.message || "Failed to fetch orders");
          }

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
    }, []);

    const back = () => {
      router.push("/dashboard");
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <p className="text-white">Loading orders...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      );
    }
    const randomImg =
      "https://images.unsplash.com/photo-1604908550665-32…xMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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

          {orders.length === 0 ? (
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
                  <ul className="mt-4 space-y-4">
                    {order.foodOrderItems && order.foodOrderItems.length > 0 ? (
                      order.foodOrderItems.map((item, index) => {
                        if (!item.food) {
                          console.log(`Item ${index}: No food data`);
                          return (
                            <li key={index} className="text-gray-400">
                              Unknown Food (x{item.quantity})
                            </li>
                          );
                        }

                        const displayImage = item.food.image || randomImg;
                        const foodName = item.food.foodName || "Unknown Food";

                        // console.log(
                        //   `Item ${index} - Name: ${foodName}, Image: ${
                        //     displayImage || "None"
                        //   }`
                        // );

                        return (
                          <li key={index} className="flex items-center gap-4">
                            {displayImage ? (
                              <Image
                                src={displayImage }
                                width={500}
                                height={500}
                                alt="Picture of the author"
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-md text-gray-400 text-sm">
                                No Image
                              </div>
                            )}
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
                      <li className="text-gray-400">No items in this order</li>
                    )}
                  </ul>
                  <p className="mt-4 font-bold">
                    Total: $
                    {order.foodOrderItems && order.foodOrderItems.length > 0
                      ? order.foodOrderItems
                          .reduce((acc, item) => {
                            if (!item.food) return acc;
                            return (
                              acc + (item.food.price ?? 0) * (item.quantity ?? 0)
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
