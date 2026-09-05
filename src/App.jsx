import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SharedLink from "./pages/SharedLink";

function App() {
  return (
    <Routes>
      {/* Starting page → LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/shared/:token" element={<SharedLink />} />

      {/* Unknown URL → LOGIN */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;