import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import dayjs from "dayjs";
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
  Spin,
  Button,
  Calendar,
  Select,
  List,
  InputNumber,
  Card,
  Form,
  Input,
  Steps,
} from "antd";

import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  EditFilled,
} from "@ant-design/icons";

import { QueryFilter, ProFormDateRangePicker } from '@ant-design/pro-components';

import "./checkout-confirm.css";
import { api, setAuthToken } from "../api";
import StepsConfirm from "../module/steps-confirm"

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
const { TextArea } = Input;
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


function CheckoutConfirm() {
  //選單項目
  const menuItems = [
    { key: "1", label: "會員登入", icon: <LoginOutlined />, path: "/login" },
    { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
    { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/" },
  ];
  // 定義狀態來儲存結帳步驟
  const [currentStep, setCurrentStep] = useState(0);

  const { id } = useParams();
  const [campPhotosIndex, setCampPhotosIndex] = useState(0);
  const [campsitePhotosIndex, setCampsitePhotosIndex] = useState({});
  const [availableCampsite, setAvailableCampsite] = useState([]);
  const [campsiteCountInfo, setCampsiteCountInfo] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  //定義狀態來儲存日期範圍
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1,'day')]);
  //定義狀態來儲存已選取的campsite
  const [selectedCampsites, setSelectedCampsites] = useState([]);
  //定義狀態儲存campsiteId清單是否載入中
  const [isLoading, setLoading] = useState(false);
  //定義狀態儲存總訂位數量
  const [count, setCount] = useState(0);
  //定義狀態儲存是否禁用預定button
  const [isbookDisable, setBookDisable] = useState(true);

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
          <StepsConfirm currentStep={currentStep}/>
          <Row className="contentRow" >
            <Col className="contentCol1" xs={24} sm={24} md={15} lg={15} xl={15}>
              <Form {...formItemLayout} name="confirmForm" layout="vertical" size="Large"> 
                <Form.Item label="訂購人姓名" name="name" rules={[
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
                  style={{ marginBottom: 40}}
                  > 
                  <Input /> 
                </Form.Item>
                <Form.Item label="手機號碼" name="phone" rules={[
                  {
                    required: true,
                    message: "請輸入手機號碼",
                  },
                  {
                    len: 10,
                    message: "請輸入10碼手機號碼",
                  }
                    ]}
                  style={{ marginBottom: 40}}
                  > 
                  <Input /> 
                </Form.Item>
                <Form.Item label="備註" name="remark"> <TextArea  showCount maxLength={255} /> </Form.Item>
              </Form>
            </Col>
            <Col className="contentCol2" xs={24} sm={24} md={9} lg={9} xl={9}>
              <Divider orientation="left" orientationMargin="0">
                <Title level={5}>明細確認</Title>
              </Divider>
              <div className="check-detail">目前清單沒有任何訂位唷！</div>
              <div className="check-total">
                <div className="checktt-list">
                  <p className='checktt-list checktt-total h4'>總計</p>
                  <p className='checktt-list checktt-total h4'>NT$0</p>
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

export default CheckoutConfirm;
