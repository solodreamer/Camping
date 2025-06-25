"use client"
import { useState, useContext } from "react";
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
import AuthContext from "../../AuthContext";
import './userOrderQuery.css';

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
  passengers: [
    {
      id: 1,
      name: "AAH PRICE (男)",
      birthDate: "0912345678",
      passport: "tommy.liu@asiayo.com",
      status: "尚未完成",
    },
    {
      id: 2,
      name: "FHF WW (男)",
      birthDate: "0912345678",
      passport: "tommy.liu@asiayo.com",
      status: "尚未完成",
    },
  ],
  representative: {
    status: "尚未完成",
  },
}

const UserOrderQuery = () => {
  const [selectedKey, setSelectedKey] = useState("order-inquiry")
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  const menuItems = 
    [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderQuery" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ];

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
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {/* 訂單標題 */}
            <Title level={2} style={{ marginBottom: "16px" }}>
              訂單編號 {mockOrderData.orderNumber}
            </Title>

            {/* 警告訊息 */}
            <Space direction="vertical" style={{ width: "100%", marginBottom: "24px" }}>
              {mockOrderData.warnings.map((warning, index) => (
                <Alert key={index} message={warning} type="warning" showIcon style={{ borderRadius: "6px" }} />
              ))}
            </Space>

            <Row gutter={24}>
              {/* 左側：套裝行程資訊 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <Avatar
                        src={mockOrderData.packageInfo.image}
                        size={40}
                        style={{ backgroundColor: COLORS.primary }}
                      />
                      <Text strong style={{ fontSize: "18px", color: COLORS.primary }}>
                        {mockOrderData.packageInfo.name}
                      </Text>
                    </Space>
                  }
                  style={{ marginBottom: "24px" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space>
                      <PhoneOutlined style={{ color: COLORS.primary }} />
                      <Text>市話：{mockOrderData.packageInfo.phone}</Text>
                    </Space>
                    <Space>
                      <MobileOutlined style={{ color: COLORS.primary }} />
                      <Text>手機：{mockOrderData.packageInfo.mobile}</Text>
                    </Space>
                    <Space>
                      <MailOutlined style={{ color: COLORS.primary }} />
                      <Text>E-mail：{mockOrderData.packageInfo.email}</Text>
                    </Space>
                    <Space>
                      <MailOutlined style={{ color: COLORS.primary }} />
                      <Text>營位：{mockOrderData.packageInfo.areaId}</Text>
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
                          {mockOrderData.travelDates.departure}
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ textAlign: "center" }}>
                        <Text>{mockOrderData.travelDates.duration}</Text>
                        <div style={{ margin: "8px 0" }}>→</div>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ textAlign: "center" }}>
                        <Text type="secondary">結束</Text>
                        <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.primary }}>
                          {mockOrderData.travelDates.return}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* 右側：旅客資訊 */}
              <Col xs={24} lg={12}>
                <Card title="訂位者資訊" style={{ marginBottom: "24px" }}>
                  {mockOrderData.passengers.map((passenger, index) => (
                    <div key={passenger.id} style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong>旅客 {passenger.id}</Text>
                        {/* <Tag color={passenger.status === "尚未完成" ? "orange" : "green"}>{passenger.status}</Tag> */}
                      </div>
                      <div style={{ paddingLeft: "16px" }}>
                        <div style={{ marginBottom: "4px" }}>
                          <Text>{passenger.name}</Text>
                        </div>
                        <div style={{ marginBottom: "4px" }}>
                          <Text type="secondary">聯絡電話：{passenger.birthDate}</Text>
                        </div>
                        <div>
                          <Text type="secondary">聯絡信箱：{passenger.passport}</Text>
                        </div>
                      </div>
                      {index < mockOrderData.passengers.length - 1 && <Divider style={{ margin: "16px 0" }} />}
                    </div>
                  ))}
                </Card>

              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default UserOrderQuery;