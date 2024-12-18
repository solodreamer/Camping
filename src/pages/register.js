import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, Row, Select, DatePicker,} from "antd";

import { api, } from "../api";
import "./register.css";

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD'
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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register() {
  const [form] = Form.useForm();
  //驗證碼倒數
  const [countdown, setCountdown] = useState(0);
  //手機號碼
  const [phone, setPhoneNo] = useState("");
  //form驗證狀態
   //email驗證狀態
  const [emailValidStatus, setEmailValidStatus] = useState("");
   //手機驗證狀態
  const [phoneValidStatus, setPhoneValidStatus] = useState("");
  const [failEmail, setFailEmail] = useState(false);
  const [failPhone, setFailPhone] = useState(false);
  //錯誤訊息
   //email欄位錯誤訊息
  const [mailErrmessage, setMailErrmessage] = useState("");
   //手機欄位錯誤訊息
  const [phoneErrmessage, setPhoneErrmessage] = useState("");


  /**出生日期改變事件 */
  const dateTimeOnChange = (date, dateString) => {
    console.log("生日:", date, dateString);
  };

  const isVerifyCodeDisabled = () => {
    if (countdown > 0) {
      return true;
    } else if (!phone || phone.phone.length < 10 || phone.phone.length > 10) {
      return true;
    }

    return false;
  };

  /**驗證碼重置倒數計時器 */
  useEffect(() => {
    let timerId;
    if (countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(countdown - 1);
        console.log("countdown", countdown);
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [countdown]);

  /** 取得手機驗證碼api */
  const getVerifyCode = async () => {
    try {
      const res = await api.post(
        '/v1/auth/signup/send-verify-code',
        phone
      );
      console.log("getVerifyCodeApi:", res);
      if (res.data.success === true) {
        setCountdown(60);
      }
    } catch (err) {
      console.log("getVerifyCodeApiErr:", err);
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
  }

  /**手機號碼改變事件 */
  const onPhoneChange = (e) => {
    const { value } = e.target;
    if (!value) {
      setPhoneValidStatus("error");
      setFailPhone(true);
    } else {
      setPhoneNo({ phone: value });
      setPhoneValidStatus("success");
      setFailPhone(false);
    }
  };

  /** 存檔 */
  const onFinish = (values) => {
    const inputValues = {
      ...values,
      'birthday': values['birthday'].format('YYYY-MM-DD')
    };
    console.log("註冊存檔前param: ", inputValues);
    saveRegister(inputValues);
  };

  /** 呼叫存檔api */
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
      // console.log(restostring);
      // const { token } = res.data;
      // setRestostring(token);
    } catch (error) {
      console.log("[進入存檔catch error]");
      if (error.response.data.errors.email) {
        setFailEmail(true);
        setMailErrmessage(error.response.data.errors.email);
      } if (error.response.data.errors.phone) {
        setFailPhone(true);
        setPhoneErrmessage(error.response.data.errors.phone);
      }
      console.error("註冊存檔失敗:", error.response.data.errors);
    }
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

  useEffect(() => {
    form.validateFields(["email"]);
    console.log("[failEmail-status]", failEmail);
  }, [failEmail]);

  useEffect(() => {
    form.validateFields(["phone"]);
    console.log("[failPhone-status]", failPhone);
  }, [failPhone]);

  // useEffect(() => {
  //   console.log("[Email-status]", emailValidStatus);
  // }, [emailValidStatus]);

  return (
    <Row className="reg-container">
      <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
        <div className="item1">
          <img
            src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbXBmaXJlfGVufDB8fDB8fHww"
            sizes="(min-width: 1335px) 410.6666666666667px, (min-width: 992px) calc(calc(100vw - 88px) / 3), (min-width: 768px) calc(calc(100vw - 64px) / 2), 100vw"
            className="object-cover"
          ></img>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
        <div className="item2">
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
            <Form.Item
              hasFeedback
              name="name"
              label="姓名"
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
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="sex"
              label="性別"
              rules={[
                {
                  required: true,
                  message: "請選擇性別",
                },
              ]}
            >
              <Select placeholder="select your gender">
                <Option value="m">男性</Option>
                <Option value="f">女性</Option>
                <Option value="o">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item
              hasFeedback
              name="birthday"
              label="出生年月日"
              rules={[{ required: true, message: "請選擇生日" }]}
            >
              <DatePicker onChange={dateTimeOnChange} format={dateFormat}/>
            </Form.Item>
            <Form.Item
              hasFeedback
              name="phone"
              label="手機號碼"
              validateStatus={phoneValidStatus}
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
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                onChange={onPhoneChange}
                value={phone}
              />
            </Form.Item>
            <Form.Item hasFeedback label="驗證碼">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    hasFeedback
                    name="verify_code"
                    noStyle
                    rules={[{ required: true, message: "請輸入驗證碼" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={getVerifyCode}
                    disabled={isVerifyCodeDisabled()}
                  >
                    {countdown > 0 ? `${countdown}秒後重新獲取` : "取得驗證碼"}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              hasFeedback
              name="email"
              label="電子郵件"
              validateStatus={emailValidStatus}
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
              ]}
            >
              <Input placeholder="name@example.com" onChange={onEmailChange}/>
            </Form.Item>

            <Form.Item
              hasFeedback
              name="password"
              label="密碼"
              rules={[
                {
                  required: true,
                  message: "請輸入密碼",
                },
                {
                  min: 6,
                  message: "密碼至少6個字以上",
                },
              ]}
            >
              <Input.Password placeholder="建議混合6個字以上的英文字母、數字和符號" />
            </Form.Item>

            <Form.Item
              hasFeedback
              name="password_confirm"
              label="再次確認密碼"
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
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("如已閱讀，請點選同意")),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                我已詳細閱讀並同意{" "}
                <NavLink
                  to="/privacyPolicy"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  隱私政策
                </NavLink>
                、
                <NavLink
                  to="/termService"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  服務條款
                </NavLink>
              </Checkbox>
            </Form.Item>
            <Form.Item hasFeedback {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large">
                建立帳號
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default Register;
