import React, { useState, useEffect, useContext } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Card, 
  Typography, 
  Row, 
  Col, 
  message,
  Menu
} from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  SaveOutlined, 
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import AuthContext from "../AuthContext";
import './userProfile.css';
import { api, } from "../api";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  // 選單項目
  const menuItems = 
  [
    { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
    { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
    { key: "3", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
  ];
  


  // 處理表單提交
  const handleSubmit = (values) => {
    setLoading(true);
    
    // 處理日期格式
    const formattedValues = {
      ...values,
      birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
      avatar: imageUrl
    };
    
    console.log('提交的資料:', formattedValues);
    
    // 模擬API請求
    setTimeout(() => {
      message.success('個人資料已更新成功！');
      setLoading(false);
    }, 1500);
  };

  // 取得會員資料
  const getUserProfile = async () => {
    try {
      const res = await api.get('/v1/auth/user/full-info');
      if (res.data.success === true) {
        form.setFieldsValue({
          ...res.data.data,
          birthday: dayjs(res.data.data.birthday),
      });
      }
    }
    catch (error) {

    }
  }

  /** 初始化取得會員資料 */
  useEffect(() => {
    getUserProfile();
  }, [form]);

  return (
    <Layout className="layout-container">
      <Sider className="profile-siderStyle" breakpoint="md" collapsedWidth="0">
        <div className="logo">Go露營</div>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={['2']}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="profile-headerStyle">
          <Title level={3} style={{ color: '#fff', margin: 16 }}>會員個人資料</Title>
        </Header>
        <Content className="profile-contentStyle">
          <Card className="profile-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                  className="profile-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '請輸入您的姓名' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="請輸入姓名" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="sex"
                        label="性別"
                        rules={[{ required: true, message: '請選擇您的性別' }]}
                      >
                        <Select placeholder="請選擇性別">
                          <Option value="m">男</Option>
                          <Option value="f">女</Option>
                          <Option value="o">其他</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="birthday"
                        label="出生年月日"
                        rules={[{ required: true, message: '請選擇出生日期' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }} 
                          placeholder="請選擇日期"
                          format="YYYY-MM-DD"
                          prefix={<CalendarOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="手機號碼"
                        rules={[
                          { required: true, message: '請輸入手機號碼' },
                          { pattern: /^[0-9]{10}$/, message: '請輸入10位數字的手機號碼' }
                        ]}
                      >
                        <Input 
                          prefix={<PhoneOutlined />} 
                          placeholder="請輸入手機號碼" 
                          maxLength={10}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="email"
                    label="電子郵件"
                    rules={[
                      { required: true, message: '請輸入您的電子郵件' },
                      { type: 'email', message: '請輸入有效的電子郵件格式' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="請輸入電子郵件" />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    label="舊密碼"
                    extra="如不修改密碼，請留空此欄位"
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="請輸入舊密碼" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="新密碼"
                    extra="如不修改密碼，請留空此欄位"
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="請輸入新密碼" />
                  </Form.Item>
                              
                  <Form.Item style={{ marginTop: '24px' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      size="large"
                      className="save-button"
                    >
                      確認儲存
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Content>
        <Footer className="profile-footerStyle">
          © {new Date().getFullYear()} Go露營. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserProfile;