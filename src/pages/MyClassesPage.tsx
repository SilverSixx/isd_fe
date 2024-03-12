import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Card, Button, Typography, Select } from "antd";
import SharedHeader from "../components/share/SharedHeader";
import SharedFooter from "../components/share/SharedFooter";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const classesData = [
  { id: 1, className: "Class 2 Yo", ageGroup: 2 },
  { id: 2, className: "Class 3 Yo", ageGroup: 3 },
  { id: 3, className: "Class 4 Yo", ageGroup: 4 },
  { id: 4, className: "Class 5 Yo", ageGroup: 5 },
];

const MyClassesPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);

  const handleFilter = (ageGroup: number | null) => {
    setSelectedFilter(ageGroup);
  };

  const filteredClasses =
    selectedFilter === null
      ? classesData
      : classesData.filter((cls) => cls.ageGroup === selectedFilter);

  return (
    <Layout style={{ minHeight: "100vh", margin: -8 }}>
      <SharedHeader place={"classPage"} />
      <Content style={{ padding: "64px", alignItems: "center" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          In-charged classes
        </Title>
        <Select
          style={{ width: 160 }}
          defaultValue={selectedFilter}
          onChange={handleFilter}
          placeholder="Filter by Age"
        >
          <Option value={null}>All</Option>
          {classesData.map((cls) => (
            <Option key={cls.id} value={cls.ageGroup}>
              Class {cls.ageGroup} Yo
            </Option>
          ))}
        </Select>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, max(335px))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {filteredClasses.map((cls) => (
            <Card key={cls.id} title={cls.className} style={{ width: "100%" }}>
              <p>Age Group: {cls.ageGroup} Yo</p>
              <Link to={`/classes/${cls.id}`}>
                <Button type="primary">View Details</Button>
              </Link>
            </Card>
          ))}
        </div>
      </Content>
      <SharedFooter place={"classPage"} />
    </Layout>
  );
};

export default MyClassesPage;
