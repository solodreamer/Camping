import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Col, Row, Divider, Typography, Card } from "antd";
import { QueryFilter, ProFormSelect, ProFormText, ProFormDateRangePicker } from '@ant-design/pro-components';
import dayjs from "dayjs";

import { api } from "../api";
import AuthContext from "../AuthContext";
import MainLayout from "../module/mainLayout";
import "./homePage.css";

//Antd元件屬性設定
const { Content } = Layout;
const { Title } = Typography;

function HomePage() {

  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  //地區選單
  const locations = [
    { value: 1, label: "北部" },
    { value: 2, label: "中部" },
    { value: 3, label: "南部" },
    { value: 4, label: "東部" },
    { value: 5, label: "離島" },
  ];

  /** 頁面導航hook */
  const navigate = useNavigate();
  /** 營地清單設定 */
  const [camps, setCamps] = useState([]);

  /** 取得營地清單 */
  const getCampList = async () => {
    try {
      const res = await api.get('/v1/camps');
      if (res.data.success === true) {
        setCamps(res.data.data);
      }
    } catch (err) {
      console.log("getCampList取得異常:", err);
    }
  };

  /** 特定條件查詢營區 */
  const onSearch = async (values) => {
    await waitTime(1000);
    const queryString = new URLSearchParams(values).toString();
    console.log("homepage準備要傳的資料", queryString);
    navigate(`/searchPage?${queryString}`);
  };

  /** 等待時間 */
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

  /** 初始化取得營地清單 */
  useEffect(() => {
    getCampList();
  }, []);

  /** 營區清單log */
  useEffect(() => {
    console.log("getCampList 更新了", camps);
  }, [camps]);

  return (
    <MainLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout} headerTitle="Go露營">
      <Content className="home-contentStyle">
        <div>
          <QueryFilter defaultCollapsed submitter onFinish={onSearch}>
            <ProFormSelect name="region" label="選擇地區" options={locations} placeholder="請選擇地區" />
            <ProFormDateRangePicker name="dateRange" label="日期" initialValue={[dayjs(), dayjs()]} fieldProps={{ disabledDate, inputReadOnly: true }} />
            <ProFormText name="name" label="關鍵字" placeholder="搜索..." />
          </QueryFilter>
        </div>
        <Card className="camps-container">
          <Divider orientation="left" orientationMargin="0">
            <Title level={2}>熱門營地</Title>
          </Divider>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
            {camps?.map((camp) => {
              return (
                <Col key={camp.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={camp.coverImage}
                        alt="營區圖片"
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    className="camp-card"
                  >
                    <Card.Meta title={camp.name} />
                    <Link
                      to={`/campDetail/${camp.id}`}
                      className="detail-button"
                    >
                      詳細資訊
                    </Link>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      </Content>
    </MainLayout>
  );
}

export default HomePage;
