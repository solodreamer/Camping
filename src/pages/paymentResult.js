import React from 'react';
import { Result, Button, Typography, Space, Card, Divider } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, HomeFilled, RollbackOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const PaymentResult = ({ isSuccess = true, orderNumber = "12345678", amount = "$99.99" }) => {
  // 付款成功和失敗的配置
  const config = isSuccess 
    ? {
        icon: <CheckCircleFilled style={{ color: '#52c41a', fontSize: '72px' }} />,
        status: 'success',
        title: '付款成功',
        subTitle: '您的交易已完成',
        color: '#52c41a',
        buttonText: '返回首頁',
        buttonIcon: <HomeFilled />,
      } 
    : {
        icon: <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '72px' }} />,
        status: 'error',
        title: '付款失敗',
        subTitle: '處理您的交易時發生錯誤',
        color: '#ff4d4f',
        buttonText: '重試付款',
        buttonIcon: <RollbackOutlined />,
      };

      const eventClick = () => {
        if (config.buttonText === '返回首頁') {
            window.location.href = '/';
        }
      }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: '100%', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Result
          icon={config.icon}
          status={config.status}
          title={<Title level={2} style={{ color: config.color }}>{config.title}</Title>}
          subTitle={<Text type="secondary" style={{ fontSize: '16px' }}>{config.subTitle}</Text>}
          extra={
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card style={{ backgroundColor: '#f9f9f9' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">訂單編號</Text>
                    <Text strong>{orderNumber}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">交易金額</Text>
                    <Text strong>{amount}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">交易時間</Text>
                    <Text strong>{dayjs(new Date()).format('YYYY-MM-DD HH:mm')}</Text>
                  </div>
                </Space>
              </Card>
              
              {isSuccess ? (
                <Paragraph style={{ textAlign: 'center' }}>
                  感謝您的購買！您的訂單詳情已發送至您的郵箱。
                </Paragraph>
              ) : (
                <Paragraph style={{ textAlign: 'center' }}>
                  很抱歉，您的付款未能完成。請檢查您的支付信息並重試。
                </Paragraph>
              )}

              <Divider style={{ margin: '12px 0' }} />
              
              <Button type="primary" icon={config.buttonIcon} size="large" onClick={eventClick} block>
                {config.buttonText}
              </Button>
              
              {!isSuccess && (
                <Button type="link" block>
                  聯繫客服
                </Button>
              )}
            </Space>
          }
        />
      </Card>
    </div>
  );
};

export default PaymentResult;