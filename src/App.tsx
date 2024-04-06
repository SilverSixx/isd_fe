import React from "react";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import MyClasses from "./pages/MyClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginProvider from "./context/LoginContext";
import { LoginContext } from "./context/LoginContext";
import { Typography } from "antd";

const { Text } = Typography;

const ClassRoute = () => {
  const LoginCtx = React.useContext(LoginContext);

  return LoginCtx.isLoggedIn &&
    (LoginCtx.user?.role === "TEACHER" || LoginCtx.user?.role === "PARENT") ? (
    <MyClasses />
  ) : (
    <Text>Bạn không có quyền truy cập vào đường dẫn này</Text>
  );
};

const ClassDetailRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn &&
    (LoginCtx.user?.role === "TEACHER" || LoginCtx.user?.role === "PARENT") ? (
    <ClassDetailPage />
  ) : (
    <Text>Bạn không có quyền truy cập vào đường dẫn này</Text>
  );
};

const AdminRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn && LoginCtx.user?.role === "ADMIN" ? (
    <AdminDashboard />
  ) : (
    <Text>Bạn không có quyền truy cập vào đường dẫn này</Text>
  );
};

const HomeRoute = () => {
  const LoginCtx = React.useContext(LoginContext);
  return LoginCtx.isLoggedIn ? (
    <LandingPage />
  ) : (
    <Text>Bạn không có quyền truy cập vào đường dẫn này</Text>
  );
};

const App: React.FC = () => {
  return (
    <LoginProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomeRoute />} />
          <Route path="/classes" element={<ClassRoute />} />
          <Route path="/classes/:classId" element={<ClassDetailRoute />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
};

export default App;
