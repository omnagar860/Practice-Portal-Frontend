// src/api/apiClient.js
const BASE_URL = "http://localhost:8080/api";

const apiClient = async (endpoint, options = {}) => {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    // console.log(data)
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default apiClient;