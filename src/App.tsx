import React from "react";
import LandingPage from "./pages/LandingPage";
import MyClasses from "./pages/MyClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/classes" element={<MyClasses />} />
        <Route path="/classes/:classId" element={<ClassDetailPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
