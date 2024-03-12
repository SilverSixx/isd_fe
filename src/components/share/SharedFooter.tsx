import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;
interface SharedFooterProps {
  place: string;
}

const SharedFooter: React.FC<SharedFooterProps> = ({ place }) => {
  if (place === "landingPage") {
    return (
      <Footer
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "transparent",
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    );
  }

  return (
    <Footer style={{ textAlign: "center" }}>
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Footer>
  );
};

export default SharedFooter;
