import apiClient from "../api/apiClient";

export const getAllDistricts = () =>
    apiClient("/district/getAllDistrict");

export const createDistrict = ({ divisionId, district }) =>
    apiClient("/district/createDistrict", {
        method: "POST",
        body: { divisionId, district }
    });

export const deleteDistrict = (id) =>
    apiClient(`/district/deleteDistrict/${id}`, { method: "DELETE" });

export const updateDistrict = (id) =>
    apiClient(`/district/updateDistrict/${id}`, { method: "PUT" });

export const getDistrictByDivisionId = (divisionId)=> {
   return apiClient(`/district/getDistrictByDivisionId/${divisionId}`, {method : "GET"})
}