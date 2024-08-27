import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

import { Layout, Menu, theme, Col, Row, Divider, Typography, } from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined, } from "@ant-design/icons";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const blockContent = {
  "data": {
    "campPhotos": [
      {
        "img": "https://fakeimg.pl/350x350/?text=Hello"
      },
      {
        "img": "https://fakeimg.pl/350x350/?text=abs"
      }
    ],
    "campsite": [
      {
        "areaName": "A區",
        "campId": 1,
        "holidayPrice": 1500,
        "surfaceType": 1,
        "weekdayPrice": 800
      },
      {
        "areaName": "B區",
        "campId": 1,
        "holidayPrice": 1200,
        "surfaceType": 2,
        "weekdayPrice": 700
      }
    ],
    "coverImage": "mountain.jpg",
    "desc": "Explore the mountains",
    "fullAddress": "台中市南區福興街600號",
    "id": 1,
    "name": "Mountain Adventure Camp",
    "ownerId": 1
  },
  "success": true
};

// 日期格式
const dateFormat = "YYYY-MM-DD";

//style設定
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
  top: 0,
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

//選單項目
const menuItems = [
  { key: "1", label: "會員登入", icon: <LoginOutlined />, path: "/login" },
  { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
  { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/" },
];



function DetailCamp() {


  return (
    <Layout>
      <Sider style={siderStyle} breakpoint="md" collapsedWidth="0">
        <Menu mode="inline" theme="dark">
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={headerStyle}>Go露營</Header>
        <Content style={contentStyle}>
          <Typography>
            <Title>{blockContent.data.name}</Title>

            <Paragraph>
              {blockContent.data.desc}
            </Paragraph>

            <Paragraph>
              <Text strong underline>
              <NavLink to="https://www.google.com/maps">
              {blockContent.data.fullAddress}
              </NavLink>
              </Text>
            </Paragraph>

            <Divider />

            <Title level={2}>Guidelines and Resources</Title>

            <Paragraph>
              We supply a series of design principles, practical patterns and high quality design resources
              (<Text code>Sketch</Text> and <Text code>Axure</Text>), to help people create their product
              prototypes beautifully and efficiently.
            </Paragraph>

            <Paragraph>
              <ul>
                <li>
                  <Link href="/docs/spec/proximity">Principles</Link>
                </li>
                <li>
                  <Link href="/docs/spec/overview">Patterns</Link>
                </li>
                <li>
                  <Link href="/docs/resources">Resource Download</Link>
                </li>
              </ul>
            </Paragraph>

            <Paragraph>
              Press <Text keyboard>Esc</Text> to exit...
            </Paragraph>

            <Divider />


          </Typography>
        </Content>
        <Footer style={footerStyle}>
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DetailCamp;
