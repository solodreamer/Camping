import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import axios from "axios";

import { Layout, Menu, theme, Col, Row, Divider, Typography,} from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined,} from "@ant-design/icons";
import { QueryFilter, ProFormSelect, ProFormText, ProFormDateRangePicker} from '@ant-design/pro-components';

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

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

//地區選單
const locations = [
  { value: 1, label: "北部" },
  { value: 2, label: "中部" },
  { value: 3, label: "南部" },
  { value: 4, label: "東部" },
  { value: 5, label: "離島" },
];


function HomePage() {

  const navigate = useNavigate();
  /** 營地清單設定 */
  const [camps, setCamps] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  /** 初始化取得營地清單 */
  useEffect(() => {
    getCampList();
  }, []);

  /** 取得營地清單 */
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


  /** 特定條件查詢營區 */
  const onSearch = async (values) => {
    await waitTime(1000);
    const queryString = new URLSearchParams(values).toString();
    console.log("homepage準備要傳的資料",queryString);
    navigate(`/searchPage?${queryString}`);
  };

  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
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
             <QueryFilter defaultCollapsed submitter onFinish={onSearch}>
                <ProFormSelect name="region" label="選擇地區" options={locations}  placeholder="請選擇地區" defaultValue={2}/>
                <ProFormDateRangePicker name="dateRange" label="日期" initialValue={[dayjs(), dayjs()]}/>
                <ProFormText name="name" label="關鍵字" placeholder="搜索..." defaultValue="123"/>
             </QueryFilter>
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
                          alt="營區圖片"
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
