import { useEffect, useState } from "react";
import { createPost, deletePost, getAllPost, updatePost } from "../../../services/post.services";
import PostModal from "./PostModal";

export default function PostList() {
    const [fetchedPostList, setFetchedPostList] = useState([])
    const [modal, setModal] = useState({
    open: false,
    type: null,
    editData: null
    });
    const [loading] = useState(false);
    const [error] = useState(null);

    useEffect(()=> {
        fetchAllPost()
    }, [])

    const fetchAllPost = async()=> {
        try {
            const data = await getAllPost();
            setFetchedPostList(data.data)
        } catch (error) {
            throw new Error(`Error while fetching posts, ${error.message}`)
        }
    }


  const openCreate = () => setModal({ open: true, type: "create", editData: null });

const openToggle = (post) =>{
     setModal({ open: true, type: "toggle", editData: post });
}

const openDelete = (post) =>
    setModal({ open: true, type: "delete", editData: post });

const closeModal = () =>
    setModal({ open: false, type: null, editData: null });

    // ✅ Toggle status (mock)
const handleSubmit = async (data) => {
    try {
        if (modal.type === "create") {
            // await createPost({ postName: data.postName });
            await createPost( data.postName);
            closeModal()
        }

        if (modal.type === "toggle") {
            await updatePost(data.id);
        }

        if (modal.type === "delete") {
            await deletePost(data.id);
        }

        await fetchAllPost();
        closeModal();
    } catch (err) {
        console.error(err);
    }
};


    if (loading) return <p className="p-6 text-gray-400 text-sm">Loading...</p>;
    if (error) return <p className="p-6 text-red-500 text-sm">{error}</p>;

    return (
        <div className="flex-1 bg-gray-50 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-medium">Posts</h2>
                    <p className="text-sm text-gray-500">{fetchedPostList.length} posts total</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-green-50 text-sm px-4 py-2 rounded-lg"
                >
                    + Create post
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left w-10">#</th>
                            <th className="px-4 py-3 text-left">Post name</th>
                            {/* <th className="px-4 py-3 text-left">Division</th> */}
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {fetchedPostList.map((p, i) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">{p.postName}</td>
                                {/* <td className="px-4 py-3 text-gray-600">{d.division_name}</td> */}
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                        {p.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() =>openToggle(p)}
                                        className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>openDelete(p)}
                                        className="text-xs border border-red-200 text-red-600 rounded px-2.5 py-1 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          <PostModal
    isOpen={modal.open}
    type={modal.type}
    editData={modal.editData}
    onClose={closeModal}
    onSubmit={handleSubmit}
/>
        </div>
    );
}