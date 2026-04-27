import apiClient from "../api/apiClient";

export const saveUserPermissions = async (payload) => {
  return await apiClient(`/user-permissions/save`, {
    method: "POST",
    body: payload,
  });
};

export const getUserPermissions = async (userId) => {
  return await apiClient(`/user-permissions/${userId}`, {
    method: "GET",
  });
};
