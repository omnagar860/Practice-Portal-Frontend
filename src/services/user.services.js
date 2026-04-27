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

export const getSignleUserData = (userId) => apiClient(`/user/getSingleUserData/${userId}`, {method:"GET"});

export const updateUserDetails = (userId,userData) => apiClient(`/user/updateuser/${userId}`, {method : "POST", body : userData});

export const deleteUserDetails = (userId) => apiClient(`/user/deleteuser/${userId}`, {method : "POST"})