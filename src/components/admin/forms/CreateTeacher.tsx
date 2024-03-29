import { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const CreateTeacher = ({
  onCancel,
  onCreateSuccess,
}: {
  onCancel: () => void;
  onCreateSuccess: () => void;
}) => {
  const [classesToAdd, setClassesToAdd] = useState<any[]>([]);
  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/class/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }
        const res = await response.json();
        setClassesToAdd(res.data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClassData();
  }, []);

  const [form] = Form.useForm();

  const handleOnSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");

      const response = await fetch(BASE_BACKEND_URL + "/teacher/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data?.error) {
          messageApi.success(data?.message);
          setTimeout(() => {
            onCreateSuccess();
          }, 3500);
        } else {
          messageApi.error(data?.message);
        }
      } else {
        messageApi.error("Bad credentials.");
      }
    } catch (error) {
      messageApi.error("Error when calling API to backend service.");
    }
  };

  return (
    <Modal
      title="Create New Teacher"
      visible={true}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Name:"
          name="fullName"
          rules={[{ required: true, message: "Please enter a full name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username:"
          name="username"
          rules={[{ required: true, message: "Please enter an username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password:"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label="Classes" name="classes">
          <Select
            showSearch
            mode="multiple"
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={classesToAdd.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeacher;
