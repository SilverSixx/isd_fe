import React, { useState, useEffect, useContext } from "react";
import { Button, Table, message } from "antd";
import FoodDetail from "./details/FoodDetail";
import CreateFood from "../forms/CreateFood";
import { LoginContext } from "../../../context/LoginContext";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 7;

const FoodTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [foodData, setFoodData] = useState<any>([]);
  const [kidData, setKidData] = useState<any>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [keyForRemount, setKeyForRemount] = useState(0);

  const LoginCtx = useContext(LoginContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/food/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        console.log("res.data", res.data);

        setFoodData(res.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchData();

    const fetchKidData = async () => {
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + "/kid/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      setKidData(res.data);
    };

    fetchKidData();
  }, [keyForRemount]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Tên món ăn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Định lượng tổng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount: number) => totalAmount + " kg",
    },
    {
      title: "Định lượng cá nhân",
      dataIndex: "totalAmount",
      key: "totalAmountPerKid",
      render: (totalAmount: number) => {
        if (kidData && kidData.length > 0) {
          return (totalAmount / kidData.length).toFixed(2) + " kg";
        } else {
          return "";
        }
      },
    },
    {
      title: "Số trẻ dị ứng với món ăn",
      dataIndex: "allergyKids",
      key: "kidallergyKids",
      render: (allergyKids: any[]) => allergyKids?.length || 0,
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
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleEditClick = (record: any) => {
    setIsEditing(true);
    setSelectedFood(record);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFood(null);
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
    setSelectedFood(null);
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
            Thêm mới món ăn
          </Button>
          <Table
            dataSource={foodData?.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: foodData?.length,
            }}
          />
        </>
      )}
      {isEditing && (
        <FoodDetail
          item={selectedFood}
          onCancel={handleCancelEdit}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {isCreateModalVisible && (
        <CreateFood
          onCancel={handleCreateTeacherCancel}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default FoodTab;
