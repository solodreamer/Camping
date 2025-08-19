import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Layout,
  Col,
  Row,
  Divider,
  Typography,
  Button,
  Form,
  Input,
} from "antd";

import { api, setAuthToken } from "../api";
import StepsConfirm from "../module/steps-confirm"
import CheckDetail from "../module/checkDetail";
import MainLayout from "../module/mainLayout";
import AuthContext from "../AuthContext";
import "./checkout-confirm.css";

//Antd元件屬性設定
const { Content } = Layout;
const { Title } = Typography;
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

  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  // 定義狀態來儲存結帳步驟
  const currentStep = 0; // 若 StepsConfirm 需要 currentStep 傳入
  const location = useLocation();
  const { bookingResult } = location.state || {};
  // 頁面導航hook

  const onCheckPayment = async (values) => {
    const token = localStorage.getItem('accessToken');
    console.log("[accessToken]", token);
    if (!token) {
      console.log("未取得token，請重新登入");
      return;
    }
    const confirmParams =
    {
      preview_uuid: bookingResult.preview_uuid,
    }
    console.log("[onCheckPayment]", confirmParams);
    const result = await booking_camp_confirm(confirmParams, token);
    console.log("[預定API回傳]", result);
    // navigate('/checkout-payment', { state: {bookingResult:bookingResult, detail1: values}});
  }

  /**
 * 呼叫confirm-api
 * @param {*} param 
 */
  const booking_camp_confirm = async (params, token) => {

    try {
      if (token) {
        setAuthToken(token);
      } else {
        return false;
      };
      const res = await api.post('/v1/booking_camp/confirm', params);
      if (res.data.success === true) {
        console.log("訂位成功", res.data.success);
        return res.data.success;
      } else {
        console.log("訂位失敗", res.data.success);
        return false;
      }
    } catch (error) {
      console.error('Error booking camp failed:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log("[bookingResult]", bookingResult);
  }, [bookingResult])

  return (
    <MainLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout} headerTitle="Go露營" >
      <Content className="checkoutConfirm-contentStyle">
        <StepsConfirm currentStep={currentStep} />
        <Row className="contentRow" >
          <Col xs={24} sm={24} md={15} lg={15} xl={15}>
            <Form {...formItemLayout} name="confirmForm" layout="vertical" size="Large" onFinish={onCheckPayment}
              initialValues={{ name: bookingResult?.userInfo?.name || "", phone: bookingResult?.userInfo?.phone || "" }}>
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
                style={{ marginBottom: 40 }}
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
                style={{ marginBottom: 40 }}
              >
                <Input />
              </Form.Item>
              <Form.Item label="備註" name="remark"> <TextArea showCount maxLength={255} /> </Form.Item>
              <Form.Item wrapperCol={{ span: 15, offset: 7 }}>
                <Button type="primary" htmlType="submit" size="large">下一步</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={9} lg={9} xl={9}>
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
    </MainLayout>
  );
}

export default CheckoutConfirm;
