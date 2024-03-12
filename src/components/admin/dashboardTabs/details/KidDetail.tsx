import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";

interface KidDetailProps {
  item: {
    id: string;
    fullName: string;
    nickname: string;
    dob: string;
    cls: any[];
    parentName: string;
  };
  onCancel: () => void;
}

const KidDetail: React.FC<KidDetailProps> = ({ item, onCancel }) => {
  const [date, setDate] = useState<string>();
  const [classesToAssign, setClassesToAssign] = useState<any[]>([]);

  useEffect(() => {
    const dobFromBe = "2021-01-01";
    setDate(dobFromBe);
    const classes = [
      { id: 1, name: "Nụ", grade: 5 },
      { id: 2, name: "Mầm", grade: 2 },
      { id: 3, name: "Lá", grade: 4 },
    ];
    setClassesToAssign(classes);
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
          <Input placeholder={`${item.nickname}`} />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: "Please enter a date of birth" }]}
        >
          <DatePicker placeholder={`${date}`} />
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
            defaultValue={item.cls.map((c) => c.id)}
            value={classesToAssign.map((c) => c.id)}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={classesToAssign.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Parent Name"
          name="parentName"
          rules={[{ required: true, message: `${item.parentName}` }]}
        >
          <Input placeholder={`${item.parentName}`}/>
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
