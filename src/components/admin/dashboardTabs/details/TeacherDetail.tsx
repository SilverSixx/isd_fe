import React, { useEffect, useContext } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { LoginContext } from "../../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

interface TeacherDetailProps {
  item: {
    id: string;
    fullName: string;
    username: string;
    password: string;
    classes: any[];
  };
  onCancel: () => void;
}

const TeacherDetail: React.FC<TeacherDetailProps> = ({ item, onCancel }) => {
  const [classesToAdd, setClassesToAdd] = React.useState<any[]>([]);
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
        const res = await response.json();
        setClassesToAdd(res.data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClassData();
  }, [item]);

  const handleUpdate = (values: any) => {
    // Add logic for handling update with the updated values
    console.log("Updated values:", values);
  };

  const handleDelete = () => {
    // Add logic for handling delete
    console.log(`Deleting class with ID ${item.id}`);
  };

  return (
    <>
      <Button danger onClick={onCancel}>
        Cancel
      </Button>

      <Form
        onFinish={handleUpdate}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        style={{
          maxWidth: 700,
          margin: "auto",
          padding: 40,
          border: "1px solid #ddd",
          borderRadius: 5,
          backgroundColor: "white",
          fontSize: 16,
          lineHeight: 1.5,
          marginTop: 10,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder={`${item.fullName}`} />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter an username" }]}
        >
          <Input placeholder={`${item.username}`} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input placeholder={`${item.password}`} />
        </Form.Item>
        <Form.Item
          label="Classes"
          name="classes"
          rules={[
            { required: true, message: "Please select at least 1 class" },
          ]}
        >
          <Select
            showSearch
            mode="multiple"
            defaultValue={item.classes.map((c: any) => c.id)}
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
            options={classesToAdd.map((c) => ({
              value: c.id,
              label: c.name,
              selected: item.classes.map((c: any) => c.id).includes(c.id),
            }))}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button danger onClick={handleDelete} style={{ marginLeft: "8px" }}>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TeacherDetail;
