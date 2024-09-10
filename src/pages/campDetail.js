import { useEffect, useState } from 'react';
import { Link, NavLink, useParams } from "react-router-dom";

import {
  Layout,
  Menu,
  Col,
  Row,
  Divider,
  Typography,
  Image,
  Empty,
  Tag,
} from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./campDetail.css";
import axios from 'axios';

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const productRes = {
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
        campsitePhotos: [
          {
            img: "https://plus.unsplash.com/premium_photo-1697778136943-88184ee17aba?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          },
          {
             img: "https://fakeimg.pl/350x350/?text=campsite2"
          }
      ],
        areaName: "A區",
        campId: 1,
        holidayPrice: 1500,
        surfaceType: "草地",
        weekdayPrice: 800,
      },
      {
        campsitePhotos: [
                    {
                      img: "https://fakeimg.pl/350x350/?text=campsite1"
                    },
                    {
                      img: "https://fakeimg.pl/350x350/?text=campsite2"
                    }
                ],
        areaName: "B區",
        campId: 1,
        holidayPrice: 1200,
        surfaceType: "碎石",
        weekdayPrice: 700,
      }
    ],
    coverImage: "https://plus.unsplash.com/premium_photo-1669058790122-bb99e0c94cdc?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "Explore the mountains",
    fullAddress: "台中市南區福興街600號",
    id: 1,
    name: "Mountain Adventure Camp",
    ownerId: 1,
  },
  success: true,
};

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

function CampDetail() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const getCampDetail = async (id) => {
    const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps/${id}`);
    console.log("[營地資訊]",productRes.data);
    setProduct(productRes.data);
  }

  useEffect(() => {
    getCampDetail(id);
  },[id]);


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
                {/* <Row> */}
                  <Image.PreviewGroup
                    items={productRes?.data.campPhotos.map((item) => {
                      return { src: item.img };
                    })}
                  >
                    <Image
                      width={400}
                      src={productRes.data.campPhotos[0].img}
                      fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                    />
                  </Image.PreviewGroup>
                {/* </Row> */}
                {/* <Row>
                  <Image.PreviewGroup
                    items={productRes?.data.campPhotos.map((item) => {
                      return { src: item.img };
                    })}
                  >
                    <Image
                      width={400}
                      src={productRes.data.campPhotos[0].img}
                      fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                    />
                  </Image.PreviewGroup>
                </Row> */}
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title>{productRes.data.name}</Title>

                <Paragraph>{productRes.data.desc}</Paragraph>

                <Paragraph>
                  <Text strong underline>
                    <NavLink to="https://www.google.com/maps">
                      {productRes.data.fullAddress}
                    </NavLink>
                  </Text>
                </Paragraph>
              </Col>
            </Row>
            <Divider />
            <Divider orientation="left">
              <Title level={2}>營區選擇</Title>
            </Divider>
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              {productRes?.data.campsite.map((campsite) => {
                return (
                  <Col
                    key={campsite.areaName}
                    xs={24}
                    sm={12}
                    md={12}
                    lg={8}
                    xl={6}
                  >
                    <div key={campsite.areaName}>
                      <img
                        src={campsite.campsitePhotos[0].img}
                        alt="營區圖片"
                        className="card-img-top rounded-0 object-cover"
                        height={300}
                      />
                      <h2 className="mb-0 mt-2">{campsite.areaName}</h2>
                      <p className="price-font">
                        平日價格: ${campsite.weekdayPrice}
                      </p>
                      <p className="price-font">
                        假日價格: ${campsite.holidayPrice}
                      </p>
                      <Tag color="magenta">
                        surfaceType: {campsite.surfaceType}
                      </Tag>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Typography>
        </Content>
        <Footer style={footerStyle}>
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CampDetail;
