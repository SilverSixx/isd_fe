import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import ClassDetail from "./details/ClassDetail"; // Import the ClassDetail component
import CreateClass from "../forms/CreateClass";

const classData = [
  {
    id: 1,
    name: "Mầm",
    grade: 2,
    teacher: "John Doe",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 2, name: "Bob", nickname: "Cún", age: 6, class: "English" },
      { id: 3, name: "Ace", nickname: "Cún", grade: 3, teacher: "Jane Smith" },
      { id: 4, name: "Lá", nickname: "Cún", grade: 4, teacher: "Peter Jones" },
      { id: 5, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 2,
    name: "Nụ",
    grade: 3,
    teacher: "Jane Smith",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 2, name: "Nụ", nickname: "Cún", grade: 3, teacher: "Jane Smith" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 3,
    name: "Lá",
    grade: 4,
    teacher: "Peter Jones",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 2, name: "Nụ", nickname: "Cún", grade: 3, teacher: "Jane Smith" },
      { id: 3, name: "Lá", nickname: "Cún", grade: 4, teacher: "Peter Jones" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 4,
    name: "Cành",
    grade: 5,
    teacher: "Peter Sims",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 5,
    name: "Hoa",
    grade: 2,
    teacher: "Peter Sims",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 6,
    name: "Phấn",
    grade: 2,
    teacher: "Peter Sims",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 7,
    name: "Bảng",
    grade: 2,
    teacher: "Peter Sims",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
  {
    id: 8,
    name: "Bảng",
    grade: 2,
    teacher: "Peter Sims",
    kids: [
      { id: 1, name: "Alice", nickname: "Cún", age: 5, class: "Math" },
      { id: 4, name: "Cành", nickname: "Cún", grade: 5, teacher: "Peter Sims" },
    ],
  },
];

const ITEMS_PER_PAGE = 7;

const ClassTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newClassData, setNewClassData] = useState<any>({
    name: "",
    grade: "",
  });

  const currentTableData = classData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on state changes
  }, [isEditing, isCreateModalVisible, newClassData]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (record: any) => {
    setIsEditing(true);
    setSelectedClass(record);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedClass(null);
  };

  const handleCreateNewClass = () => {
    setIsCreateModalVisible(true);
    setNewClassData({ name: "", grade: "" });
  };

  const handleCreateClassSubmit = () => {
    // Implement logic to create a new class object (e.g., API call, update state)
    const newClassId = classData.length + 1; // Generate temporary ID
    //const newClass = { ...values, id: newClassId }; // Add ID to new class data
    // setClassData([...classData, newClass]); // Add new class to existing data
    setIsCreateModalVisible(false); // Close modal after successful submission
  };

  const handleCreateClassCancel = () => {
    setIsCreateModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Kids",
      dataIndex: "kids",
      key: "kids",
      render: (kids: any[]) => kids?.length || 0,
    },
    {
      title: "",
      key: "",
      render: (record: any) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            size="middle"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {!isEditing && !isCreateModalVisible && (
        <>
          <Button
            type="primary"
            onClick={handleCreateNewClass}
            style={{ marginBottom: "10px" }}
          >
            Create New Class
          </Button>
          <Table
            dataSource={currentTableData}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: classData.length, // Total number of items for pagination
            }}
          />
        </>
      )}
      {isEditing && (
        <ClassDetail
          item={selectedClass}
          onCancel={handleCancelEdit}
          onSubmited={() => {}}
        />
      )}
      {isCreateModalVisible && (
        <CreateClass
          onCancel={handleCreateClassCancel}
          onSubmit={handleCreateClassSubmit}
        />
      )}
    </>
  );
};

export default ClassTab;
