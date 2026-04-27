
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/user.services";
import { getAllApplications } from "../../../services/application_type";
import {
  saveUserPermissions,
  getUserPermissions,
} from "../../../services/userPermission.service.js";

const fields = ["VIEW", "EDIT", "FORWARD", "BACKWARD"];

export default function ManageUserPermissions() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    loadUsers();
    loadApplications();
  }, []);

  const loadUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data);
  };

  const loadApplications = async () => {
    const res = await getAllApplications();
    setApplications(res.data);
  };

  const loadExisting = async (userId) => {
    const res = await getUserPermissions(userId);
   console.log(res)
    const mapped = {};
    if(res.data.length > 0) {
        
    res.data.forEach((item) => {
      if (!mapped[item.applicationTypeId]) {
        mapped[item.applicationTypeId] = {};
      }

      mapped[item.applicationTypeId][item.permissionCode] = true;
    });

    setPermissions(mapped);
    }

  };

  const handleChange = (appId, code, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [code]: checked,
      },
    }));
  };

 const handleSave = async () => {
   const payload = {
     userId: selectedUser,
     officeId: 16,
     permissions: Object.entries(permissions).flatMap(([appId, perms]) =>
       Object.entries(perms)
         .filter(([_, value]) => value)
         .map(([key]) => ({
           applicationTypeId: Number(appId),
           permissionCode: key,
         })),
     ),
   };

   await saveUserPermissions(payload);

   alert("Saved successfully");

   // reset selected user
   setSelectedUser("");

   // uncheck all checkboxes
   setPermissions({});
 };

 return (
   <div className="min-h-screen bg-gray-50 p-6">
     <div className="max-w-6xl mx-auto">
       <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
         <h1 className="text-2xl font-bold text-gray-800">
           User Permission Management
         </h1>
         <p className="text-sm text-gray-500 mt-1">
           Assign application permissions to individual users
         </p>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
         <label className="block text-sm font-medium text-gray-700 mb-2">
           Select User
         </label>
         <select
           className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
           value={selectedUser}
           onChange={(e) => {
             setSelectedUser(e.target.value);
             loadExisting(e.target.value);
           }}
         >
           <option value="">Choose a user</option>
           {users.map((u) => (
             <option key={u.id} value={u.id}>
               {u.first_name} {u.last_name}
             </option>
           ))}
         </select>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
         <div className="px-6 py-4 border-b bg-gray-50">
           <h2 className="font-semibold text-gray-800">
             Application Permissions
           </h2>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-gray-100 text-gray-700">
               <tr>
                 <th className="px-4 py-3 text-left">Application</th>
                 {fields.map((f) => (
                   <th key={f} className="px-4 py-3 text-center">
                     {f}
                   </th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {applications.map((app, index) => (
                 <tr
                   key={app.id}
                   className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                 >
                   <td className="px-4 py-4 font-medium text-gray-800">
                     {app.applicationName}
                   </td>

                   {fields.map((f) => (
                     <td key={f} className="px-4 py-4 text-center">
                       <input
                         type="checkbox"
                         className="w-4 h-4 cursor-pointer"
                         checked={permissions[app.id]?.[f] || false}
                         onChange={(e) =>
                           handleChange(app.id, f, e.target.checked)
                         }
                       />
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         <div className="p-6 flex justify-end border-t bg-gray-50">
           <button
             onClick={handleSave}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
           >
             Save Permissions
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}