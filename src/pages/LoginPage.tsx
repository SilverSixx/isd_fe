import React from "react";
import { Button, Form, Input, notification } from "antd";

type FieldType = {
  username?: string;
  password?: string;
};

const LoginPage: React.FC = () => {
  const [api] = notification.useNotification();

  const openNotification = (message: string) => {
    api.info({
      message
    });
  };

  const onFinish = (values: any) => {
    // Simulate a successful API call
    // Replace this with your actual API call
    setTimeout(() => {
      openNotification("Login successful!");
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    openNotification("Login failed! Please check your credentials.");
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{
        maxWidth: 500,
        margin: "auto",
        marginTop: "25vh",
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
      }}
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
