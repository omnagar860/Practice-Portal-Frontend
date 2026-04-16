import apiClient from "../api/apiClient";


export const getAllPost = ()=> apiClient("/post/getAllPost", {method : "GET"})

export const createPost = (postName)=> apiClient("/post/createPost", {method : "POST", body :{ postName : postName } });

export const updatePost = (id) => apiClient(`/post/updatePost/${id}`, {method :"POST"});

export const deletePost = (id) => apiClient(`/post/deltePost/${id}`, {method :"POST"});