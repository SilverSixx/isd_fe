import React from "react";
import { Layout, Image, Typography } from "antd";
import SharedHeader from "../components/share/SharedHeader";
import SharedFooter from "../components/share/SharedFooter";

const { Content } = Layout;
const { Text } = Typography;

const LandingPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", margin: -8 }}>
      <SharedHeader place={"landingPage"} />
      <Content>
        <Image
          height={window.innerHeight - 1}
          preview={false}
          src="https://th.bing.com/th/id/R.68d4eb02bd166d96f9d21781c6c9fbd3?rik=xWTGNPY64V3pGg&pid=ImgRaw&r=0"
          alt="KinderGarten Image"
          style={{ objectFit: "cover" }} // Ensure image covers viewport
        />
        <Text
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            fontSize: "3vw", // Use viewport-based unit for text size
            color: "white",
            textShadow: "0px 0px 10px rgba(0, 0, 0, 0.7)",
            textAlign: "center",
          }}
        >
          Chào mừng đến với hệ thống quản lý trường mầm non Bình Minh!
        </Text>
      </Content>
      <SharedFooter place="" />
    </Layout>
  );
};

export default LandingPage;
