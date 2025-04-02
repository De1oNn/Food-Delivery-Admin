"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";


const AdminRestaurant = () => {
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] =
    useState<boolean>(false);
  const [restaurantData, setRestaurantData] = useState({
    location: "",
    picture: "",
    name: "",
    information: "",
    phoneNumber: "",
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantLoading, setRestaurantLoading] = useState<boolean>(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  useEffect(() => {
    if (isRestaurantModalOpen) {
      fetchRestaurants();
    }
  }, [isRestaurantModalOpen]);

  const fetchRestaurants = async () => {
    setRestaurantLoading(true);
    setRestaurantError(null);
    try {
      const res = await axios.get<{ restaurants: Restaurant[] }>(
        "http://localhost:5000/restaurant",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRestaurants(res.data.restaurants || []);
    } catch (error: any) {
      setRestaurantError(
        error.response?.data?.message || "Failed to load restaurants."
      );
    } finally {
      setRestaurantLoading(false);
    }
  };

  const createRestaurant = async () => {
    const { location, picture, name, information, phoneNumber } =
      restaurantData;
    if (!location || !picture || !name || !information || !phoneNumber) {
      alert("Please provide all required restaurant information");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/restaurant",
        {
          location,
          picture,
          name,
          information,
          phoneNumber: Number(phoneNumber),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message || "Restaurant created successfully");
      setRestaurantData({
        location: "",
        picture: "",
        name: "",
        information: "",
        phoneNumber: "",
      });
      fetchRestaurants();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create restaurant");
    }
  };

  const handleRestaurantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div >
      <MapPin 
      className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors" 
      onClick={() => setIsRestaurantModalOpen(true)} 
      />
      {isRestaurantModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">
              Add Restaurant
            </h2>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleRestaurantInputChange}
              placeholder="Restaurant Name"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleRestaurantInputChange}
              placeholder="Location"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="picture"
              value={restaurantData.picture}
              onChange={handleRestaurantInputChange}
              placeholder="Picture URL"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <textarea
              name="information"
              value={restaurantData.information}
              onChange={handleRestaurantInputChange}
              placeholder="Information"
              className="w-full h-20 p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="number"
              name="phoneNumber"
              value={restaurantData.phoneNumber}
              onChange={handleRestaurantInputChange}
              placeholder="Phone Number"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsRestaurantModalOpen(false);
                  setRestaurantData({
                    location: "",
                    picture: "",
                    name: "",
                    information: "",
                    phoneNumber: "",
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createRestaurant}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                All Restaurants ({restaurants.length})
              </h3>
              {restaurantLoading && <p>Loading restaurants...</p>}
              {restaurantError && (
                <p className="text-red-500">{restaurantError}</p>
              )}
              {!restaurantLoading &&
              !restaurantError &&
              restaurants.length === 0 ? (
                <p className="text-gray-400">No restaurants yet</p>
              ) : (
                !restaurantLoading &&
                !restaurantError && (
                  <div className="max-h-40 overflow-y-auto space-y-3">
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant._id}
                        className="p-3 bg-gray-700/50 rounded-lg"
                      >
                        <p className="text-sm font-semibold">
                          {restaurant.name}
                        </p>
                        <p className="text-sm">{restaurant.location}</p>
                        <p className="text-sm">{restaurant.information}</p>
                        <p className="text-sm">
                          Phone: {restaurant.phoneNumber}
                        </p>
                        <img
                          src={restaurant.picture}
                          alt={restaurant.name}
                          className="w-16 h-16 object-cover rounded-md mt-2"
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-image.jpg")
                          }
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(restaurant.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurant;
