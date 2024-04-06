import React, { useContext } from "react";
import { Layout, Button, message } from "antd";
import { TeamOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

interface SharedHeaderProps {
  place: "landingPage" | "classPage";
}

const items = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: (
      <Link to="/home" style={{ color: "white", fontWeight: "bold" }}>
        Nhà
      </Link>
    ),
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: (
      <Link to="/classes" style={{ color: "white", fontWeight: "bold" }}>
        Danh sách lớp học
      </Link>
    ),
  },
];

const { Header } = Layout;
const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const SharedHeader: React.FC<SharedHeaderProps> = ({ place }) => {
  const LoginCtx = useContext(LoginContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogout = async () => {
    try {
      const response = await fetch(BASE_BACKEND_URL + "/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LoginCtx.authToken}`, 
        },
      });

      if (response.ok) {
        const res = await response.json();
        messageApi.success(res.message);
        setTimeout(() => {
          // Clear user data from local storage
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");

          // Clear user data from context
          LoginCtx.setIsLoggedIn(false);
          LoginCtx.setUser({
            username: "",
            role: "",
          });
          LoginCtx.setAuthToken("");

          navigate("/");
        }, 3500);
      } else {
        // Handle errors if any
        messageApi.error("Đăng xuất không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      // Handle network errors
      messageApi.error("Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        zIndex: 1,
        justifyContent: "space-between",
        width: "100%",
        background: "transparent",
      }}
    >
      {contextHolder}
      <div style={{ display: "flex" }}>
        <div style={{ color: "white", paddingRight: 50, fontWeight: "bold" }}>
          Logo here
        </div>
        <nav style={{ display: "flex", gap: "20px" }}>
          {items.map((item) => (
            <Link
              key={item.key}
              to={item.label.props.to}
              style={{ color: "white", fontSize: 18 }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <Button
        danger
        size="middle"
        style={{
          background: "transparent",
          color: "white",
          borderColor: "white",
          fontWeight: "bold",
        }}
        onClick={handleLogout}
      >
        <LogoutOutlined />
        Đăng xuất
      </Button>
    </Header>
  );
};

export default SharedHeader;
