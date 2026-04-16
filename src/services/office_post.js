import apiClient from "../api/apiClient"



// export const getAllPostFOrOffice = (officeId)=> {
//     return apiClient("/officePost/getAllPost/:id", {method : "GET", body:{id : officeId}})
// }
export const getAllPostForOffice = (officeId) => {
    return apiClient(`/officePost/getAllPost/${officeId}`, {
        method: "GET"
    });
};

export const addPostInOffice = (officeId, postId)=> {
  return apiClient(`/officePost/addPostInOffice/${officeId}`, {
    method: "POST",
    body: { postId }
  });
}

export const deletePostFromOffice = (officeId, postId) => {
    return apiClient(`/officePost/deletePostInOffice/${officeId}/${postId}`, {
        method: "POST"
    });
};

// export const addPostInOffice = (officeId, postId)=> {
//      return apiClient(`/officePost/addPostInOffice/:${officeId}`, {method :"POST", body :{ postId, officeId}})
// }