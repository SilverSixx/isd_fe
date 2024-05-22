import { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "https://isd-be.vercel.app/api/v1";

const CreateParent = ({
  onCancel,
  onCreateSuccess,
}: {
  onCancel: () => void;
  onCreateSuccess: () => void;
}) => {
  const [kidToAdd, setKidToAdd] = useState<any[]>([]);
  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchKidData = async () => {
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + "/kid/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      setKidToAdd(res.data);
    };
    fetchKidData();
  }, []);

  const [form] = Form.useForm();

  const handleOnSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + "/parent/create", {
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
          messageApi.error(data?.message);
        }
      } else {
        messageApi.error("Lỗi khi thêm phụ huynh mới.");
      }
    } catch (error) {
      console.log("Lỗi", error);
      
    }
  };

  return (
    <Modal
      title="Tạo phụ huynh mới"
      open={true}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Họ và tên:"
          name="fullName"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số CCCD:"
          name="idCardNumber"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên đăng nhập:"
          name="username"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu:"
          name="password"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item label="Trẻ của phụ huynh:" name="kidId">
          <Select
            showSearch
            value={kidToAdd.map((k) => k.id)}
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
            options={kidToAdd.map((k) => ({
              value: k.id,
              label: `${k.fullName} - ${
                k?.parent?.fullName || "Chưa có thông tin cha mẹ"
              }`,
            }))}
          />
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

export default CreateParent;
