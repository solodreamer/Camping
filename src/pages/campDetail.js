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
  Tag, Spin
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


function CampDetail() {
  //選單項目
  const menuItems = [
    { key: "1", label: "會員登入", icon: <LoginOutlined />, path: "/login" },
    { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
    { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/" },
  ];

  const [product, setProduct] = useState(null);
  const { id } = useParams();

  const getCampDetail = async (id) => {
    const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps/${id}`);
    if (productRes && productRes.data.success === true) {
      setProduct(productRes.data.data);
    }

  }

  useEffect(() => {
    getCampDetail(id);
    console.log("[id]", id);
  }, [id]);

  useEffect(() => {
    console.log("[營地資訊]", product);
  }, [product]);


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
          {product ? (
            <Typography>
              <Divider />
              <Row>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  {/* <Row> */}
                  {product.campPhotos?.length > 0 ? (
                    <Image.PreviewGroup
                      items={product.campPhotos.map((item) => {
                        return { src: item.img };
                      })}
                    >
                      <Image
                        width={400}
                        src={product.campPhotos[0].img}
                        fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                      />
                    </Image.PreviewGroup>
                  ) : (<p>無營地照片</p>)}
                  {/* </Row> */}
                  {/* <Row>
                            <Image.PreviewGroup
                              items={product.campPhotos.map((item) => {
                                return { src: item.img };
                              })}
                            >
                              <Image
                                width={400}
                                src={product.campPhotos[0].img}
                                fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                              />
                            </Image.PreviewGroup>
                          </Row> */}
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Title>{product.name}</Title>

                  <Paragraph>{product.desc}</Paragraph>

                  <Paragraph>
                    <Text strong underline>
                      <NavLink to="https://www.google.com/maps">
                        {product.fullAddress}
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
                {product.campsite?.length > 0 ? (
                  product.campsite.map((campsite) => {
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
                  })
                ) : (<p>無營地資料</p>)}

              </Row>
            </Typography>
          ) : (<Spin tip="Loading" size="large" />)}
        </Content>
        <Footer style={footerStyle}>
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CampDetail;
