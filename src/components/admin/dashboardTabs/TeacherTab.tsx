import React, { useState, useEffect, useContext } from "react";
import { Button, Table, message } from "antd";
import TeacherDetail from "./details/TeacherDetail";
import CreateTeacher from "../forms/CreateTeacher";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "https://isd-be.vercel.app/api/v1";
const ITEMS_PER_PAGE = 7;

const TeacherTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherData, setTeacherData] = useState<any>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [keyForRemount, setKeyForRemount] = useState(0);

  const LoginCtx = useContext(LoginContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/teacher/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        setTeacherData(res.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchData();
  }, [keyForRemount]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Danh sách lớp phụ trách",
      dataIndex: "classes",
      key: "classes",
      render: (classes: any[]) =>
        ((c) => c.map((c: any) => c.name).join(", "))(classes),
    },
    {
      title: "",
      key: "",
      render: (record: any) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            size="middle"
            style={{ marginRight: 10 }}
            onClick={() => handleEditClick(record)}
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];

  const handleEditClick = (record: any) => {
    setIsEditing(true);
    setSelectedTeacher(record);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTeacher(null);
  };

  const handleCreateNewTeacher = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateTeacherCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    setKeyForRemount(keyForRemount + 1);
  };

  const onUpdateSuccess = () => {
    setIsEditing(false);
    setSelectedTeacher(null);
    setKeyForRemount(keyForRemount + 1);
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
            Tạo giáo viên mới
          </Button>
          <Table
            dataSource={teacherData.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
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
        <TeacherDetail
          item={selectedTeacher}
          onCancel={handleCancelEdit}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isCreateModalVisible && (
        <CreateTeacher
          onCancel={handleCreateTeacherCancel}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default TeacherTab;
