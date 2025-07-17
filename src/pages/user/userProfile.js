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
  LoginOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import AuthContext from "../../AuthContext";
import './userProfile.css';
import { api, } from "../../api";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  // 選單項目
  const menuItems =
    [
      { key: "1", label: "首頁", icon: <HomeOutlined />, path: "/" },
      { key: "2", label: "個人資料", icon: <UserOutlined />, path: "/userProfile" },
      { key: "3", label: "訂單查詢", icon: <FileSearchOutlined />, path: "/userOrderDetail" },
      { key: "4", label: "登出", icon: <LoginOutlined />, onClick: handleLogout },
    ];



  // 處理表單提交
  const handleSubmit = async (values) => {
    setLoading(true);

    // 組裝基本資料參數
    const profileParams = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      sex: values.sex,
      birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
    };

    // 組裝密碼資料參數
    const hasPasswordFields =
      values.old_password || values.password || values.password_confirm;

    // 組裝密碼資料參數
    const passwordParams = {
      old_password: values.old_password,
      password: values.password,
      password_confirm: values.password_confirm,
    };

    console.log('提交的資料:', profileParams, passwordParams);

    try {
      let results;
      if (hasPasswordFields) {
        results = await Promise.allSettled([
          api.put('/v1/auth/user/profile', profileParams),
          api.put('/v1/auth/user/password', passwordParams),
        ]);
      } else {
        results = await Promise.allSettled([
          api.put('/v1/auth/user/profile', profileParams),
        ]);
      }

      let hasError = false;

      // 處理個人資料 API 回傳
      const profileResult = results[0];
      if (profileResult.status === "fulfilled") {
        if (profileResult.value.data.success === false) {
          hasError = true;
          message.error(profileResult.value.data.message || "個人資料更新失敗");
        }
      } else {
        hasError = true;
        message.error("個人資料 API 請求失敗");
      }

      // 處理密碼 API 回傳（僅有密碼欄位有填時才會有第二個結果）
      if (hasPasswordFields && results[1]) {
        const passwordResult = results[1];
        if (passwordResult.status === "fulfilled") {
          if (passwordResult.value.data.success === false) {
            hasError = true;
            message.error(passwordResult.value.data.message || "密碼更新失敗");
          }
        } else {
          hasError = true;
          message.error("密碼更新 API 請求失敗");
        }
      }

      if (!hasError) {
        message.success("個人資料" + (hasPasswordFields ? "與密碼" : "") + "已更新成功！");
      }
    } catch (error) {
      message.error('更新失敗，請檢查資料或稍後再試');
    } finally {
      setLoading(false);
    }
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
      console.error('取得會員資料失敗:', error);
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
          <Title level={3} style={{ color: '#fff', margin: 16 }}>個人資料</Title>
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
                    name="old_password"
                    label="舊密碼"
                    extra="如不修改密碼，請留空此欄位"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const password = getFieldValue('password');
                          const password_confirm = getFieldValue('password_confirm');
                          if (
                            (!value && (password || password_confirm)) ||
                            (value && (!password || !password_confirm))
                          ) {
                            return Promise.reject(new Error('請同時填寫舊密碼、新密碼與新密碼確認'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="請輸入舊密碼" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="新密碼"
                    extra="如不修改密碼，請留空此欄位"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const old_password = getFieldValue('old_password');
                          const password_confirm = getFieldValue('password_confirm');
                          if (
                            (!value && (old_password || password_confirm)) ||
                            (value && (!old_password || !password_confirm))
                          ) {
                            return Promise.reject(new Error('請同時填寫舊密碼、新密碼與新密碼確認'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="請輸入新密碼" />
                  </Form.Item>

                  <Form.Item
                    name="password_confirm"
                    label="新密碼確認"
                    extra="如不修改密碼，請留空此欄位"
                    dependencies={['password']}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const old_password = getFieldValue('old_password');
                          const password = getFieldValue('password');
                          if (
                            (!value && (old_password || password)) ||
                            (value && (!old_password || !password))
                          ) {
                            return Promise.reject(new Error('請同時填寫舊密碼、新密碼與新密碼確認'));
                          }
                          if (value && value !== password) {
                            return Promise.reject(new Error('密碼不相符!'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="新密碼確認" />
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