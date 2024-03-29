import React from "react";
import { Layout, Button } from "antd";
import { TeamOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

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

const SharedHeader: React.FC<SharedHeaderProps> = ({ place }) => {
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
      >
        <LogoutOutlined />
        Đăng xuất
      </Button>
    </Header>
  );
};

export default SharedHeader;
