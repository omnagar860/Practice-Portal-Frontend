export default function DepartmentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Welcome {user?.first_name}
      </h1>

      <p className="mt-2 text-gray-600">
        Department Dashboard
      </p>
    </div>
  );
}