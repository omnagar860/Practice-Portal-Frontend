import { useState, useEffect } from "react";
import { getAllDivisions } from "../../../services/devisoin.services";

export default function DistrictModal({ isOpen, onClose, onSubmit, editData }) {
    const [step, setStep] = useState(1);
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [districtName, setDistrictName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setStep(1);
        setSelectedDivision(null);
        setDistrictName("");
        setError(null);
        setSuccessMsg(null);
        if (!editData) fetchDivisions(); // only fetch for create
    }, [isOpen, editData]);

    const fetchDivisions = async () => {
        try {
            setLoading(true);
            const data = await getAllDivisions();
            setDivisions(data.data);
        } catch (err) {
            setError("Failed to load divisions");
        } finally {
            setLoading(false);
        }
    };

    const handleDivisionSelect = (division) => {
        setSelectedDivision(division);
        setStep(2);
    };

    const handleCreate = async () => {
        if (!districtName.trim()) return;
        setError(null);
        setSuccessMsg(null);
        try {
            await onSubmit({
                divisionId: selectedDivision.id,
                district: districtName.trim()
            });
            setSuccessMsg(`"${districtName.trim()}" created successfully.`);
            setDistrictName("");
            onClose();
        } catch (err) {
            if (err.status === 409) {
                setError(`District "${districtName}" already exists.`);
            } else {
                setError(err.message || "Something went wrong.");
            }
        }
    };

    const handleToggleStatus = async () => {
        try {
            await onSubmit({ id: editData.id,isActive:!editData.isActive });
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    if (!isOpen) return null;

    // ── EDIT — activate / deactivate ──
    if (editData) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-1">
                        {editData.isActive ? "Deactivate district" : "Activate district"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {editData.isActive
                            ? `Are you sure you want to deactivate "${editData.district}"?`
                            : `Are you sure you want to activate "${editData.district}"?`
                        }
                    </p>
                    <p className="text-xs text-gray-400 mb-5">
                        Division: <span className="font-medium text-gray-600">{editData.division_name}</span>
                    </p>

                    {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleToggleStatus}
                            className={`text-sm px-4 py-1.5 rounded-lg text-white
                                ${editData.isActive ? "bg-red-600 hover:bg-red-500" : "bg-green-800 hover:bg-green-700"}`}
                        >
                            {editData.isActive ? "Deactivate" : "Activate"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── CREATE Step 1 — select division ──
    if (step === 1) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-1">Create district</h3>
                    <p className="text-sm text-gray-500 mb-4">First, select a division for this district.</p>

                    {loading && <p className="text-sm text-gray-400">Loading divisions...</p>}
                    {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {divisions.filter(d => d.isActive).map(d => (
                            <button
                                key={d.id}
                                onClick={() => handleDivisionSelect(d)}
                                className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                            >
                                <span className="font-medium">{d.division_name}</span>
                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                    Active
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-5">
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── CREATE Step 2 — enter district name ──
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                <h3 className="text-base font-medium mb-1">Create district</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Division: <span className="font-medium text-gray-700">{selectedDivision?.division_name}</span>
                </p>

                <label className="text-xs text-gray-500 mb-1 block">District name</label>
                <input
                    type="text"
                    value={districtName}
                    onChange={e => setDistrictName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCreate()}
                    autoFocus
                    placeholder="e.g. Jaipur North"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                {successMsg && <p className="text-xs text-green-600 mt-2">{successMsg}</p>}

                <div className="flex justify-between mt-5">
                    <button
                        onClick={() => { setStep(1); setError(null); setSuccessMsg(null); }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="text-sm bg-green-800 hover:bg-green-700 text-green-50 px-4 py-1.5 rounded-lg"
                        >
                            Save district
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}