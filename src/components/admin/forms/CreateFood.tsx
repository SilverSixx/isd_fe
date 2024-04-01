import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const CreateFood = ({
  onCancel,
  onCreateSuccess,
}: {
  onCancel: () => void;
  onCreateSuccess: () => void;
}) => {
  const [kidToAdd, setKidToAdd] = useState<any[]>([]);
  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

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

  const handleOnSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + "/food/create", {
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
        messageApi.error("Bad credentials.");
      }
    } catch (error) {
      messageApi.error("Error when calling API to backend service.");
    }
  };

  return (
    <Modal
      title="Thêm mới món ăn"
      open={true}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Tên món ăn:"
          name="name"
          rules={[{ required: true, message: "Bạn phải nhập 1 chuỗi ký tự" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Định lượng tổng:"
          name="totalAmount"
          rules={[
            {
              required: true,
              message: "Bạn phải nhập 1 lượng thức ăn nhất định",
            },
          ]}
        >
          <Input placeholder="Đơn vị: kg" />
        </Form.Item>
        <Form.Item label="Trẻ dị ứng với món ăn này:" name="kidIds">
          <Select
            showSearch
            mode="multiple"
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
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFood;
