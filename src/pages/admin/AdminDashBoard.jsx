import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import DivisionList from "../../components/admin/division/DivisionList";
import DistrictList from "../../components/admin/district/DistrictList";
import OfficeList from "../../components/admin/create-office/OfficeList";
import PostList from "../../components/admin/post/PostList";
import AssignPostToOffice from "../../components/admin/assign-post-to-office/AssignPostTOffice";
import CreateUser from "../../components/admin/create-user/CreateUser";
import AssignPostToUser from "../../components/admin/assign-post-user/AssignPostToUser";
import ApplicationsList from "../../components/admin/application-type/ApplicationsList";

const CONTENT_MAP = {
    "division":      <DivisionList />,
    "district":      <DistrictList />,
    "create-office": <OfficeList/>,
    "post" : <PostList/> ,
    "assign-post": <AssignPostToOffice/>,
    "create-user" : <CreateUser/>,
    "assign-post-user" : <AssignPostToUser/>,
    "application-type" : <ApplicationsList/> , 
};

export default function AdminDashboard() {
    const [active, setActive] = useState(null);

    return (
        <div className="flex min-h-screen">
            <Sidebar active={active} onSelect={setActive} />
            <main className={`${active === "create-post" ? " flex justify-center items-center" : "flex-1"}`}>
                {active && CONTENT_MAP[active] ? (
                    CONTENT_MAP[active]
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Select a section from the sidebar
                    </div>
                )}
            </main>
        </div>
    );
}

// import { useEffect, useState } from "react";
// import AssignPostModal from "./AssignPostModal";
// import { getAllOffice } from "../../../services/office.service";
// import {
//   addPostInOffice,
//   deletePostFromOffice,
//   getAllPostForOffice,
// } from "../../../services/office_post";
// import { getAllDivisions } from "../../../services/devisoin.services";

// export default function AssignPostToOffice() {
//   const [offices, setOffices] = useState([]);
//   const [selectedOffice, setSelectedOffice] = useState("");
//   const [posts, setPosts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [step, setStep] = useState(1)
//   const [divisions, setDivisions] = useState([])

//   useEffect(() => {
//     fetchOffices();
//     fetchDivisons();
//   }, []);

//   const fetchOffices = async () => {
//     const data = await getAllOffice();
//     console.log("Fetched offices", data.data);
//     setOffices(data.data);
//   };
//   const fetchDivisons = async () => {
//     const data = await getAllDivisions();
//     const division = data.data.filter((d)=> d.isActive === true);
//     setDivisions(division);
//   };
//   const fetchDistrictByDivision = async(divisionId)=> {
//     const data = await fetchDistrictByDivision(divisionId);
//     console.log(data)
//   }

//   const fetchPosts = async (officeId) => {
//     try {
//       const res = await getAllPostForOffice(officeId);
//       console.log("posts",res.data.recordset)
//       setPosts(res.data.recordset || []);
//     } catch (err) {
//       console.error("Error fetching posts", err);
//       setPosts([]);
//     }
//   };

//   const handleOfficeChange = async (e) => {
//     const officeId = e.target.value;
//     setSelectedOffice(officeId);
//     if (officeId) fetchPosts(officeId);
//   };

//   const handleAssignPost = async ({ postId }) => {
//     const data = await addPostInOffice(selectedOffice, postId);
//     await fetchPosts(selectedOffice);
//     setModalOpen(false);
//   };
//   const handleDelete = async (postId) => {
//     console.log("Deleting postId:", postId); // 👈 debug

//     await deletePostFromOffice(selectedOffice, postId);
//     await fetchPosts(selectedOffice);
// };
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <h2 className="text-lg font-medium mb-4">
//         Assign Post to Office -{" "}
//         {offices.find((o) => o.id == selectedOffice)?.officeName || ""}
//       </h2>
//       {step === 1 && (
//   <div className="flex items-center justify-center min-h-[60vh]">
//     <div className="bg-white w-100 p-6 rounded-xl shadow border">

