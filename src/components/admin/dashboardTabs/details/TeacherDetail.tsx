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
  onUpdateSuccess: () => void;
}

const TeacherDetail: React.FC<TeacherDetailProps> = ({
  item,
  onCancel,
  onUpdateSuccess,
}) => {
  const [classesToAdd, setClassesToAdd] = React.useState<any[]>([]);
  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

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

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(
        BASE_BACKEND_URL + `/teacher/update/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );
      const res = await response.json();
      if (!res.error) {
        messageApi.success(res?.message);
        setTimeout(() => {
          onUpdateSuccess();
        }, 3500);
      } else {
        messageApi.error(res?.message);
      }
    } catch (error) {
      messageApi.error("Lỗi khi cập nhật giáo viên");
    }
  };

  const handleDelete = async () => {
    try {
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(
        BASE_BACKEND_URL + `/teacher/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (!res.error) {
        messageApi.success(res?.message);
        setTimeout(() => {
          onUpdateSuccess();
        }, 3500);
      } else {
        messageApi.error(res?.message);
      }
    } catch (error) {
      messageApi.error("Lỗi khi xóa giáo viên");
    }
  };

  return (
    <>
      {contextHolder}
      <Button danger onClick={onCancel}>
        Quay lại
      </Button>

      <Form
        onFinish={handleUpdate}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        form={form}
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
          label="Họ và tên:"
          name="fullName"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input placeholder={`${item.fullName}`} />
        </Form.Item>
        <Form.Item
          label="Tên đăng nhập:"
          name="username"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input placeholder={`${item.username}`} />
        </Form.Item>
        <Form.Item
          label="Mật khẩu:"
          name="password"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input placeholder={`${item.password}`} />
        </Form.Item>
        <Form.Item
          label="Danh sách lớp phụ trách:"
          name="classIds"
          rules={[
            { required: true, message: "Trường này phải chọn tối thiểu 1" },
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
              label: `${c.name} - Giáo Viên: ${
                c.teacher?.fullName || "Chưa có"
              } `,
              selected: item.classes.map((c: any) => c.id).includes(c.id),
            }))}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
          <Button danger onClick={handleDelete} style={{ marginLeft: "8px" }}>
            Xóa giáo viên này
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TeacherDetail;
