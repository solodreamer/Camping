"use client"
import React, { useState, useContext, useEffect } from "react";
import { Card, Typography, Space, Row, Col, Modal } from "antd"
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  PhoneOutlined,
  FileSearchOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { api, } from "../../api";
import AuthContext from "../../AuthContext";
import './userOrderDetail.css';

const { Title, Text } = Typography

// 定義顏色常量，避免使用 @ant-design/colors
const COLORS = {
  primary: "#1890ff",
  headerBg: "#1c4ba0",
  warning: "#faad14",
  success: "#52c41a",
  siderBg: "#f0f2f5",
  borderColor: "#d9d9d9",
}

const UserOrderDetail = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const [orderDetail, setOrderDetail] = useState(null);

  // 讓父元件可以呼叫 showOrderDetail
  React.useImperativeHandle(ref, () => ({
    showOrderDetail: (orderNo) => {
      getOrderDetail(orderNo);
      setVisible(true);
    },
    close: () => setVisible(false)
  }));

  // 取得訂單詳情
  const getOrderDetail = async (orderNo) => {
    // const orderNo = 20250710122348
    try {
      const res = await api.get(`/v1/orders/${orderNo}`);
      if (res.data.success === true) {
        setOrderDetail(res.data.data);
      }
    }
    catch (error) {
      console.error('取得訂單詳情失敗:', error);
    }
  }

  /**
   * 初始化取得訂單詳情
   */
  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <Modal
      title={
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>
          明細
        </div>
      }
      open={visible}
      onCancel={() => setVisible(false)}
      // footer={[
      //   <button key="close" onClick={() => setVisible(false)}>
      //     關閉
      //   </button>,
      // ]}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      {orderDetail ? (
        <>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {/* 訂單標題 */}
            <Title level={4} style={{ marginBottom: "16px" }}>
              訂單編號 {orderDetail.order.order_no}
            </Title>

            {/* 警告訊息 */}
            {/* <Space direction="vertical" style={{ width: "100%", marginBottom: "24px" }}>
              {mockOrderData.warnings.map((warning, index) => (
                <Alert key={index} message={warning} type="warning" showIcon style={{ borderRadius: "6px" }} />
              ))}
            </Space> */}

            <Row gutter={24}>
              {/* 左側：套裝行程資訊 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <Text strong style={{ fontSize: "18px", color: COLORS.primary }}>
                        {orderDetail.order.camp_name}
                      </Text>
                    </Space>
                  }
                  style={{ marginBottom: "24px" }}
                >
                  <Space direction="vertical" style={{ width: "100%", marginBottom: "16px" }}>
                    <Space>
                      <HomeOutlined style={{ color: COLORS.primary }} />
                      <Text>地址：{orderDetail.order.camp_address}</Text>
                    </Space>
                    <Space>
                      <PhoneOutlined style={{ color: COLORS.primary }} />
                      <Text>電話：{orderDetail.order.camp_phone}</Text>
                    </Space>
                  </Space>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {orderDetail.reservations.map((reservation, index) => (
                      <div key={index}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                          <CheckCircleOutlined style={{ color: COLORS.primary }} />
                          <Text>營位：{reservation.area_name}</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleOutlined style={{ color: COLORS.primary }} />
                          <Text>營地：{reservation.campsite_name}</Text>
                        </div>
                      </div>
                    ))}
                  </Space>
                </Card>

                {/* 出發日期資訊 */}
                <Card title="行程日期" style={{ marginBottom: "24px" }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div style={{ textAlign: "center" }}>
                        <Text type="secondary">出發</Text>
                        <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.primary }}>
                          {orderDetail.order.start_date}
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ textAlign: "center" }}>
                        {/* <Text>{mockOrderData.travelDates.duration}</Text> */}
                        <div style={{ margin: "8px 0" }}>→</div>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ textAlign: "center" }}>
                        <Text type="secondary">結束</Text>
                        <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.primary }}>
                          {orderDetail.order.end_date}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <Text>載入中...</Text>
        </div>
      )}
    </Modal>
  );
});

export default UserOrderDetail;