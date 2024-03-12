import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import KidDetail from "./details/KidDetail";
import CreateKid from "../forms/CreateKid";

const kidsData = [
  {
    id: 1,
    fullName: "Alice Jayce",
    nickname: "Cún",
    age: 5,
    cls: [{ id: 1, name: "Nụ", grade: 5 }],
    parentName: "John Doe",
  },
  {
    id: 2,
    fullName: "Bob",
    nickname: "Thỏ",
    age: 2,
    cls: [{ id: 1, name: "Mầm", grade: 2 }],
    parentName: "Jane Smith",
  },
  {
    id: 3,
    fullName: "Charlie",
    nickname: "Bông",
    age: 4,
    cls: [{ id: 1, name: "Lá", grade: 4 }],
    parentName: "Peter Jones",
  },
];

const ITEMS_PER_PAGE = 7;

const KidTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setEditing] = useState(false);
  const [selectedKid, setselectedKid] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newKidData, setnewKidData] = useState<any>({
    fullName: "",
    parentfullName: "",
  });

  const currentTableData = kidsData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on state changes
  }, [isEditing, isCreateModalVisible, newKidData]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Class",
      dataIndex: "cls",
      key: "cls",
      render: (c: any) => c.name,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Grade",
      dataIndex: "cls",
      key: "cls",
      render: (c: any) => c.grade,
    },
    {
      title: "Parent",
      dataIndex: "parentName",
      key: "parentName",
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
              handleEdit(record);
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

  const handleEdit = (record: any) => {
    setEditing(true);
    setselectedKid(record);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setselectedKid(null);
  };

  const handleCreateNewkid = () => {
    setIsCreateModalVisible(true);
    setnewKidData({ fullName: "", subject: "" });
  };

  const handleCreateKidSubmit = (values: any) => {
    // Implement logic to create a new class object (e.g., API call, update state)

    // setTeacherData([...classData, newClass]); // Add new class to existing data
    setIsCreateModalVisible(false); // Close modal after successful submission
  };

  const handleCreateKidCancel = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <>
      {!isEditing && !isCreateModalVisible && (
        <>
          <Button
            type="primary"
            onClick={handleCreateNewkid}
            style={{ marginBottom: "10px" }}
          >
            Create New Kid
          </Button>
          <Table
            dataSource={currentTableData}
            columns={columns}
            rowKey="id"
            pagination={{
              onChange: handleChangePage,
              current: currentPage,
              pageSize: ITEMS_PER_PAGE,
              total: kidsData.length, // Total number of items for pagination
            }}
          />
        </>
      )}
      {isEditing && (
        <KidDetail item={selectedKid} onCancel={handleCancelEdit} />
      )}
      {isCreateModalVisible && (
        <CreateKid
          onCancel={handleCreateKidCancel}
          onSubmit={handleCreateKidSubmit}
        />
      )}
    </>
  );
};

export default KidTab;
