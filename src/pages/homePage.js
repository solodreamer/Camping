import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {Layout, Menu, theme, Col, Row, Divider, Typography, Select, DatePicker,} from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined,} from "@ant-design/icons";

import dayjs from "dayjs";
import axios from "axios";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

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
  position: "sticky",
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
  { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/build" },
];

//地區選單
const locations = [
  { value: "north", label: "北部" },
  { value: "central", label: "中部" },
  { value: "south", label: "南部" },
];


function HomePage() {
  const [camps, setCamps] = useState([]);
  const getCampList = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps`);
      if (res.data.success === true) {
        setCamps(res.data.data);
      }
      console.log("getCampList取得成功:", camps);
    } catch (err) {
      console.log("getCampList取得異常:", err);
    }
  };

  useEffect(() => {
    getCampList();
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (value) => {
    console.log(value);
  };

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
          <div>
            <Row>
              <Col>
                <Select options={locations} placeholder="選擇地區"></Select>
              </Col>
              <Col>
                <RangePicker
                  defaultValue={[
                    dayjs("2015-01-01", dateFormat),
                    dayjs("2015-01-01", dateFormat),
                  ]}
                  format={dateFormat}
                />
              </Col>
              <Col></Col>
            </Row>
          </div>
          <Typography>
            <div
              style={{
                padding: 24,
                minHeight: 800,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Divider orientation="left" orientationMargin="0">
                <Title level={2}>熱門營地</Title>
              </Divider>
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                {camps?.map((camp) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      .
                      <div key={camp.id}>
                        <img
                          src={camp.coverImage}
                          alt={camp.name}
                          className="card-img-top rounded-0 object-cover"
                          height={300}
                        />
                        <h4 className="mb-0 mt-2">{camp.name}</h4>
                        <Link
                          // to={`/product/${product.id}`}
                          className="btn btn-outline-dark rounded-0 text-nowrap mt-2"
                        >
                          詳細資訊
                        </Link>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Typography>
        </Content>
        <Footer style={footerStyle}>
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default HomePage;
