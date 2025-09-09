import axios from "axios";
import productsData from "./products.json";

// Create an instance of axios to simulate a base URL
const api = axios.create({
  baseURL: "/api/",
  timeout: 5000,
});

// A simple function to simulate an API request with a delay
const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: productsData });
    }, 500); // Simulate network delay of 500ms
  });
};

// Use axios interceptors to mock the API call
api.interceptors.request.use((config) => {
  if (config.url === "/api/products") {
    return Promise.resolve(config);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url === "/api/products") {
      return getProducts();
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
