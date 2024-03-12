import React, { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";

interface TeacherDetailProps {
  item: {
    id: string;
    name: string;
    username: string;
    password: string;
    classes: any[];
  };
  onCancel: () => void;
}

const TeacherDetail: React.FC<TeacherDetailProps> = ({ item, onCancel }) => {
  const [classesToAdd, setClassesToAdd] = React.useState<any[]>([]);

  useEffect(() => {
    // Add logic for fetching classes from the backend
    const classes = [
      { id: 1, name: "Mầm", grade: 2 },
      { id: 2, name: "Nụ", grade: 3 },
      { id: 3, name: "Lá", grade: 4 },
      { id: 4, name: "Cành", grade: 5 },
    ];
    setClassesToAdd(classes);
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
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder={`${item.name}`} />
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
            value={classesToAdd.map((c) => c.id)}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={classesToAdd.map((c) => ({
              value: c.id,
              label: c.name,
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
