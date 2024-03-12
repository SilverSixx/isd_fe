import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";

interface ClassDetailProps {
  item: {
    id: string;
    name: string;
    grade: number;
    teacher: string;
    kids: any[];
  };
  onCancel: () => void;
  onSubmited: (updatedValues: any) => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({
  item,
  onCancel,
  onSubmited,
}) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setTeachers(teacherList);
      setIsLoading(false);
    };

    fetchTeachers();
    setKids(item.kids); // Set kids from the item prop
  }, [item]);

  const handleUpdate = (values: any) => {
    onSubmited(values); // Pass updated values to parent component
  };

  const handleDelete = () => {};

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const filterOptions = (inputValue: string, options: any[]) => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
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
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the class name" }]}	
        >
          <Input defaultValue={item.name} />
        </Form.Item>
        <Form.Item
          label="Grade"
          name="grade"
          rules={[{ required: true, message: "Please enter the grade" }]}
        >
          <Input defaultValue={item.grade} />
        </Form.Item>
        <Form.Item
          label="Teacher"
          name="teacher"
          rules={[{ required: true, message: "Please select a teacher" }]}
        >
          {isLoading ? (
            <span>Loading teachers...</span>
          ) : (
            <Select
              showSearch // Enable searching
              defaultValue={item.teacher}
              filterOption={(inputValue, option) =>
                option?.label.toLowerCase().includes(inputValue.toLowerCase())
              }
              options={teachers.map((teacher) => ({
                value: teacher.id,
                label: teacher.name,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item
          label="Kids"
          name="kids"
          rules={[{ required: true, message: "Please select kids" }]}
        >
          {isLoading ? (
            <span>Loading kids...</span>
          ) : (
            <Select
              mode="multiple"
              filterOption={(inputValue, option) =>
                option?.label.toLowerCase().includes(inputValue.toLowerCase())
              }
              allowClear
              placeholder="Please select at least 1 kid"
              defaultValue={item.kids.map((kid) => kid.id)} // Set default value as IDs
              value={kids.map((kid) => kid.id)} // Set current selected value as IDs
              onChange={handleChange}
              options={kids.map((kid) => ({ value: kid.id, label: kid.name }))}
            />
          )}
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

export default ClassDetail;
