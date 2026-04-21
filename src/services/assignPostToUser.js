import apiClient from "../api/apiClient"


export const assignPostToUser = async(userId ,postId)=> {
   return await apiClient(`/assign-post-user/assignPostToUser/${userId}`, {method : "POST", body : {postId}})
}

export const getUserPost = async(userId)=> {
    return await apiClient(`/assign-post-user/getUserPost/${userId}`, {method: "GET"})
}