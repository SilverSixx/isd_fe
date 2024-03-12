import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import TeacherDetail from "./details/TeacherDetail";
import CreateTeacher from "../forms/CreateTeacher";

const teacherData = [
  {
    id: 1,
    name: "John Doe",
    username: "teacher1",
    password: "hashed password",
    classes: [
      { id: 1, name: "Mầm", grade: 2 },
      { id: 2, name: "Nụ", grade: 3 },
      { id: 3, name: "Lá", grade: 4 },
      { id: 4, name: "Cành", grade: 5 },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "teacher2",
    password: "hashed password",
    classes: [
      { id: 1, name: "Mầm", grade: 2 },
      { id: 2, name: "Nụ", grade: 3 },
      { id: 3, name: "Lá", grade: 4 },
    ],
  },
  {
    id: 3,
    name: "Peter Jones",
    username: "teacher3",
    password: "hashed password",
    classes: [
      { id: 1, name: "Mầm", grade: 2 },
      { id: 2, name: "Nụ", grade: 3 },
    ],
  },
];

const ITEMS_PER_PAGE = 7;

const TeacherTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setEditing] = useState(false);
  const [selectedTeacher, setselectedTeacher] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<any>({
    name: "",
    username: "",
  });

  const currentTableData = teacherData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on state changes
  }, [isEditing, isCreateModalVisible, newTeacherData]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Classes",
      dataIndex: "classes",
      key: "classes",
      render: (classes: any[]) => classes?.length || 0,
    },
    {
      title: "",
      key: "",
      render: (record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="primary"
            size="middle"
            style={{ marginRight: 10 }}
            onClick={() => {
              handleEditClick(record);
            }}
          >
            Update
          </Button>
          <Button danger size="middle">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEditClick = (record: any) => {
    setEditing(true);
    setselectedTeacher(record);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setselectedTeacher(null);
  };

  const handleCreateNewTeacher = () => {
    setIsCreateModalVisible(true);
    setNewTeacherData({ name: "", username: "" });
  };

  const handleCreateTeacherSubmit = (values: any) => {
    // Implement logic to create a new class object (e.g., API call, update state)

    // setTeacherData([...classData, newClass]); // Add new class to existing data
    setIsCreateModalVisible(false); // Close modal after successful submission
  };

  const handleCreateTeacherCancel = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <>
      {!isEditing && !isCreateModalVisible && (
        <>
          <Button
            type="primary"
            onClick={handleCreateNewTeacher}
            style={{ marginBottom: "10px" }}
          >
            Create New Teacher
          </Button>
          <Table
            dataSource={currentTableData}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: teacherData.length,
            }}
          />
        </>
      )}
      {isEditing && (
        <TeacherDetail item={selectedTeacher} onCancel={handleCancelEdit} />
      )}
      {isCreateModalVisible && (
        <CreateTeacher
          onCancel={handleCreateTeacherCancel}
          onSubmit={handleCreateTeacherSubmit}
        />
      )}
    </>
  );
};

export default TeacherTab;
