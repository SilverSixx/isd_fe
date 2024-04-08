import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Card,
  Table,
  Select,
  Button,
  Space,
  Typography,
  Form,
  Row,
  Col,
  Image,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import SharedHeader from "../components/share/SharedHeader";
import SharedFooter from "../components/share/SharedFooter";
import { LoginContext } from "../context/LoginContext";
import { log } from "console";

const { Content } = Layout;
const { Text } = Typography;

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 4;

const ClassDetailPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [classData, setClassData] = useState<any>([]);
  const [kidsToAdd, setKidsToAdd] = useState<any[]>([]);
  const [menuFoodData, setMenuFoodData] = useState<any>([]);
  const [newKidId, setnewKidId] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const LoginCtx = useContext(LoginContext);
  const [keyForRemount, setKeyForRemount] = useState(0);
  const { classId } = useParams();

  const token = LoginCtx.authToken || localStorage.getItem("authToken");

  // Fetch class data based on classId:
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await fetch(
          BASE_BACKEND_URL + `/class/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const classData = await classResponse.json();
        setClassData(classData.data);

        const foodResponse = await fetch(BASE_BACKEND_URL + `/food/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const foodData = await foodResponse.json();
        setMenuFoodData(foodData.data);

        const kidResponse = await fetch(BASE_BACKEND_URL + `/kid/all`, {
          headers: {
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
  }, [classId, token, keyForRemount]);

  const addKid = async () => {
    if (LoginCtx.user?.role !== "TEACHER") {
      messageApi.error("Bạn không có quyền thêm trẻ vào lớp");
      return;
    }
    if (!newKidId) {
      messageApi.error("Vui lòng chọn trẻ để thêm vào lớp");
      return;
    }
    const values = {
      kidId: newKidId,
      classId: classId,
    };
    try {
      const response = await fetch(BASE_BACKEND_URL + `/kid/add-to-class`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const res = await response.json();
      if (!res.error) {
        messageApi.success(res?.message);
        setKeyForRemount(keyForRemount + 1);
      } else {
        messageApi.error(res?.message);
      }
    } catch (error) {
      console.error("Error kicking kid:", error);
    }
    setnewKidId(null);
  };

  const handleKick = async (kidId: string) => {
    if (LoginCtx.user?.role !== "TEACHER") {
      messageApi.error("Bạn không có quyền xóa trẻ khỏi lớp");
      return;
    }
    const values = {
      kidId: kidId,
      classId: classId,
    };
    try {
      const response = await fetch(BASE_BACKEND_URL + `/kid/kick-from-class`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const res = await response.json();
      if (!res.error) {
        messageApi.success(res?.message);
        setnewKidId(null);
        setKeyForRemount(keyForRemount + 1);
      } else {
        messageApi.error(res?.message);
      }
    } catch (error) {
      console.error("Error kicking kid:", error);
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Biệt danh",
      dataIndex: "nickName",
      key: "nickname",
    },
    {
      title: "Tuổi",
      dataIndex: "dob",
      key: "dob",
      render: (dob: string) => {
        const today = new Date();
        const birthYear = new Date(dob).getFullYear();
        return today.getFullYear() - birthYear;
      },
    },
    {
      title: "Lớp",
      key: "gradeBelongsTo",
      render: () => <span>{classData.grade}</span>,
    },
    {
      title: "Dị ứng với",
      dataIndex: "allergyFoods",
      key: "allergyFoods",
      render: (allergyFoods: any) => (
        <>
          {allergyFoods.map((food: any) => (
            <span>{food.name + ", "}</span>
          ))}
        </>
      ),
    },
    {
      title: "Phụ huynh",
      dataIndex: ["parent", "fullName"],
      key: "parent",
    },
    {
      title: "",
      key: "",
      render: (record: any) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            danger
            size="middle"
            style={{ marginRight: 10 }}
            onClick={() => {
              handleKick(record.id);
            }}
          >
            Xóa khỏi lớp
          </Button>
        </div>
      ),
    },
  ];

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: -8 }}>
      {contextHolder}
      <Image
        height={window.innerHeight - 1}
        preview={false}
        src="https://th.bing.com/th/id/R.68d4eb02bd166d96f9d21781c6c9fbd3?rik=xWTGNPY64V3pGg&pid=ImgRaw&r=0"
        alt="KinderGarten Image"
        style={{ objectFit: "cover", position: "relative" }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <SharedHeader place="classPage" />
      <Content
        style={{
          padding: "64",
          position: "absolute",
          top: 70,
          left: 40,
          right: 40,
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
        }}
      >
        <div style={{ alignItems: "center", width: "100%" }}>
          <Card
            title={`Tên lớp: ${classData.name} - Giáo viên: ${classData?.teacher?.fullName}`}
          >
            <Space>
              <Form.Item
                label={`Trẻ được thêm vào lớp ${classData.name}`}
                name="kidId"
              >
                <Select
                  showSearch
                  filterOption={(inputValue, option) =>
                    (option?.label?.toString()?.toLowerCase() || "").includes(
                      inputValue.toLowerCase()
                    )
                  }
                  placeholder="Nhập tên trẻ ở đây..."
                  onChange={(value) => {

                    setnewKidId(value);
                  }}
                  options={kidsToAdd.map((kid) => ({
                    value: kid.id,
                    label: ` ${kid.fullName} - Lớp: ${
                      kid.classBelongsTo?.name || "Chưa có"
                    }`,
                  }))}
                  style={{ minWidth: 300 }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={addKid}>
                  Thêm
                </Button>
              </Form.Item>
            </Space>
            <Table
              dataSource={classData?.kids?.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              )}
              columns={columns}
              rowKey="id"
              pagination={{
                onChange: handleChangePage,
                current: currentPage,
                pageSize: ITEMS_PER_PAGE,
                total: classData?.kids?.length,
              }}
            />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Thực đơn">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {menuFoodData.map((food: any) => (
                      <div key={food.id} style={{ marginRight: 20 }}>
                        <Text>{food.name}</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
      <SharedFooter place="" />
    </Layout>
  );
};

export default ClassDetailPage;
