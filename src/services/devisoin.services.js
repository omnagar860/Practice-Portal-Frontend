import apiClient from "../api/apiClient";


export const getAllDivisions = () =>
  apiClient("/division/getAllDivision", {method :"GET"});

export const createDivision = (name) =>
  apiClient("/division/create-division", {
    method: "POST",
    body :{division :name}
  });

export const updateDivision = (id,isActive) =>
  apiClient(`/division/updateDivision/${id}`, {
    method: "POST",
    body: { isActive }
  });

export const deleteDivision = (id) =>
  apiClient(`/division/deletedivision/${id}`, {
    method: "POST",
  });