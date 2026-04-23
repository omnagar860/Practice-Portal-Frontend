import { useEffect, useState } from "react";
import { getAllOffice } from "../../../services/office.service";
import {
  addPostInOffice,
  deletePostFromOffice,
  getAllPostForOffice,
} from "../../../services/office_post";
import { getAllDivisions } from "../../../services/devisoin.services";
import { getDistrictByDivisionId } from "../../../services/district.services";
import AssignPostUserModal from "./AssignPostUserModal";
import { getAllUsers } from "../../../services/user.services";
import { getAllPost } from "../../../services/post.services";
import {
  assignPostToUser,
  getUserPost,
} from "../../../services/assignPostToUser";

export default function AssignPostToUser() {
  const [offices, setOffices] = useState([]);
  const [divisions, setDivisions] = useState([]);
const [showChangePostModal, setShowChangePostModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [newSelectedPost, setNewSelectedPost] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [usersPost, setusersPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [assignError, setAssignError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // add post modal
  const [showOfficeModal, setShowOfficeModal] = useState(true); // selection modal
  const [step, setStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allPostList, setAllPostList] = useState([]);

  useEffect(() => {
    fetchOffices();
    fetchDivisions();
    fetchUsers();
    getAllPosts();
  }, []);

  const fetchOffices = async () => {
    const data = await getAllOffice();
    setOffices(data.data);
  };

  const fetchDivisions = async () => {
    const data = await getAllDivisions();
    console.log(data.data);
    setDivisions(data.data.filter((d) => d.isActive));
  };
  const getAllPosts = async () => {
    const data = await getAllPost();
    console.log("poast data", data);
    setAllPostList(
      data.data.map((p) => {
        return { id: p.id, postName: p.postName };
      }),
    );
  };
  console.log("allPostList", allPostList);

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
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // alert("user list")
  console.log(user);

  // ✅ STEP HANDLERS
  const handleDivisionSelect = (division) => {
    setSelectedDivision(division);
    fetchDistrict(division.id);
    setStep(2);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    fetchUsers();
    setStep(3);
  };

  const handleOfficeSelect = async (office) => {
    setSelectedOffice(office.id);

    await fetchUsers();

    setStep(4); // move to user list
  };

  const handleChangePostDirectly = async (post) => {
    try {
      await assignPostToUser(selectedUser.id, post.id);

      const updated = await getUserPost(selectedUser.id);

      setusersPosts(updated.data || []);

      setShowChangePostModal(false);
    } catch (error) {
      setAssignError(error.message);
    }
  };
 const handleUserSelect = async (user) => {
   setSelectedUser(user);

   const res = await getUserPost(user.id);

   setusersPosts(res.data || []);

   setStep(5);
 };
 const handlePostSelection = (post) => {
   // if already same post selected
   if (usersPost.length > 0 && usersPost[0].postId === post.id) {
     return;
   }

   // if user already has some post → ask confirmation
   if (usersPost.length > 0) {
     setNewSelectedPost(post);
     setShowConfirmModal(true);
     return;
   }

   // no existing post → direct assign
   handleAssignPostToUser(post.id);
 };
const confirmPostChange = async () => {
  try {
    setAssignError("");

    await handleAssignPostToUser(newSelectedPost.id);

    // close confirm popup
    setShowConfirmModal(false);

    // close full post selection modal
    setShowOfficeModal(false);

    // reset temp state
    setNewSelectedPost(null);
  } catch (error) {
    setAssignError(error.message || "Failed to change post");
  }
};
 const assignedPostIds = usersPost.map((p) => p.postId);
const handleAssignPostToUser = async (postId) => {
  try {
    setAssignError("");

    await assignPostToUser(selectedUser.id, postId);

    const updatedPosts = await getUserPost(selectedUser.id);

    setusersPosts(updatedPosts.data || []);
  } catch (error) {
    setAssignError(error.message || "Something went wrong");
    throw error;
  }
};

  //   const handleOfficeSelect = async (office) => {
  //     setSelectedOffice(office.id);
  //     // setShowOfficeModal(true);
  //     await fetchPosts(office.id);
  //       setStep(3);
  //   };

  // ✅ POST ACTIONS
  const handleAssignPost = async ({ postId }) => {
    try {
      setAssignError(""); // reset old error
      const res = await (selectedOffice, postId);
      console.log("res from api ", res);

      if (!res.success) {
        setAssignError(res.message); // 👈 show backend message
        return;
      }

      await fetchPosts();
      setModalOpen(false);
    } catch (error) {
      setAssignError(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (postId) => {
    await deletePostFromOffice(selectedOffice, postId);
    await fetchPosts();
  };
  console.log("selectedDistrict", selectedDistrict);
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
                  {divisions.map((d) => (
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
                  {districts.map((d) => (
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
            {/* STEP 4 */}
            {step === 4 && (
              <>
                <h3 className="font-semibold mb-4">Select User</h3>

                <select
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => {
                    const selected = user.find((u) => u.id === e.target.value);

                    handleUserSelect(selected);
                  }}
                >
                  <option value="">Select User</option>

                  {user.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setStep(3)}
                  className="mt-3 text-sm text-gray-500"
                >
                  ← Back
                </button>
              </>
            )}

            {step === 5 && (
              <>
                <h3 className="font-semibold text-lg mb-4">
                  Assign Post to {selectedUser?.first_name}
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {allPostList.map((p) => {
                    const isAssigned = assignedPostIds.includes(p.id);

                    return (
                      <button
                        key={p.id}
                        disabled={isAssigned}
                        onClick={() => handlePostSelection(p)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition
              ${
                isAssigned
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-green-50 border-green-200"
              }`}
                      >
                        <div className="flex justify-between">
                          <span>{p.postName}</span>

                          {isAssigned && (
                            <span className="text-xs">Already Assigned</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {assignError && (
                  <p className="text-red-500 mt-3 text-sm">{assignError}</p>
                )}

                <button
                  onClick={() => setStep(4)}
                  className="mt-4 text-sm text-gray-500"
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
            Assign Post to User -{" "}
            {selectedUser.first_name.slice(0, 1).toUpperCase() +
              selectedUser.first_name.slice(1)}{" "}
            {selectedUser.last_name.slice(0, 1).toUpperCase() +
              selectedUser.last_name.slice(1)}
            {/* {offices.find((o) => o.id == selectedOffice)?.officeName} */}
          </h2>

          <div className="bg-white border rounded-xl">
            <div className="flex justify-between p-4 border-b">
              <h3 className="text-sm font-medium">Assigned Posts</h3>
              {/* <button
                onClick={() => setModalOpen(true)}
                className="text-sm bg-green-800 text-white px-3 py-1.5 rounded-lg"
              >
                + Add Post
              </button> */}
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Post Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersPost.length > 0 ? (
                  <tr>
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-medium">
                      {usersPost[0].postName}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-green-600 font-medium">Active</span>
                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => setShowChangePostModal(true)}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700"
                      >
                        Change Post
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">
                      No post assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 🔥 ADD POST MODAL */}
      <AssignPostUserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAssignError("");
        }}
        onSubmit={handleAssignPost}
        error={assignError}
      />

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Change Assigned Post
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              This user already has a post assigned.
            </p>

            <div className="bg-gray-50 border rounded-xl p-4 mb-5">
              <p className="text-sm">
                <span className="font-medium">Current:</span>{" "}
                {usersPost[0]?.postName}
              </p>

              <p className="text-sm mt-2">
                <span className="font-medium">New:</span>{" "}
                {newSelectedPost?.postName}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to replace this post?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setNewSelectedPost(null);
                }}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmPostChange}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}
      {showChangePostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[450px] p-6 relative">
            <button
              onClick={() => setShowChangePostModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Change Post for {selectedUser?.first_name}
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {allPostList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleChangePostDirectly(p)}
                  className="w-full text-left px-4 py-3 rounded-xl border hover:bg-green-50"
                >
                  {p.postName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
