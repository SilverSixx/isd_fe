import React, { useEffect, useContext } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { LoginContext } from "../../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

interface FoodDetailProps {
  item: {
    id: string;
    name: string;
    totalAmount: number;
    allergyKids: any[];
  };
  onCancel: () => void;
  onUpdateSuccess: () => void;
}

const FoodDetail: React.FC<FoodDetailProps> = ({
  item,
  onCancel,
  onUpdateSuccess,
}) => {
  const [kidsToAdd, setKidsToAdd] = React.useState<any[]>([]);
  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/kid/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        setKidsToAdd(res.data);
      } catch (error) {
        console.error("Error fetching kid data:", error);
      }
    };
    fetchData();
  }, [item]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(
        BASE_BACKEND_URL + `/food/update/${item.id}`,
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
      messageApi.error("Error updating teacher");
    }
  };

  const handleDelete = async () => {
    try {
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(
        BASE_BACKEND_URL + `/food/delete/${item.id}`,
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
      messageApi.error("Error deleting teacher");
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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
        style={{
          maxWidth: 850,
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
          label="Tên món ăn"
          name="name"
          rules={[{ required: true, message: "Bạn phải nhập 1 chuỗi ký tự" }]}
        >
          <Input placeholder={`${item.name}`} />
        </Form.Item>
        <Form.Item
          label="Định lượng tổng"
          name="totalAmount"
          rules={[
            { required: true, message: "Bạn phải nhập 1 só lượng nhất định" },
          ]}
        >
          <Input placeholder={`${item.totalAmount}kg`} />
        </Form.Item>

        <Form.Item
          label="Trẻ dị ứng với món ăn này"
          name="kidIds"
          rules={[{ required: true, message: "Bạn phải tạo ít nhất 1 lưu ý" }]}
        >
          <Select
            showSearch
            mode="multiple"
            defaultValue={item.allergyKids.map((c: any) => c.id)}
            filterOption={(inputValue, option) =>
              (option?.label?.toString()?.toLowerCase() || "").includes(
                inputValue.toLowerCase()
              )
            }
            options={kidsToAdd.map((k) => ({
              value: k.id,
              label: `${k.fullName} - Dị ứng với: ${
                k.allergyFoods.map((f: { name: any }) => f.name).join(", ") ||
                "Không có"
              } `,
              selected: item.allergyKids.some((id: any) => id === k.id),
            }))}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
          <Button danger onClick={handleDelete} style={{ marginLeft: "8px" }}>
            Xóa món ăn này
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FoodDetail;
