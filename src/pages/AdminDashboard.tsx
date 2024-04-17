import React from "react";
import {
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Button, message, Image } from "antd";
import ClassTab from "../components/admin/dashboardTabs/ClassTab";
import TeacherTab from "../components/admin/dashboardTabs/TeacherTab";
import KidTab from "../components/admin/dashboardTabs/KidTab";
import ParentTab from "../components/admin/dashboardTabs/ParentTab";
import SharedFooter from "../components/share/SharedFooter";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;
const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const items: MenuProps["items"] = [
  { key: "1", icon: <HomeOutlined />, label: "Lớp học" },
  { key: "2", icon: <TeamOutlined />, label: "Giáo viên" },
  { key: "3", icon: <TeamOutlined />, label: "Trẻ" },
  { key: "4", icon: <TeamOutlined />, label: "Phụ huynh" },
];

const AdminDashboard: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const LoginCtx = React.useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<string>("1");

  const handleMenuClick = (key: React.Key) => {
    setActiveTab(String(key));
  };

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
    <Layout hasSider>
      {contextHolder}
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Image
          width={120}
          src={require("./logo.png")}
          alt="Logo"
          preview={false}
          style={{marginLeft: 40, cursor: "pointer"}}
          onClick={() => navigate("/home")}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[activeTab]}
          items={items}
          onSelect={({ key }) => handleMenuClick(key)}
        />

        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginLeft: 30, marginTop: 300 }}
        >
          Đăng xuất
        </Button>
      </Sider>
      <Layout style={{ marginLeft: 190 }}>
        <Header
          style={{
            background: colorBgContainer,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Trang quản trị viên
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            minHeight: "78.4vh",
          }}
        >
          {activeTab === "1" && <ClassTab />}

          {activeTab === "2" && <TeacherTab />}

          {activeTab === "3" && <KidTab />}

          {activeTab === "4" && <ParentTab />}
        </Content>
        <SharedFooter place="admin" />
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
