import apiClient from "../api/apiClient";

export const savePrivileges = async (payload) => {
  return await apiClient("/privileges/save", {
    method: "POST",
    body: payload,
  });
};

export const getPrivilegesByOfficePost = async (officeId, postId) => {
  return await apiClient(`/privileges/${officeId}/${postId}`, {
    method: "GET",
  });
};
