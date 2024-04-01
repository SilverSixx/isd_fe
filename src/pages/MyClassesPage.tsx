import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Card, Button, Typography, Select, Image } from "antd";
import SharedHeader from "../components/share/SharedHeader";
import SharedFooter from "../components/share/SharedFooter";
import { LoginContext } from "../context/LoginContext";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const BASE_BACKEND_URL = "http://localhost:8080/api/v1";

const MyClassesPage: React.FC = () => {
  const [classData, setClassData] = useState<any>([]);
  const [ageGroupFilter, setAgeGroupFilter] = useState<number | null>(null);
  const LoginCtx = React.useContext(LoginContext);

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
        setClassData(res.data);
      } catch (error) {
        console.error("Error fetching class data:", error);
        // Handle error gracefully, e.g., display an error message
      }
    };
    fetchClassData();
  }, []);

  const handleFilter = (ageGroup: number | null) => {
    setAgeGroupFilter(ageGroup);
  };

  const filteredClasses =
    ageGroupFilter === null
      ? classData
      : classData.filter((cls: any) => cls.grade === ageGroupFilter);

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
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />
      <SharedHeader place={"classPage"} />
      <Content style={{ padding: "64px", position: "absolute" }}>
        <div style={{ alignItems: "center", width: "90vw" }}>
          <Title
            level={2}
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
          >
            Các lớp học đang phụ trách
          </Title>
          <Select
            style={{ width: 160 }}
            value={ageGroupFilter}
            onChange={handleFilter}
            placeholder="Filter by Age"
          >
            <Option value={null}>Tất cả</Option>
            {classData.map((cls: any) => (
              <Option key={cls.id} value={cls.grade}>
                Lớp {cls.grade} tuổi
              </Option>
            ))}
          </Select>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, max(300px))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {filteredClasses.map((cls: any) => (
              <ClassCard
                key={cls.id}
                name={cls.name}
                grade={cls.grade}
                id={cls.id}
                teacher={undefined}
                kids={[]}
              />
            ))}
          </div>
        </div>
      </Content>
      <SharedFooter place="" />
    </Layout>
  );
};

interface ClassCardProps {
  id: string | number;
  name: string;
  grade: number;
  teacher: any;
  kids: any[];
}

const ClassCard: React.FC<ClassCardProps> = ({ grade, name, id }) => {
  return (
    <Card title={name} style={{ width: "100%" }}>
      <p>Nhóm tuổi: {grade}</p>
      <Link to={`/classes/${id}`}>
        <Button type="primary">Chi tiết</Button>
      </Link>
    </Card>
  );
};

export default MyClassesPage;
