import { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "https://isd-be.vercel.app/api/v1";

const CreateClass = ({
  onCancel,
  onCreateSuccess,
}: {
  onCancel: () => void;
  onCreateSuccess: () => void;
}) => {
  const LoginCtx = useContext(LoginContext);
  const [teacherToAdd, setTeacherToAdd] = useState<any[]>([]);
  const [kidsToAdd, setKidsToAdd] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const teacherResponse = await fetch(BASE_BACKEND_URL + "/teacher/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const teacherData = await teacherResponse.json();
        setTeacherToAdd(teacherData.data);

        const kidResponse = await fetch(BASE_BACKEND_URL + "/kid/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const kidData = await kidResponse.json();
        setKidsToAdd(kidData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [LoginCtx.authToken]);

  const handleOnSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");

      const response = await fetch(BASE_BACKEND_URL + "/class/create", {
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
          message.error(data?.message);
        }
      } else {
        message.error("Lỗi khi tạo lớp học. Kiểm tra lại thông tin.");
      }
    } catch (error) {
      message.error("Lỗi khi tạo lớp học. Vui lòng thử lại.");
    }
  };

  return (
    <Modal title="Tạo lớp mới" open={true} onCancel={onCancel} footer={null}>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Tên lớp:"
          name="name"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Khối:"
          name="grade"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Select>
            {Array.from({ length: 4 }, (_, i) => i + 2).map((value) => (
              <Select.Option key={value} value={value.toString()}>
                {value.toString()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Giáo viên phụ trách:"
          name="teacherId"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Select
            showSearch
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
          >
            {teacherToAdd.map((teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Trẻ trong lớp này:" name="kidIds">
          <Select
            showSearch
            mode="multiple"
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
          >
            {kidsToAdd.map((kid) => (
              <Select.Option key={kid.id} value={kid.id}>
                {`${kid.fullName} - ${
                  kid?.classBelongsTo?.name || "Chưa có lớp"
                }`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClass;
