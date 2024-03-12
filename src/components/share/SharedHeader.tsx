import React from "react";
import { Layout, Menu, Button } from "antd";
import { TeamOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";

interface SharedHeaderProps {
  place: "landingPage" | "classPage";
}

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: <Link to="/classes">Classes</Link>,
  },
];

const { Header } = Layout;

const SharedHeader: React.FC<SharedHeaderProps> = ({ place }) => {
  const selectedKey = place === "landingPage" ? "1" : "2";

  return (
    <Header
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        zIndex: 1,
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "white",
          paddingRight: 50,
        }}
      >
        Logo here
      </div>

      <Menu
        mode="horizontal"
        defaultSelectedKeys={[selectedKey]}
        items={items}
        style={{
          background: "transparent",
          minWidth: 300,
          border: "none",
          fontSize: "1.1rem",
        }}
        theme="dark"
      />

      <Button type="primary">
        <LogoutOutlined />
        Logout
      </Button>
    </Header>
  );
};

export default SharedHeader;
