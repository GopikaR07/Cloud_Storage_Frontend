import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SharedLink from "./pages/SharedLink";

function App() {
  return (
    <Routes>
      {/* Opening the website should show Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main application */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Shared files */}
      <Route path="/shared/:token" element={<SharedLink />} />

      {/* Unknown routes go to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;