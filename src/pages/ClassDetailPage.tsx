import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Button, Space, Typography } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
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
  ],
};

const timeSlots = [
  { id: 1, time: "8:30 - 9:45" },
  { id: 2, time: "10:00 - 11:15" },
  { id: 3, time: "14:00 - 15:15" },
  { id: 4, time: "15:30 - 16:45" },
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
      <SharedHeader place="classPage" />
      <Content style={{ padding: "80px 40px" }}>
        {isLoading ? (
          <Card title="Loading Class Details...">
            <LoadingOutlined style={{ fontSize: 24 }} />
          </Card>
        ) : (
          <Card title={classDataPlaceholder.name}>
            <Title level={4}>Schedule:</Title>
            <Table dataSource={timeSlots} pagination={false}>
              <Table.Column title="Time" dataIndex="time" key="time" />
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                <Table.Column
                  title={day}
                  key={day}
                  render={(dataIndex: any) => {
                    const scheduleItem = classDataPlaceholder.schedule.find(
                      (item) => item.day === day && item.shift === dataIndex?.id
                    );

                    return (
                      <div>
                        {scheduleItem?.subject || (
                          <Text type="secondary">-</Text>
                        )}
                      </div>
                    );
                  }}
                />
              ))}
            </Table>

            <Title level={4}>Kids:</Title>
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
                  // <Button
                  //   type="link"
                  //   onClick={() => navigate(`/kids/${record?.id}`)}
                  // >
                  //   View Details
                  // </Button>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button danger size="middle">
                      Cút
                    </Button>
                  </div>
                )}
              />
            </Table>

            <Space direction="vertical" style={{ marginTop: 16 }}>
              <Input.Search
                placeholder="Add Kid's Name"
                value={newKidName}
                onChange={(e) => setNewKidName(e.target.value)}
                onPressEnter={addKid}
                addonAfter={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addKid}
                  >
                    Add Kid
                  </Button>
                }
              />
            </Space>
          </Card>
        )}
      </Content>
      <SharedFooter place="classPage" />
    </Layout>
  );
};

export default ClassDetailPage;
