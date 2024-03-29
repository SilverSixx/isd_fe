import React from "react";
import { TeamOutlined, HomeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import ClassTab from "../components/admin/dashboardTabs/ClassTab";
import TeacherTab from "../components/admin/dashboardTabs/TeacherTab";
import KidTab from "../components/admin/dashboardTabs/KidTab";
import SharedFooter from "../components/share/SharedFooter";

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps["items"] = [
  { key: "1", icon: <HomeOutlined />, label: "Classes" },
  { key: "2", icon: <TeamOutlined />, label: "Teachers" },
  { key: "3", icon: <TeamOutlined />, label: "Kids" },
];

const AdminDashboard: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [activeTab, setActiveTab] = React.useState<string>("1");

  const handleMenuClick = (key: React.Key) => {
    setActiveTab(String(key));
  };

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[activeTab]}
          items={items}
          onSelect={({ key }) => handleMenuClick(key)}
        />
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
          Admin Dashboard for Kinder Garten System
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
        </Content>
        <SharedFooter place={"dashboard"} />
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
