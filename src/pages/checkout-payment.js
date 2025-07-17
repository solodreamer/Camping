import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Col,
  Row,
  Divider,
  Typography,
  Button,
  Select,
  Form,
  Input,
} from "antd";

import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import "./checkout-confirm.css";
import StepsConfirm from "../module/steps-confirm"
import CheckDetail from "../module/checkDetail";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};


function CheckoutPayment() {
  //選單項目
  const menuItems = [
    { key: "1", label: "會員登入", icon: <LoginOutlined />, path: "/loginPage" },
    { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
    { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/" },
  ];
 
  const location = useLocation();
  const { bookingResult } = location.state || {};
  const { detail1 } = location.state || {};

  useEffect(() => {
    console.log("[bookingResult]", bookingResult);
  }, [bookingResult])

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
        <Header className="checkoutConfirm-headerStyle">Go露營</Header>
        <Content className="checkoutConfirm-contentStyle">
          <StepsConfirm currentStep={1} />
          <Row className="contentRow" >
            <Col className="contentCol1" xs={24} sm={24} md={15} lg={15} xl={15}>
              <Form {...formItemLayout} name="paymentForm" layout="vertical" size="Large"
                  initialValues={{ cardHolderName: detail1?.name }}>
                <Form.Item label="持卡人姓名" name="cardHolderName" rules={[
                  {
                    required: true,
                    min: 2,
                    message: "請輸入最少兩個字",
                    whitespace: true,
                  },
                  {
                    max: 20,
                    message: "已達最大字數!",
                  },
                ]}
                  style={{ marginBottom: 40 }}
                >
                  <Input placeholder="請輸入持卡人姓名" />
                </Form.Item>
                <Form.Item label="卡號" name="cardNumber" rules={[
                  {
                    required: true,
                    message: "請輸入卡號",
                  },
                  {
                    len: 16,
                    message: "卡號必須為 16 位數字",
                  }
                ]}
                  style={{ marginBottom: 40 }}
                >
                  <Input placeholder="請輸入卡號" maxLength={16} />
                </Form.Item>
                <Form.Item label="背面末三碼" name="cvv" rules={[
                  {
                    required: true,
                    message: "請輸入背面末三碼",
                  },
                  {
                    len: 3,
                    message: "背面末三碼必須為 3 位數字",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "背面末三碼只能包含數字",
                  },
                ]}
                  style={{ marginBottom: 40 }}>
                  <Input placeholder="請輸入背面末三碼" maxLength={3} />
                </Form.Item>
                <Form.Item label="有效期限" required style={{ marginBottom: 40 }}>
                  <Input.Group compact>
                    <Form.Item
                      name="expiryMonth"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "請選擇月份",
                        },
                      ]}
                    >
                      <Select placeholder="月" style={{ width: "50%" }}>
                        {Array.from({ length: 12 }, (_, i) => (
                          <Select.Option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {String(i + 1).padStart(2, "0")}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="expiryYear"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "請選擇年份",
                        },
                      ]}
                    >
                      <Select placeholder="年" style={{ width: "50%" }}>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          const yearShort = String(year).slice(-2); // 取西元年的後兩碼
                          return (
                            <Select.Option key={year} value={String(yearShort)}>
                              {yearShort}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Form.Item wrapperCol={{span: 15, offset: 7}}>
                  <Button type="primary" htmlType="submit" size="large">
                    確認付款
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col className="contentCol2" xs={24} sm={24} md={9} lg={9} xl={9}>
              <Divider orientation="left" orientationMargin="0">
                <Title level={5}>明細確認</Title>
              </Divider>
              <CheckDetail result={bookingResult} />
              <div className="check-total">
                <div className="checktt-list">
                  <p className='checktt-list checktt-total h4'>總計</p>
                  <p className='checktt-list checktt-total h4'>TWD${bookingResult.sumAmount}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Content>
        <Footer className="checkoutConfirm-footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CheckoutPayment;
