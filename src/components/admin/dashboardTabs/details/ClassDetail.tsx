import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { LoginContext } from "../../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

interface ClassDetailProps {
    item: {
        id: string;
        name: string;
        grade: number;
        teacher: any;
        kids: any[];
    };
    onCancel: () => void;
    onUpdateSuccess: () => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({
    item,
    onCancel,
    onUpdateSuccess,
}) => {
    const [teachersToAdd, setTeachersToAdd] = useState<any[]>([]);
    const [kidsToAdd, setKidsToAdd] = useState<any[]>([]);
    const LoginCtx = useContext(LoginContext);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token =
                    LoginCtx.authToken || localStorage.getItem("authToken");
                const teacherResponse = await fetch(
                    BASE_BACKEND_URL + "/teacher/all",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const teacherData = await teacherResponse.json();
                setTeachersToAdd(teacherData.data);

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
    }, [item]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const token =
                LoginCtx.authToken || localStorage.getItem("authToken");

            const response = await fetch(
                BASE_BACKEND_URL + `/class/update/${item.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (!data?.error) {
                    messageApi.success(data?.message);
                    setTimeout(() => {
                        onUpdateSuccess();
                    }, 3500);
                } else {
                    message.error(data?.message);
                }
            } else {
                message.error("Không thể cập nhật thông tin lớp học.");
            }
        } catch (error) {
            message.error("Lỗi khi cập nhật thông tin lớp học.");
        }
    };

    const handleDelete = async () => {
        try {
            const token =
                LoginCtx.authToken || localStorage.getItem("authToken");

            const response = await fetch(
                BASE_BACKEND_URL + `/class/delete/${item.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (!data?.error) {
                    messageApi.success(data?.message);
                    setTimeout(() => {
                        onUpdateSuccess();
                    }, 3500);
                } else {
                    message.error(data?.message);
                }
            } else {
                message.error("Không thể xóa lớp học.");
            }
        } catch (error) {
            message.error("Lỗi khi xóa lớp học.");
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
                    label="Tên lớp:"
                    name="name"
                    initialValue={item.name}
                    rules={[
                        {
                            required: true,
                            message: "Trường này không được để trống",
                        },
                    ]}
                >
                    <Input defaultValue={`${item.name}`} />
                </Form.Item>
                <Form.Item
                    label="Tuổi:"
                    name="grade"
                    initialValue={item.grade}
                    rules={[
                        {
                            required: true,
                            message: "Trường này không được để trống",
                        },
                    ]}
                >
                    <Input defaultValue={`${item.grade}`} />
                </Form.Item>
                <Form.Item
                    label="Giáo viên phụ trách:"
                    name="teacherId"
                    initialValue={item?.teacher?.id}
                    rules={[
                        {
                            required: true,
                            message: "Trường này không được để trống",
                        },
                    ]}
                >
                    <Select
                        showSearch // Enable searching
                        defaultValue={item?.teacher?.id}
                        placeholder="Hãy chọn giáo viên phụ trách"
                        filterOption={(inputValue, option) =>
                            (
                                option?.label?.toString()?.toLowerCase() || ""
                            ).includes(inputValue.toLowerCase())
                        }
                        options={teachersToAdd.map((teacher) => ({
                            value: teacher.id,
                            label: teacher.fullName,
                            selected: item?.teacher?.id === teacher?.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Trẻ trong lớp này:"
                    name="kidIds"
                    initialValue={item.kids.map((kid) => kid.id)}
                    rules={[
                        {
                            required: true,
                            message: "Trường này phải chọn tối thiểu 1",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        defaultValue={item.kids.map((kid) => kid.id)}
                        filterOption={(inputValue, option) =>
                            (
                                option?.label?.toString()?.toLowerCase() || ""
                            ).includes(inputValue.toLowerCase())
                        }
                        placeholder="Hãy chọn trẻ trong lớp này"
                        // Set default selected kids based on item prop
                        options={kidsToAdd.map((kid) => ({
                            value: kid.id,
                            label: ` ${kid.fullName} - Lớp: ${
                                kid.classBelongsTo?.name || "Chưa có"
                            }`,
                            selected: item.kids
                                .map((kid) => kid.id)
                                .includes(kid.id),
                        }))}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                    <Button type="primary" htmlType="submit">
                        Câp nhật
                    </Button>
                    <Button
                        danger
                        onClick={handleDelete}
                        style={{ marginLeft: "8px" }}
                    >
                        Xóa lớp học này
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ClassDetail;
