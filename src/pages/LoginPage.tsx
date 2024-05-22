import React, { useContext } from "react";
import { Button, Form, Input, message, Image, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { Content } from "antd/es/layout/layout";
import SharedFooter from "../components/share/SharedFooter";

const BASE_BACKEND_URL = "https://isd-be.vercel.app/api/v1";

type FieldType = {
  username?: string;
  password?: string;
};

const LoginPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const LoginCtx = useContext(LoginContext);

  const onFinish = async (values: any) => {
    try {
      const response = await fetch(BASE_BACKEND_URL + "/auth/login", {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const res = await response.json();
        const user = {
          username: res?.data?.username,
          role: res?.data?.role,
        };

        if (!res?.error) {
          messageApi.success(res?.message);
          setTimeout(() => {
            LoginCtx.setIsLoggedIn(!res?.error);
            LoginCtx.setUser(user);
            LoginCtx.setAuthToken(res?.token);
            localStorage.setItem("authToken", res?.token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");
            if (res?.data?.role === "ADMIN") {
              navigate("/admin");
            } else {
              navigate("/home");
            }
          }, 3500);
        } else {
          messageApi.error(res?.message);
        }
      } else {
        messageApi.error("Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      messageApi.error("Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: -8 }}>
      {contextHolder}
      <Content>
        <Image
          height={window.innerHeight - 1}
          preview={false}
          src="https://th.bing.com/th/id/R.68d4eb02bd166d96f9d21781c6c9fbd3?rik=xWTGNPY64V3pGg&pid=ImgRaw&r=0"
          alt="KinderGarten Image"
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          autoComplete="off"
          style={{
            width: 500,
            padding: 40,
            border: "1px solid #ddd",
            borderRadius: 5,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            fontSize: 16,
            lineHeight: 1.5,
            letterSpacing: "0.5px",
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Bạn phải nhập tên đăng nhập" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Bạn phải nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <SharedFooter place="" />
    </Layout>
  );
};

export default LoginPage;
