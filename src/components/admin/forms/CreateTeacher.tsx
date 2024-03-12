import { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Select } from "antd";

const CreateTeacher = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: any;
  onCancel: any;
}) => {
  const [fullname, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [classesToAdd, setClassesToAdd] = useState<any[]>([]);

  useEffect(() => {
    // Add logic for fetching classes from the backend
    const classes = [
      { id: 1, name: "Mầm", grade: 2 },
      { id: 2, name: "Nụ", grade: 3 },
      { id: 3, name: "Lá", grade: 4 },
      { id: 4, name: "Cành", grade: 5 },
    ];
    setClassesToAdd(classes);
  })

  const [form] = Form.useForm();

  const handleOnSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title="Create New Teacher"
      visible={true}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={handleOnSubmit}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name:"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Username:"
          name="userName"
          rules={[{ required: true, message: "Please enter an username" }]}
        >
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Password:"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
      </Form>
    </Modal>
  );
};

export default CreateTeacher;
