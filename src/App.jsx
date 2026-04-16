import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import PublicDashboard from "./pages/department/PublicDashboard";
import AdminDashboard from "./pages/admin/adminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/department-dashboard"
          element={<DepartmentDashboard />}
        />
        <Route
          path="/public-dashboard"
          element={<PublicDashboard />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;























// import AdminDashboard from './pages/admin/adminDashboard'

// const App = () => {
//   return (
//     <div>
//       <AdminDashboard/>
//     </div>
//   )
// }

// export default App