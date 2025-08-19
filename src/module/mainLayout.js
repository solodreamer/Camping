import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  LoginOutlined, UserAddOutlined, HomeOutlined, UserOutlined, FileSearchOutlined
} from "@ant-design/icons";
import "./mainLayout.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

//選單項目
const getMenuItems = (isLoggedIn, handleLogout) =>
  isLoggedIn
    ? [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderList" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ]
    : [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
      { key: "3", label: "會員登入", icon: <LoginOutlined />, path: "/loginPage" },
    ];

const MainLayout = ({ isLoggedIn, handleLogout, children, selectedKey = "1", headerTitle = "Go露營" }) => {
  const menuItems = getMenuItems(isLoggedIn, handleLogout);
  return (
    <Layout className="layout-container">
      <Sider className="siderStyle" breakpoint="md" collapsedWidth="0">
        <div className="logo">Go露營</div>
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={[selectedKey]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
            onClick: item.onClick,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="headerStyle">
          <Title level={3} style={{ color: '#fff', margin: 16 }}>{headerTitle}</Title>
        </Header>
        <Content className="contentStyle">{children}</Content>
        <Footer className="footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;