import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUser, deleteUserDetails, getAllUsers, getSignleUserData, updateUserDetails } from "../../../services/user.services";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),

  lastName: yup.string().required("Last name is required"),

  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),

  password: yup.string().when("$isEditMode", {
    is: true,
    then: () => yup.string().notRequired(),
    otherwise: () =>
      yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
  }),

  confirmPassword: yup
    .string()
    .when(["password", "$isEditMode"], ([password, isEditMode], schema) => {
      if (isEditMode && !password) {
        return schema.notRequired();
      }

      return schema
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match");
    }),

  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),

  dateOfBirth: yup.string().required("Date of birth is required"),

  state: yup.string().required("State is required"),

  district: yup.string().required("District is required"),

  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
});

export default function CreateUser() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [existingUserData, setExistingUserData] = useState([])
  const [updateUsersId, setUpdateUsersId] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
  mode: "onChange",
  context: {
    isEditMode: editUser,
  },
});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      // console.log("res", res)
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
 const updateUser = async (userId) => {
   try {
    setUpdateUsersId(userId);
     const res = await getSignleUserData(userId);
     const userData = res?.data;
     const dob = new Date(userData.date_of_birth).toISOString().split("T")[0];
     setEditUser(true);
     setShowForm(false);
     reset({
       firstName: userData.first_name || "",
       lastName: userData.last_name || "",
       email: userData.email || "",
       password: userData.password || "",
       confirmPassword: userData.password || "",
       mobile: userData.mobile_number || "",
       dateOfBirth: dob || "",
       state: userData.state || "",
       district: userData.district || "",
       house_number: userData.house_number || "",
       landmark: userData.landmark || "",
       street: userData.street || "",
       pincode: userData.pincode || "",
       address: userData.address || "",
     });
   } catch (error) {
     console.log(error);
   }
 }; 
 const openDeleteModal = (userId) => {
   setSelectedUserId(userId);
   setShowDeleteModal(true);
 };
const deleteUser = async () => {
  try {
    if (!selectedUserId) throw new Error("User Id is required.");

    const data = await deleteUserDetails(selectedUserId);

    // console.log(data);

    setShowDeleteModal(false);
    setSelectedUserId(null);

    await fetchUsers();
  } catch (error) {
    console.log("Error while deleting user", error);
    alert(error?.response?.data?.message || "Error deleting user");
  }
};

  const updateUserDetail = async(data)=> {
    try {
      console.log("UpdateUsersId" , updateUsersId);
      if (updateUsersId)  await updateUserDetails(updateUsersId, data);
      reset();
      setShowForm(false);
      setEditUser(false);
      fetchUsers();
    } catch (error) {
      console.log("Error while updating user details", error)
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log(data)
      await createUser(data);
      alert("User created successfully");
      reset();
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-800 text-white px-4 py-2 rounded-lg"
        >
          + Create User
        </button>
      </div>

      {/* User Create FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-6xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Create User
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                {...register("lastName")}
                id="lastName"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile
              </label>
              <input
                {...register("mobile")}
                id="mobile"
                placeholder="Enter mobile number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                id="dateOfBirth"
                type="date"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {" "}
                  {errors.dateOfBirth.message}{" "}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State
              </label>
              <input
                {...register("state")}
                id="state"
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.state && (
                <p className="text-red-500 text-sm"> {errors.state.message} </p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                District
              </label>
              <input
                {...register("district")}
                id="district"
                placeholder="Enter district"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.district && (
                <p className="text-red-500 text-sm ">
                  {" "}
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* House Number */}
            <div>
              <label
                htmlFor="houseNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                House Number
              </label>
              <input
                {...register("house_number")}
                id="houseNumber"
                placeholder="Enter house number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.house_number && (
                <p className="text-red-500 text-sm">
                  {errors.house_number.message}
                </p>
              )}
            </div>
            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street
              </label>
              <input
                {...register("street")}
                id="street"
                placeholder="Enter street name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Landmark
              </label>
              <input
                {...register("landmark")}
                id="landmark"
                placeholder="Enter landmark"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.landmark && (
                <p className="text-red-500 text-sm">
                  {errors.landmark.message}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pincode
              </label>
              <input
                {...register("pincode")}
                id="pincode"
                placeholder="Enter pincode"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>

            {/* Full Address */}
            {/* <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <textarea
                {...register("address")}
                id="address"
                rows="4"
                placeholder="Enter full address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div> */}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* { User Edit Form} */}
      {editUser && (
        <form
          onSubmit={handleSubmit(updateUserDetail)}
          className="bg-white max-w-6xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Create User
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                {...register("lastName")}
                id="lastName"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile
              </label>
              <input
                {...register("mobile")}
                id="mobile"
                placeholder="Enter mobile number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* Password */}
            {/* <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div> */}

            {/* Confirm Password */}
            {/* <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div> */}

            {/* DOB */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                id="dateOfBirth"
                type="date"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {" "}
                  {errors.dateOfBirth.message}{" "}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State
              </label>
              <input
                {...register("state")}
                id="state"
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.state && (
                <p className="text-red-500 text-sm"> {errors.state.message} </p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                District
              </label>
              <input
                {...register("district")}
                id="district"
                placeholder="Enter district"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.district && (
                <p className="text-red-500 text-sm ">
                  {" "}
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* House Number */}
            <div>
              <label
                htmlFor="houseNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                House Number
              </label>
              <input
                {...register("house_number")}
                id="houseNumber"
                placeholder="Enter house number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.house_number && (
                <p className="text-red-500 text-sm">
                  {errors.house_number.message}
                </p>
              )}
            </div>
            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street
              </label>
              <input
                {...register("street")}
                id="street"
                placeholder="Enter street name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Landmark
              </label>
              <input
                {...register("landmark")}
                id="landmark"
                placeholder="Enter landmark"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.landmark && (
                <p className="text-red-500 text-sm">
                  {errors.landmark.message}
                </p>
              )}
            </div>
            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pincode
              </label>
              <input
                {...register("pincode")}
                id="pincode"
                placeholder="Enter pincode"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>

            {/* Full Address */}
            {/* <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <textarea
                {...register("address")}
                id="address"
                rows="4"
                placeholder="Enter full address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div> */}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setEditUser(false)}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* USER TABLE */}
      {!showForm && (
        <div className="bg-white border rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{idx + 1}. </td>
                  <td className="p-3">
                    {user.first_name.slice(0, 1).toUpperCase() +
                      user.first_name.slice(1).toLowerCase()}{" "}
                    {user.last_name.slice(0, 1).toUpperCase() +
                      user.last_name.slice(1).toLowerCase()}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.mobile_number}</td>
                  <td className="p-3">
                    {user.district.slice(0, 1).toUpperCase() +
                      user.district.slice(1).toLowerCase()}
                  </td>
                  <td className="p-3">
                    <button
                      className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer mr-2"
                      onClick={() => updateUser(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg cursor-pointer"
                      onClick={() => openDeleteModal(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-87.5">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Confirm Delete
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this user?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedUserId(null);
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteUser}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}