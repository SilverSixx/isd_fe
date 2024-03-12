import { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select } from "antd";

const CreateClass = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: any;
  onCancel: any;
}) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState();
  const [teacher, setTeacher] = useState();
  const [kids, setKids] = useState<any[]>([]);

  const [teacherToAdd, setTeacherToAdd] = useState<any[]>([]);
  const [kidsToAdd, setKidsToAdd] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching teachers and kids (replace with actual API calls)
    const fetchTeachers = async () => {
      const teacherList = [
        {
          id: 1,
          name: "John Doe",
          username: "teacher1",
          password: "hashed password",
        },
        {
          id: 2,
          name: "Jane Smith",
          username: "teacher2",
          password: "hashed password",
        },
      ];
      setTeacherToAdd(teacherList);
    };

    const fetchKids = async () => {
      const kidsList = [
        {
          id: 1,
          name: "Alice",
          nickname: "Cún",
          age: 5,
          parentName: "Đạt",
        },
        {
          id: 2,
          name: "Bob",
          nickname: "Cún",
          age: 6,
          parentName: "Chi",
        },
      ];
      setKidsToAdd(kidsList);
    };

    fetchTeachers();
    fetchKids();
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
      title="Create New Class"
      visible={true} // Assuming modal is directly controlled here
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
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Grade:"
          name="grade"
          rules={[{ required: true, message: "Please select a grade" }]}
        >
          <Select
            options={(
              Array.from({ length: 4 }, (_, i) => i + 2) as number[]
            ).map((value) => ({
              value: value.toString(),
              label: value.toString(),
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Incharged Teacher:"
          name="teacher"
          rules={[{ required: true, message: "Please select a teacher" }]}
        >
          <Select
            showSearch
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={teacherToAdd.map((teacher) => ({
              value: teacher.id,
              label: teacher.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Kids:"
          name="kids"
          rules={[{ required: true, message: "Please select kids" }]}
        >
          <Select
            showSearch
            mode="multiple"
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            options={kidsToAdd.map((kid) => ({
              value: kid.id,
              label: kid.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClass;
