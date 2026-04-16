import { useState, useEffect } from "react";
import OfficeModal from "./OfficeModal";
import {
  getAllOffice,
  updateOffice,
  deleteOffice,
  createOffice,
} from "../../../services/office.service.js";
import { getAllDivisions } from "../../../services/devisoin.services.js";

export default function OfficeList() {
  const [offices, setOffices] = useState([]);
  const [division, setDivision] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, editData: null });
  const [filterDivision, setFilterDivision] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  useEffect(() => {
    fetchAll();
    getAllDivisions();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getAllOffice();
      console.log("fectched office list", data)
      const divisionData = await getAllDivisions();
      // console.log("divisionData", divisionData.data)
      setDivision(divisionData.data);
      setOffices(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Extract unique divisions from offices array
  const divisions = [...new Set(offices.map((o) => o.division))];
  const divisionInModal = division.map((d) => {
    return { id: d.id, division: d.division_name };
  });
  console.log("divisionInModal", divisionInModal);

  // ✅ Districts filtered by selected division
  const districts = filterDivision
    ? [
        ...new Set(
          offices
            .filter((o) => o.division === filterDivision)
            .map((o) => o.district),
        ),
      ]
    : [...new Set(offices.map((o) => o.district))];

  // ✅ Filter offices by selected division and district
  const filtered = offices.filter((o) => {
    if (filterDivision && o.division !== filterDivision) return false;
    if (filterDistrict && o.district !== filterDistrict) return false;
    return true;
  });

  const handleDelete = async (id) => {
    try {
      await deleteOffice(id); // ✅ calls the imported service function
      await fetchAll(); // ✅ refresh table
    } catch (err) {
      console.error("Error deleting office:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (data) => {
    try {
      // ✅ UPDATE (activate/deactivate)
      if (data.id) {
        await updateOffice(data.id);

        setOffices((prev) =>
          prev.map((o) =>
            o.id === data.id
              ? { ...o, isActive: !o.isActive } // toggle
              : o,
          ),
        );
      }

      // ✅ CREATE NEW OFFICE
      else {
        // console.log("officeData", data);
        await createOffice(data); // 🔥 call API

        await fetchAll(); // refresh list
      }

      closeModal();
    } catch (err) {
      throw err;
    }
  };
  //     const handleSubmit = async ({ id, isActive }) => {
  //     try {
  //         if (id) {
  //             console.log(id)
  //             const result =  await updateOffice(id);
  //             console.log(result)
  //             // TODO: await updateOffice(id, { isActive: 0 });
  //             setOffices(prev => prev.map(o => o.id === id ? { ...o, isActive: false } : o));
  //         }
  //         closeModal();
  //     } catch (err) {
  //         throw err;
  //     }
  // };

  const openCreateModal = () => setModal({ open: true, editData: null });
  const openEditModal = (office) => setModal({ open: true, editData: office });
  const closeModal = () => setModal({ open: false, editData: null });

  if (loading) return <p className="p-6 text-gray-400 text-sm">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-sm">{error}</p>;

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-medium">Offices</h2>
          <p className="text-sm text-gray-500">
            {filtered.length} offices total
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-green-50 text-sm px-4 py-2 rounded-lg"
        >
          + Create office
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Filter by division</label>
          <select
            value={filterDivision}
            onChange={(e) => {
              setFilterDivision(e.target.value);
              setFilterDistrict(""); // ✅ reset district when division changes
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 outline-none focus:border-green-500 min-w-40"
          >
            <option value="">All divisions</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Filter by district</label>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 outline-none focus:border-green-500 min-w-40"
            disabled={filterDivision}
          >
            <option value="">All districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {(filterDivision || filterDistrict) && (
          <div className="flex flex-col justify-end">
            <button
              onClick={() => {
                setFilterDivision("");
                setFilterDistrict("");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
            <tr>
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Office name</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Division</th>
              <th className="px-4 py-3 text-left">District</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No offices found
                </td>
              </tr>
            ) : (
              filtered.map((o, i) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{o.officeName}</td>
                  <td className="px-4 py-3 text-gray-600"> {`${o.address}, ${o.area}`}</td>
                  <td className="px-4 py-3 text-gray-600">{o.division}</td>
                  <td className="px-4 py-3 text-gray-600">{o.district}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                                            ${o.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {o.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(o)}
                      className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="text-xs border border-red-200 text-red-600 rounded px-2.5 py-1 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OfficeModal
        isOpen={modal.open}
        editData={modal.editData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        divisions={divisionInModal} // string array
        districts={districts} // string array — already filtered by division in parent
        offices={offices} // ✅ pass full offices so modal can filter districts by division
      />
    </div>
  );
}
