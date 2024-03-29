import { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Modal, DatePicker, Select, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const CreateKid = ({
  onCancel,
  onCreateSuccess,
}: {
  onCancel: () => void;
  onCreateSuccess: () => void;
}) => {
  const [parentToAssign, setParentToAssign] = useState<any[]>([]);
  const [classesToAssign, setClassesToAssign] = useState<any[]>([]);
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
        setParentToAssign(parentData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [LoginCtx.authToken]);

  const [form] = Form.useForm();

  const handleOnSubmit = async () => {
    try {
      const values = await form.validateFields();
      const dob = values.dob.format("YYYY-MM-DD");
      const valuesToSend = { ...values, dob };

      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + "/kid/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(valuesToSend),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data?.error) {
          messageApi.success(data?.message);
          setTimeout(() => {
            onCreateSuccess();
          }, 3500);
        } else {
          message.error(data?.message);
        }
      } else {
        message.error("Bad credentials.");
      }
    } catch (error) {
      message.error("Error when calling API to backend service.");
    }
  };

  return (
    <Modal
      title="Create New Kid"
      visible={true}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Full name:"
          name="name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nickname:"
          name="nickname"
          rules={[{ required: true, message: "Please enter a nickname" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Date of birth:"
          name="dob"
          rules={[{ required: true, message: "Please enter date of birth" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Parent Name:" name="parentId">
          <Select
            showSearch
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
            options={parentToAssign.map((parent) => ({
              value: parent.id,
              label: `${parent.fullName}`,
            }))}
          />
        </Form.Item>
        <Form.Item label="Class" name="classId">
          <Select
            showSearch
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
            options={classesToAssign.map((classItem) => ({
              value: classItem.id,
              label: `${classItem.name} - Grade ${classItem.grade}`,
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

export default CreateKid;
