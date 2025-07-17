"use client"
import React, { useState, useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Layout, Menu, Card, Typography, Alert, Button, Tag, Space, Avatar, Row, Col, Divider } from "antd"
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  PhoneOutlined,
  MobileOutlined,
  MailOutlined,
  FileSearchOutlined
} from "@ant-design/icons";
import { api, } from "../../api";
import dayjs from "dayjs";
import AuthContext from "../../AuthContext";
import './userOrderDetail.css';

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

// 定義顏色常量，避免使用 @ant-design/colors
const COLORS = {
  primary: "#1890ff",
  headerBg: "#1c4ba0",
  warning: "#faad14",
  success: "#52c41a",
  siderBg: "#f0f2f5",
  borderColor: "#d9d9d9",
}

// 模擬訂單資料
const mockOrderData = {
  orderNumber: "T202506020001",
  status: "已確認",
  warnings: ["請於 2025/06/05 前繳清旅客資料", "有條件退款"],
  packageInfo: {
    name: "Mountain Adventure Camp",
    image: "/placeholder.svg?height=80&width=80",
    phone: "+886 422614486",
    mobile: "+886 912345678",
    email: "tommy.liu@asiayo.com",
    areaId: "A區",
  },
  travelDates: {
    departure: "2025年6月6日(五)",
    return: "2025年6月9日(一)",
    duration: "4日",
  },
  passengers: {
    id: 1,
    name: "AAH PRICE (男)",
    birthDate: "0912345678",
    passport: "tommy.liu@asiayo.com",
    status: "尚未完成",
  },
  representative: {
    status: "尚未完成",
  },
}

const UserOrderDetail = () => {
  const [selectedKey, setSelectedKey] = useState("order-inquiry")
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const [orderDetail, setOrderDetail] = useState(null);

  const menuItems =
    [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderDetail" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ];

  // 取得訂單詳情
  const getOrderDetail = async () => {
    const orderNo = 20250710122348
    try {
      const res = await api.get(`/v1/orders/${orderNo}`);
      if (res.data.success === true) {
        setOrderDetail(res.data.data);
      }
    }
    catch (error) {
      console.error('取得訂單詳情失敗:', error);
    }
  }

  /**
   * 初始化取得訂單詳情
   */
  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <Layout className="layout-container">
      <Sider className="profile-siderStyle" breakpoint="md" collapsedWidth="0">
        <div className="logo">Go露營</div>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={['3']}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
          }))}
        />
      </Sider>

      <Layout>
        <Header className="profile-headerStyle">
          <Title level={3} style={{ color: '#fff', margin: 16 }}>訂單查詢</Title>
        </Header>

        {/* 主要內容區域 */}
        <Content
          style={{
            padding: "24px",
            background: COLORS.siderBg,
          }}
        >
          {orderDetail ? (
            <>
              <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* 訂單標題 */}
                <Title level={2} style={{ marginBottom: "16px" }}>
                  訂單編號 {orderDetail.order.order_no}
                </Title>

                {/* 警告訊息 */}
                {/* <Space direction="vertical" style={{ width: "100%", marginBottom: "24px" }}>
              {mockOrderData.warnings.map((warning, index) => (
                <Alert key={index} message={warning} type="warning" showIcon style={{ borderRadius: "6px" }} />
              ))}
            </Space> */}

                <Row gutter={24}>
                  {/* 左側：套裝行程資訊 */}
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <Space>
                          <Text strong style={{ fontSize: "18px", color: COLORS.primary }}>
                            {orderDetail.reservations.campsite_name}
                          </Text>
                        </Space>
                      }
                      style={{ marginBottom: "24px" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                          <MobileOutlined style={{ color: COLORS.primary }} />
                          <Text>電話：orderDetail.reservations.mobile</Text>
                        </Space>
                        <Space>
                          <MailOutlined style={{ color: COLORS.primary }} />
                          <Text>營位：{orderDetail.reservations.area_name}</Text>
                        </Space>
                      </Space>
                    </Card>

                    {/* 出發日期資訊 */}
                    <Card title="行程日期" style={{ marginBottom: "24px" }}>
                      <Row justify="space-between" align="middle">
                        <Col>
                          <div style={{ textAlign: "center" }}>
                            <Text type="secondary">出發</Text>
                            <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.primary }}>
                              {orderDetail.order.start_date}
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <div style={{ textAlign: "center" }}>
                            {/* <Text>{mockOrderData.travelDates.duration}</Text> */}
                            <div style={{ margin: "8px 0" }}>→</div>
                          </div>
                        </Col>
                        <Col>
                          <div style={{ textAlign: "center" }}>
                            <Text type="secondary">結束</Text>
                            <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.primary }}>
                              {orderDetail.order.end_date}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <Text>載入中...</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default UserOrderDetail;