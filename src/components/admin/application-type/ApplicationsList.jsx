import React, { useEffect, useState } from "react";
import {
  createNewApplication,
  deleteApplication,
  getAllApplications,
  updateApplication,
} from "../../../services/application_type.js";

const ApplicationsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [applicationTypeData, setApplicationTypeData] = useState({
    applicationName: "",
    applicationCategory: "",
  });

  useEffect(() => {
    getAllApplicationList();
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    setApplicationTypeData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const getAllApplicationList = async () => {
    try {
      setIsLoading(true);
      const result = await getAllApplications();
      setApplications(result.data);
      // alert("result fetched application type")
      // console.log(result)
    } catch (error) {}
  };

  const updateApplicationById = async (id, isActive) => {
    try {
      await updateApplication(id, !isActive);
      getAllApplicationList();
    } catch (error) {
      setError("Error while updating application.");
    }
  };
  const deleteApplicationById = async (id) => {
    try {
      await deleteApplication(id);
      getAllApplicationList();
    } catch (error) {
      setError("Error while deleting application.");
    }
  };

  const handleSaveApplication = async () => {
    try {
      setError(null);
      if (!applicationTypeData.applicationName)
        setError("Please enter application name");
      if (!applicationTypeData.applicationCategory)
        setError("Please select application type");
      if (
        !applicationTypeData.applicationName &&
        !applicationTypeData.applicationCategory
      )
        setError("Please select application name & application type.");
      // console.log("application data", applicationTypeData)
      const result = await createNewApplication(applicationTypeData);
      if (result.success) {
        setError(null);
        setIsOpen(false);
        setApplicationTypeData("");
        getAllApplicationList();
      }
    } catch (error) {
      throw new Error("Error while creating a new application tpye.");
    }
  };
  const openModal = (type, app) => {
    setModalType(type);
    setSelectedApp(app);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalType("");
    setSelectedApp(null);
  };

  const editModal = (isActive) => {
    return (
      <modal>
        <p>Are you sure want to {isActive ? "deactive" : "active"}</p>
        <p>
          <button>Cancel</button>
          <button> {isActive ? "Deactive" : "Active"} </button>
        </p>
      </modal>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Application Management
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage application types easily
            </p>
          </div>

          <button
            className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium transition duration-300 shadow-md cursor-pointer"
            onClick={handleClick}
          >
            + Add Application
          </button>
        </div>

        {/* Form Section */}
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-5">
              Add New Application
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Name */}
              <div>
                <label
                  htmlFor="applicationName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Application Name
                </label>
                <input
                  id="applicationName"
                  name="applicationName"
                  type="text"
                  placeholder="Eg. Factory Registration Renewal"
                  value={applicationTypeData.applicationName}
                  onChange={(e) => handleChange(e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Application Category */}
              <div>
                <label
                  htmlFor="applicationCategory"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Application Category
                </label>
                <select
                  id="applicationCategory"
                  name="applicationCategory"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={applicationTypeData.applicationCategory}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose Category</option>
                  <option value="factory">Factory</option>
                  <option value="boiler">Boiler</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition shadow-md cursor-pointer"
                onClick={handleSaveApplication}
              >
                Save Application
              </button>
              {error && <p className="text-sm text-red-400 mt-1 "> {error} </p>}
            </div>
          </div>
        )}
        {applications.length > 0 && (
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
                    <th className="px-4 py-3 font-semibold">
                      Application Name
                    </th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.length > 0 &&
                    applications.map((app, idx) => (
                      <tr
                        key={app.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3"> {idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {app.applicationName}
                        </td>
                        <td className="px-4 py-3">
                          {" "}
                          {app.applicationCategory.slice(0, 1).toUpperCase() +
                            app.applicationCategory.slice(1)}{" "}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`bg-green-100  ${app.isActive ? "text-green-700" : "bg-red-500 text-white"} px-3 py-1 rounded-full text-sm font-medium `}
                          >
                            {app.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => openModal("edit", app)}
                            // onClick={() =>
                            //   updateApplicationById(app.id, !app.isActive)
                            // }
                            className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-200 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            // onClick={() => deleteApplicationById(app.id)}
                            onClick={() => openModal("delete", app)}
                            className="text-xs border border-red-200 text-red-600 rounded px-2.5 py-1 hover:bg-red-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {modalType === "edit"
                ? "Update Application Status"
                : "Delete Application"}
            </h2>

            <p className="text-gray-600 mb-6">
              {modalType === "edit"
                ? `Are you sure you want to ${
                    selectedApp?.isActive ? "deactivate" : "activate"
                  } this application?`
                : "Are you sure you want to delete this application?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (modalType === "edit") {
                    await updateApplicationById(
                      selectedApp.id,
                      !selectedApp.isActive,
                    );
                  } else {
                    await deleteApplicationById(selectedApp.id);
                  }

                  closeModal();
                  getAllApplicationList();
                }}
                className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
                  modalType === "edit"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {modalType === "edit"
                  ? selectedApp?.isActive
                    ? "Deactivate"
                    : "Activate"
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationsList;
