import { Link, NavLink } from "react-router-dom";

import { Layout, Menu, Col, Row, Divider, Typography, Image, Empty, } from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined, } from "@ant-design/icons";
import "./campDetail.css";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const blockContent = {
  data: {
    campPhotos: [
      {
        img: "https://fakeimg.pl/350x350/?text=Hello",
      },
      {
        img: "https://fakeimg.pl/350x350/?text=abs",
      },
    ],
    campsite: [
      {
        img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
        areaName: "A區",
        campId: 1,
        holidayPrice: 1500,
        surfaceType: 1,
        weekdayPrice: 800,
      },
      {
        img: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
        areaName: "B區",
        campId: 1,
        holidayPrice: 1200,
        surfaceType: 2,
        weekdayPrice: 700,
      },
      {
        img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
        areaName: "C區",
        campId: 1,
        holidayPrice: 1200,
        surfaceType: 2,
        weekdayPrice: 700,
      },
      {
        img: "https://fakeimg.pl/350x350/?text=abs",
        areaName: "D區",
        campId: 1,
        holidayPrice: 1200,
        surfaceType: 2,
        weekdayPrice: 700,
      },
      {
        img: "https://fakeimg.pl/350x350/?text=Hello",
        areaName: "E區",
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

function CampDetail() {
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
                  items={blockContent?.data.campPhotos.map((item) => {
                    return { src: item.img };
                  })}
                >
                  <Image
                    width={400}
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
                {blockContent?.data.campsite.map((campsite) => {
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
                          src={campsite.img}
                          alt="營區圖片"
                          className="card-img-top rounded-0 object-cover"
                          height={300}
                        />
                        <h2 className="mb-0 mt-2">{campsite.areaName}</h2>
                        <p className='price-font'>平日價格: ${campsite.weekdayPrice}</p>
                        <p className='price-font'>假日價格: ${campsite.holidayPrice}</p>
                        <p>surfaceType: {campsite.surfaceType}</p>
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
