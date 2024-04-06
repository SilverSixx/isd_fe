import React, { useState, useEffect, useContext } from "react";
import { Button, Table, message } from "antd";
import ClassDetail from "./details/ClassDetail";
import CreateClass from "../forms/CreateClass";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 7;

const ClassTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [classData, setClassData] = useState<any>([]);
  const [keyForRemount, setKeyForRemount] = useState(0);

  const LoginCtx = useContext(LoginContext);

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
      }
    };
    fetchClassData();
  }, [keyForRemount]);

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
  };

  const handleCreateClassCancel = () => {
    setIsCreateModalVisible(false);
  };

  const onCreateSuccess = () => {
    setIsCreateModalVisible(false);
    setKeyForRemount(keyForRemount + 1);
  };

  const onUpdateSuccess = () => {
    setIsEditing(false);
    setSelectedClass(null);
    setKeyForRemount(keyForRemount + 1);
  };

  const columns = [
    {
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tuổi",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Giáo viên phụ trách",
      dataIndex: ["teacher", "fullName"],
      key: "teacher",
    },
    {
      title: "Số trẻ trong lớp",
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
            Chỉnh sửa
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
            Tạo lớp mới
          </Button>
          <Table
            dataSource={classData.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: classData.length,
            }}
          />
        </>
      )}
      {isEditing && (
        <ClassDetail
          item={selectedClass}
          onCancel={handleCancelEdit}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isCreateModalVisible && (
        <CreateClass
          onCancel={handleCreateClassCancel}
          onCreateSuccess={onCreateSuccess}
        />
      )}
    </>
  );
};

export default ClassTab;
