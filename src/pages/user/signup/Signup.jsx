import React, { useState } from 'react'

const Signup = () => {
    const [formData, setformData] = useState({
        email : "",
        username : "",
        password: ""
    })
    const handleSubmit = (e)=> {
        e.preventDefault();
        console.log(formData)
    }

    const handleChange = (e)=> {
        let value = e.target.value; 
        if(value.trim === undefined){
            alert("Please enter vlaue")
        }
        setformData((prevFormData)=> {
         return {...prevFormData, [e.target.name]: e.target.value}
        } )
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign Up
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default Signup