import React, { useState } from "react";
import { useEffect } from "react";
import { getAllApplications } from "../../../services/application_type";
import { getAllOffice } from "../../../services/office.service";
import { getPostByOfficeId } from "../../../services/post.services";
import { getPrivilegesByOfficePost, savePrivileges } from "../../../services/priviliges.services";

const Priviliges = () => {
  const [applications, setApplications] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [officeList, setOfficeList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState("")
  const [selectedPostId, setSelectedPostId] = useState("")
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false)
  useEffect(() => {
    getOfficeData();
    getAllApplicationList();
  }, []);
  useEffect(() => {
    if (selectedOfficeId) {
      getPostData(selectedOfficeId);
    } else {
      setPostList([]);
    }
  }, [selectedOfficeId]);

  useEffect(() => {
    if (selectedOfficeId && selectedPostId) {
      loadExistingPermissions();
    }
  }, [selectedOfficeId, selectedPostId]);

  const loadExistingPermissions = async () => {
    try {
      const result = await getPrivilegesByOfficePost(
        selectedOfficeId,
        selectedPostId,
      );

      const mappedPermissions = {};

      result.data.forEach((item) => {
        const appId = item.applicationTypeId;

        if (!mappedPermissions[appId]) {
          mappedPermissions[appId] = {};
        }

        const key =
          item.permissionCode === "BACK_TO_CITIZEN"
            ? "backToCitizen"
            : item.permissionCode.toLowerCase();

        mappedPermissions[appId][key] = true;
      });

      Object.keys(mappedPermissions).forEach((appId) => {
        const row = mappedPermissions[appId];

        row.allPermission = permissionFields.every((field) => row[field]);
      });

      setPermissions(mappedPermissions);
    } catch (error) {
      console.log("Error loading permissions", error);
    }
  };

  const permissionFields = [
    "view",
    "edit",
    "forward",
    "backward",
    "backToCitizen",
  ];

  const handleChange = (app, field, checked) => {
    setPermissions((prev) => {
      const current = prev[app.id] || {};

      // If Give All is clicked
      if (field === "allPermission") {
        return {
          ...prev,
          [app.id]: {
            view: checked,
            edit: checked,
            forward: checked,
            backward: checked,
            backToCitizen: checked,
            allPermission: checked,
          },
        };
      }

      // Update single permission
      const updatedRow = {
        ...current,
        [field]: checked,
      };

      // Auto check/uncheck Give All
      const allChecked = permissionFields.every(
        (key) => updatedRow[key] === true,
      );

      updatedRow.allPermission = allChecked;

      return {
        ...prev,
        [app.id]: updatedRow,
      };
    });
  };

const handleSavePrivileges = async () => {
  try {
    setError("");
    setSuccessMessage("");
    if (!selectedOfficeId) {
      setError("Please select office");
      return;
    }

    if (!selectedPostId) {
      setError("Please select post");
      return;
    }

    const payload = {
      officeId: Number(selectedOfficeId),
      postId: Number(selectedPostId),

      privileges: Object.entries(permissions).flatMap(
        ([applicationTypeId, perms]) =>
          Object.entries(perms)
            .filter(([key, value]) => value === true && key !== "allPermission")
            .map(([key]) => ({
              applicationTypeId: Number(applicationTypeId),
              permissionCode:
                key === "backToCitizen" ? "BACK_TO_CITIZEN" : key.toUpperCase(),
            })),
      ),
    };

    const result = await savePrivileges(payload);

    if (result.success) {
      setSuccessMessage("Privileges saved successfully");
    }
  } catch (error) {
    setError("Error while saving privileges",error);
    throw new Error(error)
  }
};

  const getOfficeData = async()=> {
    try {
        setIsLoading(true);
        const data = await getAllOffice();
        setOfficeList(data.data)
        setIsLoading(false)
    } catch (error) {
        console.log("Error while getting office data", error);
    }
  }

  const getPostData = async (officeId) => {
      try {
        setIsLoading(true);
        const data = await getPostByOfficeId(officeId);
        setPostList(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error while getting post data", error);
      }
  };

  const getAllApplicationList = async () => {
    try {
      setIsLoading(true);
      const result = await getAllApplications();
      setApplications(result.data);
      setIsLoading(false)
    } catch (error) {
      console.log("Error while fetching application type", error);
    }
  };

//   console.log(permissions);
// console.log(officeList)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Priviliges
          </h1>
          <p className="text-gray-500 mt-1">
            Configure and manage application privileges and permissions easily
          </p>
        </div>
      </div>
      <div className="ml-4 flex  gap-x-50">
        <label className="" htmlFor="office">
          Select Office:
          <select
            className="border px-2 py-0.5 bg-gray-100 cursor-pointer  ml-4"
            name="office"
            id="office"
            value={selectedOfficeId}
            onChange={(e) => setSelectedOfficeId(e.target.value)}
          >
            <option value="">---Select Office---</option>
            {officeList.map((o) => {
              return (
                <option key={o.officeName} value={o.id}>
                  {" "}
                  {o.officeName}{" "}
                </option>
              );
            })}
          </select>
        </label>
        <label className="" htmlFor="post">
          Select Post:
          <select
            id="post"
            className="border px-2 py-0.5 bg-gray-100 cursor-pointer ml-4"
            value={selectedPostId}
            onChange={(e) => {setSelectedPostId(e.target.value) 
              setSuccessMessage("");}}
          >
            {postList.length === 0 && <option>No post available in this office.</option>}
            {postList.length > 0 &&  <option value="">---Select Post---</option>}
            {postList.map((p) => {
              return (
                <option key={p.postId} value={p.postId}>
                  {" "}
                  {p.postName}{" "}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Applications List
          </h2>

          {/* <input
                    type="text"
                    placeholder="Search application..."
                    className="border border-gray-300 rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Application Type</th>
                <th className="px-4 py-3 font-semibold">View</th>
                <th className="px-4 py-3 font-semibold">Edit</th>
                <th className="px-4 py-3 font-semibold">Forward</th>
                <th className="px-4 py-3 font-semibold">Backward</th>
                <th className="px-4 py-3 font-semibold">Back to Citizen</th>
                <th className="px-4 py-3 font-semibold">Give All</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{idx + 1}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {app.applicationName}
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.view || false}
                      onChange={(e) =>
                        handleChange(app, "view", e.target.checked)
                      }
                    />
                  </td>

                  {/* Edit */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.edit || false}
                      onChange={(e) =>
                        handleChange(app, "edit", e.target.checked)
                      }
                    />
                  </td>

                  {/* Forward */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.forward || false}
                      onChange={(e) =>
                        handleChange(app, "forward", e.target.checked)
                      }
                    />
                  </td>

                  {/* Backward */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.backward || false}
                      onChange={(e) =>
                        handleChange(app, "backward", e.target.checked)
                      }
                    />
                  </td>

                  {/* Back To Citizen */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.backToCitizen || false}
                      onChange={(e) =>
                        handleChange(app, "backToCitizen", e.target.checked)
                      }
                    />
                  </td>

                  {/* Give All */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={permissions[app.id]?.allPermission || false}
                      onChange={(e) =>
                        handleChange(app, "allPermission", e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex flex-col justify-end">
            <button
              onClick={handleSavePrivileges}
              className="bg-blue-600 self-end max-w-40 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Save Privileges
            </button>
            <div className="mt-3 self-end">
              {successMessage && (
                <p className="text-green-600 text-sm">{successMessage}</p>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Priviliges;
