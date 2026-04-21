import { useState, useEffect } from "react";

export default function DivisionModal({ isOpen, onClose, onSubmit, editData, error }) {
    const [name, setName] = useState("");

    // reset name when modal opens or closes
    useEffect(() => {
        setName("");
    }, [isOpen]);

    if (!isOpen) return null;

    // ── CREATE ──
    if (!editData) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-4">Create division</h3>
                    <label className="text-xs text-gray-500 mb-1 block">Division name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && onSubmit({ name })}
                        autoFocus
                        placeholder="e.g. North Division"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                    <div className="flex justify-end gap-2 mt-5">
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={() => { if (name.trim()) onSubmit({ name: name.trim() }); }}
                            className="text-sm bg-green-800 hover:bg-green-700 text-green-50 px-4 py-1.5 rounded-lg"
                        >
                            Save division
                        </button>
                    </div>
                {error && <p className="p-6 text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        );
    }

    // ── EDIT (deactivate / activate) ──
    const isActive = editData.isActive;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                <h3 className="text-base font-medium mb-1">
                    {isActive ? "Deactivate division" : "Activate division"}
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                    {isActive
                        ? `Are you sure you want to deactivate "${editData.division_name}"?`
                        : `Are you sure you want to activate "${editData.division_name}"?`
                    }
                </p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit({ id: editData.id ,isActive :!editData.isActive})}
                        className={`text-sm px-4 py-1.5 rounded-lg text-white
                            ${isActive ? "bg-red-600 hover:bg-red-500" : "bg-green-800 hover:bg-green-700"}`}
                    >
                        {isActive ? "Deactivate" : "Activate"}
                    </button>
                </div>
            </div>
        </div>
    );
}