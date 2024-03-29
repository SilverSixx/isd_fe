import React, { useEffect, useState, useContext } from "react";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { LoginContext } from "../../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

interface KidDetailProps {
  item: {
    id: string;
    fullName: string;
    nickName: string;
    dob: string;
    classBelongsTo: any;
    parent: any;
  };
  onCancel: () => void;
}

const KidDetail: React.FC<KidDetailProps> = ({ item, onCancel }) => {
  const [classesToAssign, setClassesToAssign] = useState<any[]>([]);
  const [parentsToAssign, setParentsToAssign] = useState<any[]>([]);

  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const [classResponse, parentResponse] = await Promise.all([
          fetch(BASE_BACKEND_URL + "/class/all", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(BASE_BACKEND_URL + "/parent/all", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const [classData, parentData] = await Promise.all([
          classResponse.json(),
          parentResponse.json(),
        ]);

        setClassesToAssign(classData.data);
        setParentsToAssign(parentData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
          maxWidth: 500,
          margin: "auto",
          marginTop: 10,
          padding: 40,
          border: "1px solid #ddd",
          borderRadius: 5,
          backgroundColor: "white",
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter a full name" }]}
        >
          <Input placeholder={`${item.fullName}`} />
        </Form.Item>
        <Form.Item
          label="Nickname"
          name="name"
          rules={[{ required: true, message: "Please enter a nickname" }]}
        >
          <Input placeholder={`${item.nickName}`} />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: "Please enter a date of birth" }]}
        >
          <DatePicker placeholder={`${item.dob.substring(0, 10)}`} />
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
            defaultValue={item?.classBelongsTo?.id}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={classesToAssign.map((c) => ({
              value: c.id,
              label: c.name,
              selected: item?.classBelongsTo?.id === c.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Phụ Huynh"
          name="parentId"
          rules={[{ required: true, message: "Please select a teacher" }]}
        >
          <Select
            showSearch
            defaultValue={item?.parent?.id}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={parentsToAssign.map((p) => ({
              value: p.id,
              label: p.fullName,
              selected: p.id === item?.parent?.id,
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

export default KidDetail;
