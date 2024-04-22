import React, { useState, useEffect, useContext } from "react";
import { Button, Table, message } from "antd";
import { LoginContext } from "../../../context/LoginContext";
import CreateParent from "../forms/CreateParent";

const BASE_BACKEND_URL = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 7;

const ParentTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [parentData, setParentData] = useState<any>([]);
  const [keyForRemount, setKeyForRemount] = useState(0);

  const LoginCtx = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const token = LoginCtx.authToken || localStorage.getItem("authToken");
        const response = await fetch(BASE_BACKEND_URL + "/parent/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        setParentData(res.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };
    fetchParentData();
  }, [keyForRemount]);

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
      title: "Số CCCD",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
    },
    {
      title: "Tên trẻ",
      dataIndex: ["kid", "fullName"],
      key: "kidName",
    },
    {
      title: "Tên thường gọi của trẻ",
      dataIndex: ["kid", "nickName"],
      key: "kidNickname",
    },
    {
      title: "",
      key: "",
      render: (record: any) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button danger size="middle" onClick={() => handleDelelte(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateNew = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateParentCancel = () => {
    setIsCreateModalVisible(false);
  };

  const onCreateSuccess = () => {
    setIsCreateModalVisible(false);
    setKeyForRemount(keyForRemount + 1);
  };

  const handleDelelte = async (id: number) => {
    try {
      const token = LoginCtx.authToken || localStorage.getItem("authToken");
      const response = await fetch(BASE_BACKEND_URL + `/parent/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        message.success(data?.message);
        setTimeout(() => {
          setKeyForRemount(keyForRemount + 1);
        }, 3500);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      message.error("Lỗi khi xóa phụ huynh. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {contextHolder}
      {!isCreateModalVisible ? (
        <>
          <Button
            type="primary"
            onClick={handleCreateNew}
            style={{ marginBottom: "10px" }}
          >
            Tạo phụ huynh mới
          </Button>
          <Table
            dataSource={parentData.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: parentData.length,
            }}
          />
        </>
      ) : (
        <CreateParent
          onCancel={handleCreateParentCancel}
          onCreateSuccess={onCreateSuccess}
        />
      )}
    </>
  );
};

export default ParentTab;
