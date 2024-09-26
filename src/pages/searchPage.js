import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import dayjs from "dayjs";
import axios from "axios";

import { Layout, Menu, List, Card, Typography } from "antd";
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
} from "@ant-design/pro-components";

import "./searchPage.css";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

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
    console.log("[search初始化查詢條件-地區]", Number(values.get("region")));
    console.log("[search初始化查詢條件-日期]", values.get("dateRange"));
    console.log("[search初始化查詢條件-關鍵字]", values.get("name"));

    if (values.get("region")) {
      setRegion(Number(values.get("region")));
    }
    const dateRange = values.get("dateRange");
    if (dateRange) {
      const [start, end] = dateRange.split(",");
      setStartDate(dayjs(start));
      setEndDate(dayjs(end));
    }
    if (values.get("name")) {
      setName(values.get("name"));
    }
  };

  /** 初始化依條件查詢營地 */
  useEffect(() => {
    if (region && name) {
      searchCampList({ region, name });
    }
  }, [region, name]);

  /** 依條件查詢營地 */
  const searchCampList = async (param) => {
    try {
      setCamps([]);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/camps?region=${param.region}&name=${param.name}`
      );
      // const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps?`, {params: { region,name }});
      if (res.data.success === true && res.data.data) {
        setCamps(res.data.data);
      } else {
        setCamps([]);
      }
    } catch (err) {
      console.log("[營區清單取得異常]:", err);
    }
  };

  /** 營區清單hooks */
  useEffect(() => {
    console.log("[營區清單變化]", camps);
  }, [camps]);

  /** 地區 hooks */
  useEffect(() => {
    console.log("[地區變化]", region);
  }, [region]);

  /** 關鍵字 hooks */
  useEffect(() => {
    console.log("[關鍵字變化]", name);
  }, [name]);

  /** startDate hooks */
  useEffect(() => {
    console.log("[開始日期變化]", startDate);
  }, [startDate]);

  /** endDate hooks */
  useEffect(() => {
    console.log("[結束日期變化]", endDate);
  }, [endDate]);

  /** 特定條件查詢營區 */
  const onSearch = async (values) => {
    await waitTime(1000);
    searchCampList({ region, name });
    console.log("[查詢條件]", region, startDate, endDate, name);
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
  };

  return (
    <Layout>
      <Sider className="siderStyle" breakpoint="md" collapsedWidth="0">
        <Menu mode="inline" theme="dark">
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="headerStyle">Go露營</Header>
        <Content className="contentStyle">
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
                fieldProps={{ disabledDate, inputReadOnly: true }}
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
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 3 }}
            dataSource={camps}
            locale={{ emptyText: "查無資料" }}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <Link to={`/campDetail/${item.id}`}>
                      <img alt="營區圖片" src={item.coverImage} className="imgStyle"/>
                    </Link>
                  }
                >
                  <Meta title={item.name} description={item.desc} />
                </Card>
              </List.Item>
            )}
          />
        </Content>
        <Footer className="footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default SearchPage;
