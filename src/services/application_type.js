import apiClient from "../api/apiClient.js"

export const createNewApplication = async (payload) => {
  return await apiClient("/application-type/createNewApplication", {method :"POST",
    body: payload,
  });
};

export const getAllApplications = async()=> {
    return apiClient("/application-type/getAllApplication", {method : "GET"});
}