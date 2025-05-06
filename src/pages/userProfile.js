import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Card, 
  Avatar, 
  Typography, 
  Row, 
  Col, 
  Upload, 
  message,
  Divider,
  Space,
  Menu
} from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  SaveOutlined, 
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import './userProfile.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // 模擬從API獲取用戶資料
  useEffect(() => {
    // 模擬API請求延遲
    const timer = setTimeout(() => {
      // 模擬的用戶數據
      const userData = {
        name: '王小明',
        gender: 'male',
        birthDate: '1990-01-01',
        phoneNumber: '0912345678',
        email: 'wang@example.com',
        bankCode: '012',
        bankAccount: '12345678901234',
      };
      form.setFieldsValue({
        ...userData,
        birthDate: dayjs(userData.birthDate),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [form]);

  // 處理表單提交
  const handleSubmit = (values) => {
    setLoading(true);
    
    // 處理日期格式
    const formattedValues = {
      ...values,
      birthDate: dayjs(values.birthDate).format('YYYY-MM-DD'),
      avatar: imageUrl
    };
    
    console.log('提交的資料:', formattedValues);
    
    // 模擬API請求
    setTimeout(() => {
      message.success('個人資料已更新成功！');
      setLoading(false);
    }, 1500);
  };

  // 處理頭像上傳
  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // 獲取上傳的圖像URL（這裡模擬，實際應使用從服務器返回的URL）
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
      });
    }
  };

  // 轉換圖像為Base64
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // 上傳前驗證
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('您只能上傳JPG/PNG格式的圖片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('圖片大小不能超過2MB！');
    }
    return isJpgOrPng && isLt2M;
  };

  // 選單項目
  const menuItems = [
    { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
    { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/profile" },
    { key: "3", label: "登出", icon: <LoginOutlined />, path: "/logout" },
  ];

  return (
    <Layout className="layout-container">
      <Sider className="profile-siderStyle" breakpoint="md" collapsedWidth="0">
        <div className="logo">Go露營</div>
        <Menu 
          mode="inline" 
          theme="light"
          defaultSelectedKeys={['2']}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="profile-headerStyle">
          <Title level={3} style={{ color: '#fff', margin: 0 }}>會員個人資料</Title>
        </Header>
        <Content className="profile-contentStyle">
          <Card className="profile-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                <div className="avatar-section">
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />} 
                    src={imageUrl}
                    className="user-avatar"
                  />
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替換為實際上傳API
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                  >
                    <Button icon={<UploadOutlined />} type="primary">
                      上傳大頭照
                    </Button>
                  </Upload>
                  <Text type="secondary" style={{marginTop: '8px'}}>
                    支援JPG、PNG格式，檔案小於2MB
                  </Text>
                </div>
              </Col>
              
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
                        name="gender"
                        label="性別"
                        rules={[{ required: true, message: '請選擇您的性別' }]}
                      >
                        <Select placeholder="請選擇性別">
                          <Option value="male">男</Option>
                          <Option value="female">女</Option>
                          <Option value="other">其他</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="birthDate"
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
                        name="phoneNumber"
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
                    label="密碼"
                    extra="如不修改密碼，請留空此欄位"
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="請輸入新密碼" />
                  </Form.Item>
                  
                  <Divider orientation="left">退款帳戶資訊</Divider>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="bankCode"
                        label="銀行代碼"
                        rules={[{ required: true, message: '請輸入銀行代碼' }]}
                      >
                        <Input prefix={<BankOutlined />} placeholder="請輸入銀行代碼" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={16}>
                      <Form.Item
                        name="bankAccount"
                        label="銀行帳號"
                        rules={[{ required: true, message: '請輸入銀行帳號' }]}
                      >
                        <Input prefix={<CreditCardOutlined />} placeholder="請輸入銀行帳號" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
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