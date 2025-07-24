"use client"
import React, { useState, useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  Layout, Typography, Table, Button, Input, Select, DatePicker, Space, Modal, Row, Col, Divider, Menu
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

import AuthContext from "../../AuthContext";
import { api, } from "../../api";
import "./userOrderList.css";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserOrderList = () => {
  const [selectedMenu, setSelectedMenu] = useState("order-list")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const [orderList, setOrderList] = useState([]);
  const [status, setStatus] = useState(""); // 新增付款狀態

  // 模擬露營訂單資料
  const mockOrderData = [
    {
      order_no: "T202506020001",
      camp_name: "Mountain Adventure Camp",
      amount: 3200,
      start_date: "2025-06-06",
      end_date: "2025-06-09",
      status_name: "已付款",
      campsiteDetails: {
        address: "台北市陽明山國家公園內",
        phone: "+886 2 2861-1234",
        email: "info@mountaincamp.com",
        facilities: ["衛浴設備", "烤肉區", "停車場", "便利商店", "WiFi"],
      },
      bookingDetails: {
        guestName: "王小明",
        guestPhone: "+886 912345678",
        guestEmail: "wang@example.com",
        adults: 2,
        children: 1,
        tents: 1,
      },
      priceBredown: {
        basePrice: 2800,
        serviceFee: 200,
        tax: 280,
        discount: 80,
      },
    }
  ]

  //選單項目
  const menuItems =
    [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderDetail" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ];

  // 顯示訂單明細
  const showOrderDetail = (order) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  // 關閉彈窗
  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedOrder(null)
  }

  // 搜尋按鈕事件
  const onSearchClick = () => {
    getOrderList(status);
  };

  // 取得訂單清單
  const getOrderList = async (status='') => {
    try {
      const res = await api.get(`/v1/orders?status=${status}`);
      if (res.data.success === true) {
        setOrderList(res.data.data);
      }
    }
    catch (error) {
      console.error('取得訂單清單失敗:', error);
    }
  }

  /**
   * 初始化取得訂單詳情
   */
  useEffect(() => {
    getOrderList();
  }, []);

  // 表格欄位定義
  const columns = [
    {
      title: "明細",
      key: "detail",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          style={{
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
          onClick={() => showOrderDetail(record)}
        >
          🔍
        </Button>
      ),
    },
    {
      title: "訂單號碼",
      dataIndex: "order_no",
      key: "order_no",
      width: 150,
      render: (text) => <Text style={{ color: "#1890ff", cursor: "pointer" }}>{text}</Text>,
    },
    {
      title: "營區名稱",
      dataIndex: "camp_name",
      key: "camp_name",
      width: 200,
    },
    {
      title: "金額",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: "#f5222d" }}>
          NT$ {amount.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "開始日期",
      dataIndex: "start_date",
      key: "start_date",
      width: 120,
      sorter: (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    },
    {
      title: "結束日期",
      dataIndex: "end_date",
      key: "end_date",
      width: 120,
      sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
    },
    {
      title: "付款狀態",
      dataIndex: "status_name",
      key: "status_name",
      width: 120,
      render: (status) => {
        let color = "#52c41a" // 綠色 - 已付款
        let bgColor = "#f6ffed"

        if (status === "待付款") {
          color = "#faad14" // 橙色
          bgColor = "#fff7e6"
        } else if (status === "已取消") {
          color = "#f5222d" // 紅色
          bgColor = "#fff2f0"
        }

        return (
          <div
            style={{
              background: bgColor,
              color: color,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              textAlign: "center",
              border: `1px solid ${color}20`,
            }}
          >
            {status}
          </div>
        )
      },
      filters: [
        { text: "已付款", value: "已付款" },
        { text: "待付款", value: "待付款" },
        { text: "已取消", value: "已取消" },
      ],
      onFilter: (value, record) => record.status_name === value,
    },
  ]

  return (
    <Layout>
      {/* 側邊欄 */}
      <Sider className="siderStyle" breakpoint="md" collapsedWidth="0">
        <div className="logo">Go露營</div>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={['3']}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
            onClick: item.onClick,
          }))} />
      </Sider>

      <Layout>
        <Header className="order-headerStyle">
          <Title level={3} style={{ color: '#fff', margin: 16 }}>訂單查詢</Title>
        </Header>

        {/* 主要內容區域 */}
        <Content className="campdetail-contentStyle">
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* 搜尋和篩選區域 */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ width: "100%" }}>
                <Select
                  placeholder="付款狀態"
                  style={{ width: 120 }}
                  allowClear
                  value={status}
                  onChange={(value) => setStatus(value)}
                >
                  <Option value="">全部</Option>
                  <Option value="1">已付款</Option>
                  <Option value="2">待付款</Option>
                  <Option value="3">已取消</Option>
                </Select>
                <Button type="primary" onClick={onSearchClick}>搜尋</Button>
              </Space>
            </div>

            {/* 訂單列表表格 */}
            <div
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Table
                columns={columns}
                dataSource={orderList}
                pagination={{
                  total: orderList.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
                }}
                scroll={{ x: 900 }}
                size="middle"
              />
            </div>
          </div>
        </Content>
        <Footer className="campdetail-footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>

      {/* 訂單明細彈窗 */}
      <Modal
        title={<div style={{ fontSize: "18px", fontWeight: "bold" }}>訂單明細 - {selectedOrder?.order_no}</div>}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            關閉
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* 基本訂單資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                📋 基本資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>訂單號碼：</Text>
                  <Text>{selectedOrder.order_no}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>營區名稱：</Text>
                  <Text>{selectedOrder.camp_name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>入住日期：</Text>
                  <Text>{selectedOrder.start_date}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>退房日期：</Text>
                  <Text>{selectedOrder.end_date}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>付款狀態：</Text>
                  <Text
                    style={{
                      color:
                        selectedOrder.status_name === "已付款"
                          ? "#52c41a"
                          : selectedOrder.status_name === "待付款"
                            ? "#faad14"
                            : "#f5222d",
                    }}
                  >
                    {selectedOrder.status_name}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>總金額：</Text>
                  <Text style={{ color: "#f5222d", fontWeight: "bold" }}>
                    NT$ {selectedOrder.amount.toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 營區資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                🏕️ 營區資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Text strong>地址：</Text>
                  <Text>{selectedOrder.campsiteDetails.address}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>電話：</Text>
                  <Text>{selectedOrder.campsiteDetails.phone}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Email：</Text>
                  <Text>{selectedOrder.campsiteDetails.email}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>設施：</Text>
                  <div style={{ marginTop: "8px" }}>
                    {selectedOrder.campsiteDetails.facilities.map((facility, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f2f5",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          marginRight: "8px",
                          marginBottom: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 預訂者資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                👤 預訂者資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>姓名：</Text>
                  <Text>{selectedOrder.bookingDetails.guestName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>電話：</Text>
                  <Text>{selectedOrder.bookingDetails.guestPhone}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Email：</Text>
                  <Text>{selectedOrder.bookingDetails.guestEmail}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>成人：</Text>
                  <Text>{selectedOrder.bookingDetails.adults} 人</Text>
                </Col>
                <Col span={8}>
                  <Text strong>兒童：</Text>
                  <Text>{selectedOrder.bookingDetails.children} 人</Text>
                </Col>
                <Col span={8}>
                  <Text strong>帳篷：</Text>
                  <Text>{selectedOrder.bookingDetails.tents} 頂</Text>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 費用明細 */}
            <div>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                💰 費用明細
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text>基本費用：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.basePrice.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text>服務費：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.serviceFee.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text>稅金：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.tax.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ color: "#52c41a" }}>折扣：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text style={{ color: "#52c41a" }}>-NT$ {selectedOrder.priceBredown.discount.toLocaleString()}</Text>
                </Col>
                <Col span={24}>
                  <Divider style={{ margin: "12px 0" }} />
                </Col>
                <Col span={12}>
                  <Text strong style={{ fontSize: "16px" }}>
                    總計：
                  </Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text strong style={{ fontSize: "16px", color: "#f5222d" }}>
                    NT$ {selectedOrder.amount.toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default UserOrderList;