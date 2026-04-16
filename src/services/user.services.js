import apiClient from "../api/apiClient";


export const createUser = (userData) => {
  return apiClient("/user/createUser", {
    method: "POST",
    body: userData,
  });
};

export const getAllUsers = () =>
  apiClient("/user/getAllUsers", {
    method: "GET",
  });