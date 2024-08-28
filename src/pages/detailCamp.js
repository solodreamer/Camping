import { Link, NavLink } from "react-router-dom";

import { Layout, Menu, Col, Row, Divider, Typography, Image, Empty } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const blockContent = {
  data: {
    campPhotos: [
      {
        "img": "https://fakeimg.pl/350x350/?text=Hello"
      },
      {
        "img": "https://fakeimg.pl/350x350/?text=abs"
      },
    ],
    campsite: [
      {
        areaName: "A區",
        campId: 1,
        holidayPrice: 1500,
        surfaceType: 1,
        weekdayPrice: 800,
      },
      {
        areaName: "B區",
        campId: 1,
        holidayPrice: 1200,
        surfaceType: 2,
        weekdayPrice: 700,
      },
    ],
    coverImage: "mountain.jpg",
    desc: "Explore the mountains",
    fullAddress: "台中市南區福興街600號",
    id: 1,
    name: "Mountain Adventure Camp",
    ownerId: 1,
  },
  success: true,
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
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Image.PreviewGroup
                  items={blockContent.data.campPhotos.map(item => {return {src: item.img}})}
                >
                  <Image
                    width={200}
                    src={blockContent.data.campPhotos[0].img}
                    fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                  />
                </Image.PreviewGroup>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title>{blockContent.data.name}</Title>

                <Paragraph>{blockContent.data.desc}</Paragraph>

                <Paragraph>
                  <Text strong underline>
                    <NavLink to="https://www.google.com/maps">
                      {blockContent.data.fullAddress}
                    </NavLink>
                  </Text>
                </Paragraph>
              </Col>
            </Row>
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
