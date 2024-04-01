import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Image,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import SharedHeader from "../components/share/SharedHeader";
import SharedFooter from "../components/share/SharedFooter";

const { Content } = Layout;
const { Title, Text } = Typography;

const classDataPlaceholder = {
  id: null,
  name: "Cánh diều",
  schedule: [
    {
      day: "Mon",
      shift: 1,
      subject: "Math",
    },
    {
      day: "Wed",
      shift: 2,
      subject: "Art",
    },
    {
      day: "Fri",
      shift: 3,
      subject: "Language",
    },
  ],
  kids: [
    {
      id: 1,
      name: "Kid 1",
      nickname: "Cún",
      age: 5,
      parentName: "Đạt",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
    {
      id: 2,
      name: "Kid 2",
      nickname: "Miu",
      age: 6,
      parentName: "Chi",
    },
  ],
};

const menuFoodData = [
  { id: 1, name: "Food 1", totalAmount: 100 },
  { id: 2, name: "Food 2", totalAmount: 150 },
  { id: 3, name: "Food 3", totalAmount: 200 },
];

const ClassDetailPage: React.FC = () => {
  const [classData, setClassData] = useState(classDataPlaceholder);
  const [newKidName, setNewKidName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { classId } = useParams();

  // Fetch class data based on classId:
  useEffect(() => {
    const fetchClassData = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(
          `${process.env.BE_BASE_URL}/api/classes/${classId}`
        );
        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
        // Handle error gracefully, e.g., display an error message or redirect
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  const addKid = () => {
    if (!newKidName) return;
    // Implement logic to add kid to the class (e.g., API call)
    // Update state or display a success message upon successful addition
    setNewKidName("");
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: -8 }}>
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
          {isLoading ? (
            <Card title="Loading Class Details...">
              <LoadingOutlined style={{ fontSize: 24 }} />
            </Card>
          ) : (
            <Card title={classDataPlaceholder.name}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  padding: "20px 0",
                }}
              >
                <Input.Search
                  placeholder="Tên hoặc biệt danh của trẻ"
                  value={newKidName}
                  onChange={(e) => setNewKidName(e.target.value)}
                  onPressEnter={addKid}
                  style={{ width: 350 }}
                  addonAfter={
                    <Button
                      type="primary"
                      onClick={addKid}
                      style={{ marginLeft: "16px" }}
                    >
                      Thêm
                    </Button>
                  }
                />
              </Space>
              <Table dataSource={classDataPlaceholder.kids} pagination={false}>
                <Table.Column title="Name" dataIndex="name" key="name" />
                <Table.Column
                  title="Nickname"
                  dataIndex="nickname"
                  key="nickname"
                />
                <Table.Column title="Age" dataIndex="age" key="age" />
                <Table.Column
                  title="ParentName"
                  dataIndex="parentName"
                  key="parentName"
                />
                <Table.Column
                  title=""
                  key="action"
                  render={(record) => (
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button danger size="middle">
                        Xóa
                      </Button>
                    </div>
                  )}
                />
              </Table>

              <Title level={4}>Thực đơn và lưu ý cho những trẻ có dị ứng</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Menu">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {menuFoodData.map((food) => (
                        <div key={food.id} style={{ marginRight: 20 }}>
                          <Text>{food.name}</Text>
                        </div>
                      ))}
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {menuFoodData.map((food) => (
                        <div key={food.id} style={{ marginRight: 20 }}>
                          {/* {food.allergyNotes && (
                          <Text type="secondary">
                            Notes: {food.allergyNotes}
                          </Text>
                        )} */}
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card title="Định lượng tổng" style={{ marginBottom: 20 }}>
                    {/* Render 'Định lượng tổng' data */}
                  </Card>
                </Col>
                <Col span={6}>
                  <Card title="Định lượng cá nhân" style={{ marginBottom: 20 }}>
                    {/* Render 'Định lượng tổng' data */}
                  </Card>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      </Content>
      <SharedFooter place="" />
    </Layout>
  );
};

export default ClassDetailPage;
