import React, { useState, useContext } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  message,
  Layout
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

const { Title } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 取得登入狀態、登入函式
  const { handleLogin } = useContext(AuthContext);


  // 表單提交處理
  const handleSubmit = (values) => {
    setLoading(true);

    // 模擬API請求延遲
    setTimeout(() => {
      console.log('登入資訊:', values);
      setLoading(false);
      login(values);
      // 這裡可以添加實際的登入邏輯和跳轉
    }, 1000);
  };


  // 手機號碼驗證
  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject('請輸入手機號碼');
    }
    if (!/^[0-9]{10}$/.test(value)) {
      return Promise.reject('請輸入10位數字的手機號碼');
    }
    return Promise.resolve();
  };

  /**
   * 登入事件
   */
  const login = async (values) => {
    try {
      console.log('[登入param]', values);
      const res = await api.post('/v1/auth/login/using-password', values);
      console.log('[登入res]', res);
      const { token } = res.data;
      localStorage.setItem('accessToken', token);
      message.success('登入成功！');
      setAuthToken(token);
      handleLogin();
      if (token) {
        navigate('/');
      }
    } catch (err) {
      console.log('[登入Error]', err);
      message.error('登入失敗，請確認手機號碼和密碼是否正確');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={18} md={12} lg={8} xl={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px'
              }}
            >
              {/* 標題區域 */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={2} style={{ color: '#0f3675', marginBottom: '8px' }}>
                  歡迎使用Go露營
                </Title>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  請登入您的帳號以繼續
                </div>
              </div>

              {/* 登入表單 */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                requiredMark={false}
              >
                {/* 手機號碼輸入框 */}
                <Form.Item
                  name="login_id"
                  rules={[{ validator: validatePhoneNumber }]}
                >
                  <Input
                    size="large"
                    placeholder="請輸入手機號碼"
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    maxLength={10}
                  />
                </Form.Item>

                {/* 密碼輸入框 */}
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '請輸入密碼' }]}
                >
                  <Input.Password
                    size="large"
                    placeholder="請輸入密碼"
                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Form.Item>

                {/* 登入按鈕 */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    icon={<LoginOutlined />}
                    loading={loading}
                    style={{ background: '#0f3675', borderColor: '#0f3675' }}
                  >
                    登入
                  </Button>
                </Form.Item>
              </Form>

              {/* 其他按鈕 */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Space size="middle">
                  <Button
                    type="link"
                    icon={<HomeOutlined />}
                    style={{ color: '#0f3675' }}
                    onClick={() => navigate('/')}
                  >
                    首頁
                  </Button>
                  <Button
                    type="link" 
                    icon={<UserAddOutlined />}
                    style={{ color: '#0f3675' }}
                    onClick={() => navigate('/register')}
                  >
                    註冊
                  </Button>
                </Space>
              </div>

              {/* 版權信息 */}
              <div style={{ textAlign: 'center', marginTop: '24px', color: '#999', fontSize: '12px' }}>
                Copyright ©{new Date().getFullYear()} Created by Go露營
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginPage;