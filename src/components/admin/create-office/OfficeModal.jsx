import { useState, useEffect } from "react";
import { getDistrictByDivisionId } from "../../../services/district.services";

export default function OfficeModal({ isOpen, onClose, onSubmit, editData, divisions, offices ,error, setError}) {
    const [step, setStep] = useState(1);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [districtsForDivision, setDistrictsForDivision] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false);
    const [officeName, setOfficeName] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [pincode, setPincode] = useState("");
    // const [error, setError] = useState(null);
    // console.log(divisions)

    useEffect(() => {
        if (!isOpen) return;
        if (editData) {
            setOfficeName(editData.office_name || "");
            setAddress(editData.address1 || "");
        } else {
            setStep(1);
            setSelectedDivision(null);
            setSelectedDistrict(null);
            setDistrictsForDivision([]);
            setOfficeName("");
            setAddress("");
        }
        setError(null);
    }, [isOpen, editData]);
    useEffect(() => {
    if (selectedDistrict) {
        setOfficeName(`Practice Portal ${selectedDistrict}`);
    }
}, [selectedDistrict]);

    // ✅ Fetch districts from backend when division is selected
    const handleDivisionSelect = async (division) => {
        // alert("division")
    // console.log("division", division)
    setSelectedDivision(division.division);        // ✅ store full division object
    setDistrictsForDivision([]);
    setDistrictLoading(true);
    setError(null);
    try {
        // console.log("division==========",division)
        const data = await getDistrictByDivisionId(division.id); 
        // console.log("data==============",data) // ✅ fetch by id
        if(data.data.length === 0) return setError("No district availavlbe in selected division")
        setDistrictsForDivision(data.data);  // ✅ response is { data: [...] }
        setStep(2);
    } catch (err) {
        setError("Failed to load districts.");
    } finally {
        setDistrictLoading(false);
    }
};

    const handleSubmit = async () => {
        setOfficeName(`Practice Portal ${selectedDistrict}`)
        if (!officeName.trim()) {
            setError("Office name is required.");
            return;
        }
        setError(null);
        try {
            if (editData) {
                await onSubmit({
                    id: editData.id,
                    office_name: officeName.trim(),
                    address: address.trim()
                });
            } else {
                if(/[0-9],[0-9],[0-9],[0-9],[0-9],[0-9]/.test(pincode)) return "Enter a valid pincode"
                // alert("selecteddivision")
                console.log(selectedDivision);
                console.log("pincode", pincode)
                await onSubmit({
                    officeName: officeName.trim(),
                    address: address.trim(),
                    division: selectedDivision,
                    district: selectedDistrict,
                    area : area.trim(),
                    pincode : pincode
                });
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    if (!isOpen) return null;

    // ── EDIT modal ──
    // ── EDIT modal — deactivate confirmation ──
if (editData) {
    console.log("office modal", editData)
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                <h3 className="text-base font-medium mb-1">
                    {editData.isActive ? "Deactivate office" : "Activate office"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                    {editData.isActive
                        ? `Are you sure you want to deactivate "${editData.office_name}"?`
                        : `Are you sure you want to activate "${editData.office_name}"?`
                    }
                </p>
                <p className="text-xs text-gray-400 mb-5">
                    {editData.division} / {editData.district}
                </p>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit({ id: editData.id })}
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
    // if (editData) {
    //     return (
    //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    //             <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
    //                 <h3 className="text-base font-medium mb-4">Edit office</h3>
    //                 <div className="space-y-3">
    //                     <div>
    //                         <label className="text-xs text-gray-500 mb-1 block">Office name</label>
    //                         <input
    //                             type="text"
    //                             value={officeName}
    //                             onChange={e => setOfficeName(e.target.value)}
    //                             autoFocus
    //                             className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
    //                         />
    //                     </div>
    //                     <div>
    //                         <label className="text-xs text-gray-500 mb-1 block">Address</label>
    //                         <input
    //                             type="text"
    //                             value={address}
    //                             onChange={e => setAddress(e.target.value)}
    //                             className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
    //                         />
    //                     </div>
    //                 </div>
    //                 {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    //                 <div className="flex justify-end gap-2 mt-5">
    //                     <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
    //                         Cancel
    //                     </button>
    //                     <button onClick={handleSubmit} className="text-sm bg-green-800 hover:bg-green-700 text-green-50 px-4 py-1.5 rounded-lg">
    //                         Update office
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // ── CREATE Step 1 — select division ──
    if (step === 1) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-1">Create office</h3>
                    <p className="text-sm text-gray-500 mb-4">Step 1 of 3 — Select a division</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {divisions.map(d => (
                            <button
                                key={d.id}
                                onClick={() => handleDivisionSelect(d)}  // ✅ fetch districts on click
                                className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors font-medium"
                            >
                                {d.division}
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

    // ── CREATE Step 2 — select district ──
    if (step === 2) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                    <h3 className="text-base font-medium mb-1">Create office</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Step 2 of 3 — Select a district
                        <span className="ml-1 text-gray-700 font-medium">{selectedDivision.division_name}</span>
                    </p>

                    {/* ✅ Loading state while fetching */}
                    {districtLoading && (
                        <p className="text-sm text-gray-400">Loading districts...</p>
                    )}

                    {!districtLoading && districtsForDivision.length === 0 && (
                        <p className="text-sm text-gray-400">No districts found for this division.</p>
                    )}

                    {!districtLoading && districtsForDivision.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {districtsForDivision.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => { setSelectedDistrict(d.district); setStep(3); }}
                                    className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors font-medium"
                                >
                                    {d.district}
                                </button>
                            ))}
                        </div>
                    )}

                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                    <div className="flex justify-between mt-5">
                        <button
                            onClick={() => { setStep(1); setDistrictsForDivision([]); }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back
                        </button>
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── CREATE Step 3 — enter office name and address ──
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 w-96">
                <h3 className="text-base font-medium mb-1">Create office</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Step 3 of 3 —
                    <span className="text-gray-700 font-medium"> {selectedDivision?.division_name}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-gray-700 font-medium">{selectedDistrict}</span>
                </p>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Office name</label>
                        <input
                            type="text"
                            value={officeName}
                            autoFocus
                            disabled
                            placeholder="e.g. District Collectorate"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="e.g. Civil Lines, Kota"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Area</label>
                        <input
                            type="text"
                            value={area}
                            onChange={e => setArea(e.target.value)}
                            placeholder="e.g. Civil Lines, Kota"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Pincode</label>
                        <input
                            type="number"
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            placeholder="325620"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                <div className="flex justify-between mt-5">
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSubmit} className="text-sm bg-green-800 hover:bg-green-700 text-green-50 px-4 py-1.5 rounded-lg">
                            Save office
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}