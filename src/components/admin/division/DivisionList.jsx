import { useState, useEffect } from "react";
import DivisionModal from "./DivisionModal";
import { createDivision, deleteDivision, getAllDivisions, updateDivision } from "../../../services/devisoin.services";

export default function DivisionList() {
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, editData: null });

    useEffect(() => {
        fetchDivisions();
    }, []);

    const fetchDivisions = async () => {
        try {
            setLoading(true);
            const data = await getAllDivisions();
            setDivisions(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => setModal({ open: true, editData: null });
    const openEditModal = (division) => setModal({ open: true, editData: division });
    const closeModal = () => setModal({ open: false, editData: null });

    // called from modal on save/confirm
    const handleSubmit = async ({ id, name ,isActive}) => {
        try {
            if (id) {
                // deactivate existing division
                await updateDivision(id,isActive);
            } else {
                // create new division
                await createDivision(name);
            }
            const result =  await fetchDivisions();
            console.log( "fetched divisionm list", result,result?.data)
            closeModal();
        } catch (err) {
            // console.error("Error:", err);
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDivision(id);
            await fetchDivisions();
        } catch (err) {
            // console.error("Error deleting division:", err);
            setError(err.message);
        }
    };

    if (loading) return <p className="p-6 text-gray-400 text-sm">Loading...</p>;
    // if (error) return <p className="p-6 text-red-500 text-sm">{error}</p>;

    return (
        <div className="flex-1 bg-gray-50 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-medium">Divisions</h2>
                    <p className="text-sm text-gray-500">{divisions.length} divisions total</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-green-50 text-sm px-4 py-2 rounded-lg"
                >
                    + Create division
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left w-10">#</th>
                            <th className="px-4 py-3 text-left">Division name</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {divisions.map((d, i) => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">{d.division_name}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${d.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                        {d.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(d)}
                                        className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(d.id)}
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

            <DivisionModal
                isOpen={modal.open}
                editData={modal.editData}
                onClose={closeModal}
                onSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
}
