import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Card,
  Typography,
  message,
  Divider,
  Form
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { api } from "../api";
import './register.css';

const { Title, Text } = Typography;

const Register = () => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  //email驗證狀態
  const [emailValidStatus, setEmailValidStatus] = useState("");
  //手機驗證狀態
  const [phoneValidStatus, setPhoneValidStatus] = useState("");
  //驗證碼倒數
  const [countdown, setCountdown] = useState(0);
  //手機號碼
  const [phone, setPhoneNo] = useState("");
  //錯誤訊息
  const [failEmail, setFailEmail] = useState(false);
  const [failPhone, setFailPhone] = useState(false);
  //email錯誤
  const [mailErrmessage, setMailErrmessage] = useState("");
  //手機錯誤
  const [phoneErrmessage, setPhoneErrmessage] = useState("");

  /**手機號碼改變事件 */
  const onPhoneChange = (e) => {
    const { value } = e.target;
    if (!value) {
      setPhoneValidStatus("error");
      setFailPhone(true);
    } else {
      setPhoneNo(value);
      setPhoneValidStatus("success");
      setFailPhone(false);
    }
  };

  /**
 * 電子郵件欄位改變事件
 */
  const onEmailChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setEmailValidStatus("error");
      setFailEmail(true);
    } else {
      setEmailValidStatus("success");
      setFailEmail(false);
    }
  };

  /** 表單提交 */
  const onFinish = async (values) => {
    console.log("註冊參數:", values);
    const inputValues = {
      ...values,
      'birthday': values['birthday'].format('YYYY-MM-DD')
    };
    setLoading(true);
    await saveRegister(inputValues);
  };

  /** 存檔api */
  const saveRegister = async (params) => {
    try {
      const res = await api.post(
        '/v1/auth/signup/using-phone',
        params
      );
      console.log("註冊存檔成功:", res);
      if (res.data.token) {
        window.location.href = "/build";
      } else {
        console.error("註冊存檔失敗:", res);
      }
    } catch (error) {
      console.log("[進入存檔catch error]");
      message.error('註冊失敗！');
      if (error.response.data.errors.email) {
        setFailEmail(true);
        setMailErrmessage(error.response.data.errors.email);
      } if (error.response.data.errors.phone) {
        setFailPhone(true);
        setPhoneErrmessage(error.response.data.errors.phone);
      }
      console.error("註冊存檔失敗:", error.response.data.errors);
    }
    setLoading(false);
  };

  const validateId = (rule, value) => {
    if (failEmail) {
      setEmailValidStatus("error");
      return Promise.reject(new Error(mailErrmessage));
    }
    return Promise.resolve();
  };

  const validateId2 = (rule, value) => {
    if (failPhone) {
      setPhoneValidStatus("error");
      return Promise.reject(new Error(phoneErrmessage));
    }
    return Promise.resolve();
  };

  /** 取得手機驗證碼api */
  const getVerifyCode = async () => {
    try {
      const res = await api.post(
        '/v1/auth/signup/send-verify-code',
        { phone: phone }
      );
      console.log("getVerifyCodeApi:", res);
      if (res.data.success === true) {
        setCountdown(60);
      }
    } catch (err) {
      console.log("getVerifyCodeApiErr:", err);
    }
  };

  const isVerifyCodeDisabled = () => {
    if (countdown > 0) {
      return true;
    } else if (!phone || phone.length < 10 || phone.length > 10) {
      return true;
    }

    return false;
  };

  /**驗證碼重置倒數計時器 */
  useEffect(() => {
    if (countdown <= 0) return;
    const timerId = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [countdown]);

  useEffect(() => {
    form.validateFields(["email"]);
    console.log("[failEmail-status]", failEmail);
  }, [failEmail]);

  useEffect(() => {
    form.validateFields(["phone"]);
    console.log("[failPhone-status]", failPhone);
  }, [failPhone]);

  return (
    <div className="registration-container">
      <Card className="registration-card">
        <div className="form-header">
          <Title level={2}>會員註冊</Title>
          <Text className="form-subtitle">請填寫以下資料完成註冊</Text>
        </div>

        <div>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
            layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="姓名"
                className="input-group"
                labelCol={{ span: 24 }}
                rules={[
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
                ]}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="請輸入姓名"
                />
              </Form.Item>

              <Form.Item
                name="sex"
                label="性別"
                className="input-group"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "請選擇性別",
                  },
                ]}>
                <Select
                  placeholder="請選擇性別"
                  style={{ width: '100%' }}
                >
                  {[{ value: 'm', label: '男' },
                  { value: 'f', label: '女' },
                  { value: 'o', label: '其他' }].map(
                    opt => (<Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="birthday"
              label="出生年月日"
              className="input-group"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "請選擇生日" }]}>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="請選擇日期"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-2">
                <Form.Item
                  name="phone"
                  label="手機號碼"
                  className="input-group"
                  labelCol={{ span: 24 }}
                  validateStatus={phoneValidStatus}
                  help={failPhone ? phoneErrmessage : undefined}
                  rules={[
                    {
                      required: true,
                      message: "請輸入手機號碼",
                    },
                    {
                      len: 10,
                      message: "請輸入10碼手機號碼",
                    },
                    {
                      validator: validateId2
                    },
                  ]}>
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="請輸入手機號碼"
                    maxLength={10}
                    onChange={onPhoneChange}
                    value={phone}
                  />
                </Form.Item>
              </div>

              <div className="col-span-3 md:col-span-1">
                <Form.Item
                  name="verify_code"
                  label="驗證碼"
                  className="input-group"
                  labelCol={{ span: 24 }}
                  rules={[{ required: true, message: "請輸入驗證碼" }]}>
                  <div className="flex verification-input-group">
                    <Input
                      placeholder="請輸入驗證碼"
                      className="flex-1"
                    />
                    <Button
                      type="primary"
                      className="verification-button"
                      onClick={getVerifyCode}
                      disabled={isVerifyCodeDisabled()}
                    >
                      {countdown > 0 ? `${countdown}秒後重新獲取` : "取得驗證碼"}
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="email"
              label="電子郵件"
              className="input-group"
              labelCol={{ span: 24 }}
              validateStatus={emailValidStatus}
              help={failEmail ? mailErrmessage : undefined}
              rules={[
                {
                  required: true,
                  message: "請輸入電子郵件",
                },
                {
                  type: "email",
                  message: "這不是有效的電子郵件",
                },
                {
                  validator: validateId,
                },
              ]}>
              <Input
                prefix={<MailOutlined />}
                placeholder="name@example.com"
                onChange={onEmailChange}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密碼"
              className="input-group"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "請輸入密碼",
                },
                {
                  min: 6,
                  message: "密碼至少6個字以上",
                },
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="建議混合6個字以上的英文字母、數字和符號"
              />
            </Form.Item>

            <Form.Item
              name="password_confirm"
              label="確認密碼"
              className="input-group"
              labelCol={{ span: 24 }}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "請再次輸入密碼",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("密碼不相符!"));
                  },
                }),
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="請再次輸入密碼"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              className="input-group"
              labelCol={{ span: 24 }}
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("如已閱讀，請點選同意")),
                },
              ]}>
              <div className="agreement-option">
                <Checkbox
                >
                  我已詳細閱讀並同意 <a href="#privacyPolicy">隱私政策</a> 及 <a href="#termService">服務條款</a>
                </Checkbox>
              </div>
            </Form.Item>

            <div className="submit-button">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block
                loading={loading}
              >
                立即註冊
              </Button>
            </div>

            <Divider plain>
              <Text className="divider-text">已有帳號？</Text>
            </Divider>

            <div className="login-link-container">
              <a href="#loginPage">登入現有帳號</a>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Register;