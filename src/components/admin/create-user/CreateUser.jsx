import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUser, getAllUsers } from "../../../services/user.services";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  address: yup.string().required("Address is required"),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
});

export default function CreateUser() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      console.log("res", res)
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
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

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow border mb-6"
        >
          <div className="grid grid-cols-2 gap-4">

            <input
              {...register("firstName")}
              placeholder="First Name"
              className="border p-2 rounded"
            />
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="border p-2 rounded"
            />

            <input
              {...register("email")}
              placeholder="Email"
              className="border p-2 rounded"
            />

            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="border p-2 rounded"
            />

            <input
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              type="password"
              className="border p-2 rounded"
            />

            <input
              {...register("mobile")}
              placeholder="Mobile"
              className="border p-2 rounded"
            />

            <input
              {...register("dateOfBirth")}
              type="date"
              className="border p-2 rounded"
            />

            <input
              {...register("state")}
              placeholder="State"
              className="border p-2 rounded"
            />

            <input
              {...register("district")}
              placeholder="District"
              className="border p-2 rounded"
            />

            <input
              {...register("house_number")}
              placeholder="House Number"
              className="border p-2 rounded"
            />

            <input
              {...register("landmark")}
              placeholder="Landmark"
              className="border p-2 rounded"
            />

            <input
              {...register("pincode")}
              placeholder="Pincode"
              className="border p-2 rounded"
            />

            <textarea
              {...register("address")}
              placeholder="Address"
              className="border p-2 rounded col-span-2"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-green-800 text-white px-4 py-2 rounded"
            >
              Submit
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
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
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">District</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">
                    {user.first_name.slice(0,1).toUpperCase()+user.first_name.slice(1).toLowerCase()} {" "} 
                    {user.last_name.slice(0,1).toUpperCase()+user.last_name.slice(1).toLowerCase()}
                    {/* {user.last_name} */}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.mobile_number}</td>
                  <td className="p-3">{user.district.slice(0,1).toUpperCase()+user.district.slice(1).toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}