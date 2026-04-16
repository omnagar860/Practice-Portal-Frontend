import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/login.services";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      const user = res.user;
      alert("user found")
      console.log(user)

      // store user locally
      localStorage.setItem("user", JSON.stringify(user));

      // role-based redirect
      if (user.role === "department") {
        navigate("/department-dashboard");
      } else if (user.role === "citizen") {
        navigate("/public-dashboard");
      } else {
        navigate("/admin");
      }

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow border"
      >
        <h2 className="text-xl font-semibold mb-6">Login</h2>

        <div className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}