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
        const [classResponse, parentResponse] = await Promise.all(
          [
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
          ]
        );

        const [classData, parentData] = await Promise.all([
          classResponse.json(),
          parentResponse.json(),
        ]);

        console.log(parentData.data);
        

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

      // check the dob value if the age is less than 2 years old
      const today = new Date();
      const dobDate = new Date(dob);
      const diffTime = Math.abs(today.getTime() - dobDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffYears = diffDays / 365;

      if (diffYears < 2) {
        message.error("Trẻ phải từ 2 tuổi trở lên.");
        return;
      }

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
        message.error("Lỗi khi tạo mới thông tin trẻ.");
      }
    } catch (error) {
      message.error("Lỗi khi tạo mới thông tin trẻ. Vui lòng thử lại.");
    }
  };

  return (
    <Modal title="Tạo trẻ mới" open={true} onCancel={onCancel} footer={null}>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOnSubmit}>
        <Form.Item
          label="Họ và tên:"
          name="name"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên thường gọi:"
          name="nickName"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh:"
          name="dob"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày" />
        </Form.Item>
        <Form.Item
          label="Tên phụ huynh:"
          name="parentId"
          rules={[
            { required: true, message: "Trường này không được để trống" },
          ]}
        >
          <Select
            showSearch
            filterOption={(inputValue, option) =>{
              const parentLabel =
                option?.label?.toString()?.toLowerCase() || "";
              const idCardNumber =
                option?.idCardNumber?.toString()?.toLowerCase() || "";
              const searchValue = inputValue.toLowerCase();
              return (
                parentLabel.includes(searchValue) ||
                idCardNumber.includes(searchValue)
              );
            }}
            options={parentToAssign.map((parent) => ({
              value: parent.id,
              label: `${parent.fullName} - Tên trẻ: ${
                parent.kid?.fullName || "Chưa có thông tin"
              }`,
              idCardNumber: parent.idCardNumber,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Lớp học"
          name="classId"
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
            options={classesToAssign.map((classItem) => ({
              value: classItem.id,
              label: `${classItem.name} - Khối ${classItem.grade}`,
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

export default CreateKid;
