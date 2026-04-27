import { useEffect, useState } from "react";
import AssignPostModal from "./AssignPostModal";
import { getAllOffice } from "../../../services/office.service";
import {
  addPostInOffice,
  deletePostFromOffice,
  getAllPostForOffice,
} from "../../../services/office_post";
import { getAllDivisions } from "../../../services/devisoin.services";
import { getDistrictByDivisionId } from "../../../services/district.services";

export default function AssignPostToOffice() {
  const [offices, setOffices] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [posts, setPosts] = useState([]);
const [assignError, setAssignError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // add post modal
  const [showOfficeModal, setShowOfficeModal] = useState(true); // selection modal
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchOffices();
    fetchDivisions();
  }, []);

  const fetchOffices = async () => {
    const data = await getAllOffice();
    setOffices(data.data);
  };

  const fetchDivisions = async () => {
    const data = await getAllDivisions();
    console.log(data.data)
    setDivisions(data.data.filter((d) => d.isActive));
  };
 const fetchDistrict = async (divisionId) => {
  try {
    const res = await getDistrictByDivisionId(divisionId);

    // console.log("District API:", res.data);

    // ✅ IMPORTANT: store in state
    setDistricts(res.data || []);

  } catch (error) {
    console.error("Error fetching districts", error);
    setDistricts([]);
  }
};


  const fetchPosts = async (officeId) => {
    try {
      const res = await getAllPostForOffice(officeId);
      setPosts(res.data.recordset || []);
    } catch (err) {
      setPosts([]);
    }
  };

  // ✅ STEP HANDLERS
  const handleDivisionSelect = (division) => {
    setSelectedDivision(division);
    fetchDistrict(division.id)
    setStep(2);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setStep(3);
  };

  const handleOfficeSelect = async (office) => {
    setSelectedOffice(office.id);
    setShowOfficeModal(false);
    await fetchPosts(office.id);
  };

  // ✅ POST ACTIONS
const handleAssignPost = async ({ postId }) => {
  try {
    setAssignError(""); // reset old error
    const res = await addPostInOffice(selectedOffice, postId);

    console.log("res=============", res)
    if (!res.success) {
      alert("inside error")
      setAssignError(res.message); // 👈 show backend message
      await fetchPosts(selectedOffice);
      return;
    }

    await fetchPosts(selectedOffice);
    setModalOpen(false);

  } catch (error) {
    alert("inside catch ")
    console.log("error in catch===================", error)
    setAssignError(error.message || "Something went wrong");
  }
};

  const handleDelete = async (postId) => {
    await deletePostFromOffice(selectedOffice, postId);
    await fetchPosts(selectedOffice);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔥 STEP MODAL */}
      {showOfficeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-100 p-6 rounded-xl shadow border relative">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3 className="font-medium mb-3">Select Division</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {divisions
                    .sort((a, b) =>
                      a.division_name.localeCompare(b.division_name),
                    )
                    .map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleDivisionSelect(d)}
                        className="w-full text-left px-3 py-2 border rounded-lg hover:bg-green-50"
                      >
                        {d.division_name}
                      </button>
                    ))}
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h3 className="font-medium mb-3">Select District</h3>

                <div className="space-y-2">
                  {districts.length === 0 && (
                    <div>
                      <p>No districts available in selected divsion. </p>
                      <button></button>
                    </div>
                  )}
                  {districts.length > 0 &&
                    districts
                      .sort((a, b) => a.district.localeCompare(b.district))
                      .map((d) => (
                        <button
                          key={d.id}
                          onClick={() => handleDistrictSelect(d)}
                          className="w-full text-left px-3 py-2 border rounded-lg hover:bg-green-50"
                        >
                          {d.district}
                        </button>
                      ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="mt-3 text-sm text-gray-500"
                >
                  ← Back
                </button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h3 className="font-medium mb-3">Select Office</h3>

                {offices.filter(
                  (o) =>
                    o.division === selectedDivision.division_name &&
                    o.district === selectedDistrict.district,
                ).length === 0 ? (
                  // ❌ NO OFFICE FOUND UI
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-2">
                      No office found for this district
                    </p>

                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-green-700 underline"
                    >
                      Try another district
                    </button>
                  </div>
                ) : (
                  // ✅ OFFICE LIST
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {offices
                      .filter(
                        (o) =>
                          o.division === selectedDivision.division_name &&
                          o.district === selectedDistrict.district,
                      )
                      .sort((a, b) => a.officeName.localeCompare(b.officeName))
                      .map((o) => (
                        <button
                          key={o.id}
                          onClick={() => handleOfficeSelect(o)}
                          className="w-full text-left px-3 py-2 border rounded-lg hover:bg-green-50"
                        >
                          {o.officeName}
                        </button>
                      ))}
                  </div>
                )}

                {/* BACK BUTTON */}
                <button
                  onClick={() => setStep(2)}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
              </>
            )}
            <button
              onClick={() => setShowOfficeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MAIN UI AFTER SELECTION */}
      {!showOfficeModal && selectedOffice && (
        <>
          <h2 className="text-lg font-medium mb-4">
            Assign Post to Office -{" "}
            {offices.find((o) => o.id == selectedOffice)?.officeName}
          </h2>

          <div className="bg-white border rounded-xl">
            <div className="flex justify-between p-4 border-b">
              <h3 className="text-sm font-medium">Assigned Posts</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm bg-green-800 text-white px-3 py-1.5 rounded-lg"
              >
                + Add Post
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Post Name</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">
                      No posts assigned
                    </td>
                  </tr>
                ) : (
                  posts
                    .sort((a, b) => a.postName.localeCompare(b.postName))
                    .map((p, i) => (
                      <tr key={p.postId}>
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{p.postName}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(p.postId)}
                            className="text-xs border border-red-200 text-red-600 rounded px-2 py-1 hover:bg-red-50"
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
        </>
      )}

      {/* 🔥 ADD POST MODAL */}
      <AssignPostModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAssignError("");
        }}
        onSubmit={handleAssignPost}
        error={assignError}
      />
    </div>
  );
}
