import React from "react";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import MyClasses from "./pages/MyClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginProvider from "./context/LoginContext";
import { LoginContext } from "./context/LoginContext";

const ClassRoute = () => {
  const LoginCtx = React.useContext(LoginContext);

  return LoginCtx.isLoggedIn && LoginCtx.user?.role === "TEACHER" ? (
    <MyClasses />
  ) : (
    <LoginPage />
  );
};

const ClassDetailRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn && LoginCtx.user?.role === "TEACHER" ? (
    <ClassDetailPage />
  ) : (
    <LoginPage />
  );
};

const AdminRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn && LoginCtx.user?.role === "ADMIN" ? (
    <AdminDashboard />
  ) : (
    <LoginPage />
  );
};

const HomeRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn ? <LandingPage /> : <LoginPage />;
};

const App: React.FC = () => {
  return (
    <LoginProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/classes" element={<MyClasses />} />
          <Route path="/classes/:classId" element={<ClassDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
};

export default App;