//       <h3 className="text-base font-medium mb-1">Select Division</h3>
//       <p className="text-sm text-gray-500 mb-4">
//         Choose a division to continue
//       </p>

//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {divisions.map((d) => (
//           <button
//             key={d.id}
//             onClick={() => handleDivisionSelect(d)}
//             className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition"
//           >
//             {d.division_name}
//           </button>
//         ))}
//       </div>
//     </div>
//      <div className="flex items-center justify-center min-h-[60vh]">
//     <div className="bg-white w-100 p-6 rounded-xl shadow border">

//       <h3 className="text-base font-medium mb-1">Select District</h3>
//       <p className="text-sm text-gray-500 mb-4">
//         {/* Division: <span className="font-medium">{selectedDivision?.division_name}</span> */}
//       </p>

//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {/* {districts.map((d) => (
//           <button
//             key={d.id}
//             onClick={() => handleDistrictSelect(d)}
//             className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition"
//           >
//             {d.district}
//           </button>
//         ))} */}
//       </div>

//       <button
//         onClick={() => setStep(1)}
//         className="mt-4 text-sm text-gray-500 hover:text-gray-700"
//       >
//         ← Back
//       </button>
//     </div>
//   </div>
//   </div>
  
// )}

// {/* STEP 2 → DISTRICT */}
 


//   <div className="flex items-center justify-center min-h-[60vh]">
//     <div className="bg-white w-[400px] p-6 rounded-xl shadow border">

//       <h3 className="text-base font-medium mb-1">Select Office</h3>
//       <p className="text-sm text-gray-500 mb-4">
//         {/* {selectedDivision?.division_name} / {selectedDistrict?.district} */}
//       </p>

//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {offices.map((o) => (
//           <button
//             key={o.id}
//             onClick={() => handleOfficeSelect(o)}
//             className="w-full text-left px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition"
//           >
//             {o.officeName}
//           </button>
//         ))}
//       </div>

//       <button
//         onClick={() => setStep(2)}
//         className="mt-4 text-sm text-gray-500 hover:text-gray-700"
//       >
//         ← Back
//       </button>
//     </div>
//   </div>


//       {/* Office Dropdown */}
//      {step === 2 &&  <div className="mb-5">
//         <label className="text-sm text-gray-600">Select Office</label>
//         <select
//           value={selectedOffice}
//           onChange={handleOfficeChange}
//           className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
//         >
//           <option value="">-- Select Office --</option>
//           {offices.map((o) => (
//             <option key={o.id} value={o.id}>
//               {o.officeName}
//             </option>
//           ))}
//         </select>
//       </div>}

//       {/* Table */}
//       {selectedOffice && (
//         <div className="bg-white border rounded-xl">
//           <div className="flex justify-between p-4 border-b">
//             <h3 className="text-sm font-medium">
//               Assigned Posts to{" "}
//               {offices.find((o) => o.id == selectedOffice)?.officeName || ""}
//             </h3>
//             <button
//               onClick={() => setModalOpen(true)}
//               className="text-sm bg-green-800 text-white px-3 py-1.5 rounded-lg"
//             >
//               + Add Post
//             </button>
//           </div>

//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-xs text-gray-500">
//               <tr>
//                 <th className="px-4 py-2 text-left">#</th>
//                 <th className="px-4 py-2 text-left">Post Name</th>
//                 <th className="px-4 py-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {posts.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} className="text-center py-4 text-gray-400">
//                     No posts assigned
//                   </td>
//                 </tr>
//               ) : (
//                 posts.map((p, i) => (
//                   <tr key={p.postId}>
//                     <td className="px-4 py-2">{i + 1}</td>
//                     <td className="px-4 py-2">{p.postName}</td>
//                     <td className="px-4 py-3 flex gap-2">
//                       <button
//                         onClick={() => handleDelete(p.postId)}
//                         className="text-xs border border-red-200 text-red-600 rounded px-2.5 py-1 hover:bg-red-50"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       <AssignPostModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleAssignPost}
//       />
//     </div>
//   );
// }