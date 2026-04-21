import { useState, useEffect } from "react";
import DistrictModal from "./DistrictModal.jsx";
import { createDistrict, deleteDistrict, getAllDistricts, updateDistrict } from "../../../services/district.services";

export default function DistrictList() {
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, editData: null }); // ✅ add editData

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        try {
            setLoading(true);
            const data = await getAllDistricts();
            console.log("fetched districts ===========", data.data)
            setDistricts(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => setModal({ open: true, editData: null });
    const openEditModal = (district) => setModal({ open: true, editData: district }); // ✅ pass full object
    const closeModal = () => setModal({ open: false, editData: null });

    // ✅ handles both create and toggle status
    const handleSubmit = async ({ id, divisionId, district,isActive }) => {
        try {
            if (id) {
                await updateDistrict(id,isActive);   // ✅ deactivate/activate
            } else {
                await createDistrict({ divisionId, district });
            }
            await fetchDistricts();
            closeModal();
        } catch (err) {
            throw err;  // let modal handle error display
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDistrict(id);
            await fetchDistricts();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="p-6 text-gray-400 text-sm">Loading...</p>;
    if (error) return <p className="p-6 text-red-500 text-sm">{error}</p>;

    return (
        <div className="flex-1 bg-gray-50 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-medium">Districts</h2>
                    <p className="text-sm text-gray-500">{districts.length} districts total</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-green-50 text-sm px-4 py-2 rounded-lg"
                >
                    + Create district
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left w-10">#</th>
                            <th className="px-4 py-3 text-left">District name</th>
                            <th className="px-4 py-3 text-left">Division</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {districts.map((d, i) => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">{d.district}</td>
                                <td className="px-4 py-3 text-gray-600">{d.division_name}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${d.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                        {d.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(d)} // ✅ pass full object
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

            <DistrictModal
                isOpen={modal.open}
                editData={modal.editData}  // ✅ pass editData
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}