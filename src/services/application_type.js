import apiClient from "../api/apiClient.js"

export const createNewApplication = async (payload) => {
  return await apiClient("/application-type/createNewApplication", {method :"POST",
    body: payload,
  });
};

export const getAllApplications = async()=> {
    return apiClient("/application-type/getAllApplication", {method : "GET"});
}
export const updateApplication = async(id,isActive)=> {
    return apiClient(`/application-type/updateApplication/${id}`, {method : "POST",body :{isActive}});
}
export const deleteApplication = async(id)=> {
    return apiClient(`/application-type/deleteApplication/${id}`, {method : "POST"});
}