import { useEffect, useState } from "react";
import { getAllPostForOffice } from "../../../services/office_post";
import { getAllPost } from "../../../services/post.services";

export default function AssignPostModal({ isOpen, onClose, onSubmit, error:apiError }) {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState("");
    const [localerror, setLocalError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        fetchPosts();
        setSelectedPost("");
        setLocalError(null);
    }, [isOpen]);

    const fetchPosts = async (officeId) => {
        // alert(`post fectchoing for office id ${officeId}`)
        const data = await getAllPost();
        // console.log("data for office post", data)
        setPosts(data.data);
    };
    // fetchPosts(4)

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 border">

                <h3 className="text-base font-medium mb-3">Assign Post</h3>

                <select
                    value={selectedPost}
                    onChange={(e) => setSelectedPost(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">-- Select Post --</option>
                    {posts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.postName}
                        </option>
                    ))}
                </select>
{(localerror || apiError) && (
  <p className="text-xs text-red-500 mt-2">
    {localerror || apiError}
  </p>
)}

                <div className="flex justify-end gap-2 mt-5">
                    <button onClick={onClose} className="border px-4 py-1.5 rounded-lg text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (!selectedPost) {
                                setLocalError("Please select a post");
                                return;
                            }
                            setLocalError(null)
                            onSubmit({ postId: selectedPost });
                        }}
                        className="bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm"
                    >
                        Assign Post
                    </button>
                </div>
            </div>
        </div>
    );
}