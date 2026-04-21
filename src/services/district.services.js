import apiClient from "../api/apiClient";

export const getAllDistricts = () =>
    apiClient("/district/getAllDistrict");

export const createDistrict = ({ divisionId, district }) =>
    apiClient("/district/createDistrict", {
        method: "POST",
        body: { divisionId, district }
    });

export const deleteDistrict = (id) =>
    apiClient(`/district/deleteDistrict/${id}`, { method: "POST" });

export const updateDistrict = (id,isActive) =>
    apiClient(`/district/updateDistrict/${id}`, { method: "POST", body :{isActive} });

export const getDistrictByDivisionId = (divisionId)=> {
   return apiClient(`/district/getDistrictByDivisionId/${divisionId}`, {method : "GET"})
}