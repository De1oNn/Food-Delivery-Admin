// foods
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

//food
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
  category: { _id: string; categoryName: string } | null;
}

interface CategoryItem {
  _id: string;
  categoryName: string;
}

// dashboard
interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  role: "ADMIN" | "USER";
  orderedFoods: string[];
  isVerified: boolean;
  createdAt?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}

interface Restaurant {
  _id: string;
  location: string;
  picture: string;
  name: string;
  information: string;
  phoneNumber: number;
  createdAt: string;
}
// order 
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