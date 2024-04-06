import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;
interface SharedFooterProps {
  place: string;
}

const SharedFooter: React.FC<SharedFooterProps> = ({ place }) => {
  let leftMargin = 0;
  if (place === "admin") {
    leftMargin = 190;
  }
  return (
    <Footer
      style={{
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: leftMargin,
        right: 0,
        background: "transparent",
      }}
    >
      Mam Non Binh Minh ©{new Date().getFullYear()}
    </Footer>
  );
};

export default SharedFooter;
