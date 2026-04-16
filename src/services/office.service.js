import apiClient from "../api/apiClient";

export const getAllOffice = () => apiClient("/office/getAllOffice");

export const createOffice = (officeData)=> {
    return apiClient("/office/createOffice", {method : "POST", body :officeData})
}
export const updateOffice = (id)=> {
   return apiClient(`/office/updateOffice/${id}` , {method : "POST"})
};

export const deleteOffice = (id)=> {
 return   apiClient(`/office/deleteOffice/${id}` , {method : "POST"})
}
