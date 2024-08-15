import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import dayjs from "dayjs";
import axios from "axios";

import { Layout, Menu, Table, Space, Tag, List, Card } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  QueryFilter,
  ProFormSelect,
  ProFormText,
  ProFormDateRangePicker,
  ProList,
} from "@ant-design/pro-components";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;

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

function SearchPage() {
  const location = useLocation();
  /** 營地清單設定 */
  const [camps, setCamps] = useState([]);
  /** 查詢條件設定 */
  const [region, setRegion] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [name, setName] = useState([]);

  /** 初始化取得營地清單 */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    initSearchParams(params);
  }, [location.search]);

  /** 初始化查詢條件 */
  const initSearchParams = (values) => {
    setRegion(Number(values.get("region")));
    const dateRange = values.get("dateRange");
    if (dateRange) {
      const [start, end] =dateRange.split(",");
      setStartDate(dayjs(start));
      setEndDate(dayjs(end));
    }
    setName(values.get("name"));
  }

    /** 依條件查詢營地 */
    useEffect(() => {
      if (region && name) {
        searchCampList();
      }
    }, [region, name]);

  /** 依條件查詢營地 */
  const searchCampList = async () => {

    try {
      // const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps`);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps?region=${region}&name=${name}`);
      // const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps?`, {params: { region,name }});
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
    await waitTime(2000);
    console.log(values);
  };

  /** settimeout */
  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  /** 是否禁用日期 */
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  }
    

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
        <Header style={headerStyle}>Go露營
        </Header>
        <Content style={contentStyle}>
          <div>
            <QueryFilter defaultCollapsed submitter onFinish={onSearch}>
              <ProFormSelect
                name="region"
                label="選擇地區"
                options={locations}
                placeholder="請選擇地區"
                value={region}
              />
              <ProFormDateRangePicker
                name="dateRange"
                label="日期"
                value={[dayjs(startDate), dayjs(endDate)]}
                fieldProps={{disabledDate, inputReadOnly: true}}
              />
              <ProFormText
                name="name"
                label="關鍵字"
                placeholder="搜索..."
                value={name}
              />
            </QueryFilter>
          </div>
            <List
              grid={{gutter:16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4}}
              dataSource={camps}
              renderItem={(item) => (
                <List.Item>
                  <Card hoverable cover={<img alt="營區圖片" src= {item.coverImage}/> }>
                    <Meta title={<a href="https://ant.design">{item.name}</a>} description={item.desc} />
                  </Card>
                  </List.Item>
              )}
              />
        </Content>
        <Footer style={footerStyle}>
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default SearchPage;
