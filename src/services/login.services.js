import apiClient from "../api/apiClient";

export const loginUser = (userData) =>
  apiClient("/user/login", {
    method: "POST",
    body: userData,
  });