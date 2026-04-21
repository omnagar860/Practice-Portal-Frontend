import { useState, useEffect } from "react";

export default function PostModal({ isOpen, type, editData, onClose, onSubmit,error, setError }) {
    const [postName, setPostName] = useState("");
    // const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        // setError(null);

        if (type === "create") {
            setPostName("");
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    // ───────── CREATE POST ─────────
    if (type === "create") {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-3">Create Post</h3>

                    <input
                        type="text"
                        value={postName}
                        onChange={(e) => setPostName(e.target.value)}
                        placeholder="Enter post name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600"
                    />

                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                    <div className="flex justify-end gap-2 mt-5">
                        <button onClick={onClose} className="text-sm border px-4 py-1.5 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!postName.trim()) {
                                    setError("Post name required");
                                    return;
                                }
                                onSubmit({ postName });
                            }}
                            className="text-sm bg-green-800 text-white px-4 py-1.5 rounded-lg"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ───────── TOGGLE STATUS ─────────
    if (type === "toggle") {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-2">
                        {editData?.isActive ? "Deactivate Post" : "Activate Post"}
                    </h3>

                    <p className="text-sm text-gray-500 mb-5">
                        Are you sure you want to{" "}
                        {editData?.isActive ? "deactivate" : "activate"} "{editData?.post_name}"?
                    </p>

                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="text-sm border px-4 py-1.5 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit({ id: editData.id })}
                            className={`text-sm px-4 py-1.5 rounded-lg text-white
                                ${editData?.isActive ? "bg-red-600" : "bg-green-700"}`}
                        >
                            {editData?.isActive ? "Deactivate" : "Activate"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ───────── DELETE ─────────
    if (type === "delete") {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-2 text-red-600">
                        Delete Post
                    </h3>

                    <p className="text-sm text-gray-500 mb-5">
                        Are you sure you want to delete "{editData?.postName}"?
                    </p>

                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="text-sm border px-4 py-1.5 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit({ id: editData.id, delete: true })}
                            className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}