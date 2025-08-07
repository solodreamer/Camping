"use client"
import React, { useState, useContext, useEffect, useRef } from "react";
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
import MainLayout from "../../module/mainLayout";
import UserOrderDetail from "./userOrderDetail";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
//UserOrderList 內容...

const UserOrderList = () => {
  const orderDetailRef = useRef();
  const [selectedMenu, setSelectedMenu] = useState("order-list")
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const [orderList, setOrderList] = useState([]);
  const [status, setStatus] = useState(""); // 新增付款狀態

  //選單項目
  const menuItems =
    [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderList" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ];

  // 顯示訂單明細（改為呼叫 UserOrderDetail 的 showOrderDetail 方法）
  const showOrderDetail = (record) => {
    if (orderDetailRef.current) {
      orderDetailRef.current.showOrderDetail(record.order_no);
    }
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

      {/* 訂單明細彈窗元件 */}
      <UserOrderDetail ref={orderDetailRef} />
    </Layout>
  )
}

export default UserOrderList;