import React, { useState, useEffect, useContext } from "react";
import { Button, Table } from "antd";
import KidDetail from "./details/KidDetail";
import CreateKid from "../forms/CreateKid";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 7;

const KidTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [kidsData, setKidsData] = useState<any>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKid, setSelectedKid] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [keyForRemount, setKeyForRemount] = useState(0);

  const LoginCtx = useContext(LoginContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/kid/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        setKidsData(res.data);
      } catch (error) {
        console.error("Error fetching kid data:", error);
      }
    };

    fetchData();
  }, [keyForRemount]);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Nickname",
      dataIndex: "nickName",
      key: "nickname",
    },
    {
      title: "Age",
      dataIndex: "dob",
      key: "dob",
      render: (dob: string) => {
        const today = new Date();
        const birthYear = new Date(dob).getFullYear();
        return today.getFullYear() - birthYear;
      },
    },
    {
      title: "Class",
      dataIndex: ["classBelongsTo", "name"],
      key: "classBelongsTo",
    },
    {
      title: "Grade",
      dataIndex: ["classBelongsTo", "grade"],
      key: "gradeBelongsTo",
    },
    {
      title: "Parent",
      dataIndex: ["parent", "fullName"],
      key: "parent",
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
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (record: any) => {
    console.log("Editing kid:", record);
    
    setSelectedKid(record);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedKid(null);
  };

  const handleCreateNewKid = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateKidCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    setKeyForRemount(keyForRemount + 1);
  };

  const onUpdateSuccess = () => {
    setIsEditing(false);
    setSelectedKid(null);
    setKeyForRemount(keyForRemount + 1);
  }

  return (
    <>
      {!isEditing && !isCreateModalVisible && (
        <>
          <Button
            type="primary"
            onClick={handleCreateNewKid}
            style={{ marginBottom: "10px" }}
          >
            Create New Kid
          </Button>
          <Table
            dataSource={kidsData.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: kidsData.length,
            }}
          />
        </>
      )}
      {isEditing && (
        <KidDetail
          item={selectedKid}
          onCancel={handleCancelEdit}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isCreateModalVisible && (
        <CreateKid
          onCancel={handleCreateKidCancel}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default KidTab;
