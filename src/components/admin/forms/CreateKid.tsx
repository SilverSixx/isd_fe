import { useEffect, useState } from "react";
import { Form, Input, Button, Modal, DatePicker, Select } from "antd";

const CreateKid = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: any;
  onCancel: any;
}) => {
  const [fullname, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [dob, setDob] = useState<Date | null | undefined>(null);
  const [parentName, setParentName] = useState("");
  const [classesToAssign, setClassesToAssign] = useState<any[]>([]);

  useEffect(() => {
    // Fetch classes from API
    // setClassesToAssign(classes);
    const classes = [
      { id: 1, name: "Nụ", grade: 5 },
      { id: 2, name: "Mầm", grade: 2 },
      { id: 3, name: "Lá", grade: 4 },
    ];
    setClassesToAssign(classes);
  }, []);

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
      title="Create New Kid"
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
          label="Full name:"
          name="fullname"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Nickname:"
          name="nickname"
          rules={[{ required: true, message: "Please enter a nickname" }]}
        >
          <Input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Date of birth:"
          name="dob"
          rules={[{ required: true, message: "Please enter date of birth" }]}
        >
          <DatePicker onChange={(date) => setDob(date?.toDate())} />
        </Form.Item>
        <Form.Item
          label="Parent Name:"
          name="parentName"
          rules={[{ required: true, message: "Please enter the parent name" }]}
        >
          <Input
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Class"
          name="class"
          rules={[
            { required: true, message: "Please select a class" },
          ]}
        >
          <Select
            showSearch
            value={classesToAssign.map((c) => c.id)}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) as boolean
            }
            options={classesToAssign.map((c) => ({
              value: c.id,
              label: `${c.name} - Grade ${c.grade}`,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateKid;
