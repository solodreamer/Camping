import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Layout,
} from "antd";

const { Header, Content, Footer } = Layout;
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};
const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(100% - 8px)",
  maxWidth: "calc(100% - 8px)",
};
const { Option } = Select;
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
  const [phone, setPhone] = useState();

  /**出生日期改變事件 */
  const dateTimeOnChange = (date, dateString) => {
    console.log("生日:", date, dateString);
    // form.setFieldsValue({ birthday: dateString });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setPhone({ phone: value });
    console.log(phone);
  };

  useEffect(() => {
    let timerId;
    if (countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(countdown - 1);
        console.log("countdown", countdown);
      }, 1000);
      console.log("timerId1", timerId);
    }
    return () => {
      console.log("timerId2", timerId);
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [countdown]);

  /** 取得手機驗證碼api */
  const getVerifyCode = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/auth/signup/send-verify-code`,
        phone
      );
      console.log("getVerifyCodeApi:", res);
      if (res.data.success === true) {
        setCountdown(30);
      }
    } catch (err) {
      console.log("getVerifyCodeApiErr:", err);
    }
  };

  /** 存檔 */
  const onFinish = (values) => {
    const inputValues = {
      ...values,
      birthday: values["birthday"].format("YYYY-MM-DD"),
    };
    console.log("Received values of form: ", inputValues);
    saveRegister(inputValues);
  };

  /** 呼叫存檔api */
  const saveRegister = async (params) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/auth/signup/using-phone`,
        params
      );
      console.log("saveRegisterApi:", res);
      // console.log(restostring);
      const { token } = res.data;
      // setRestostring(token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>
        <Row>
          <Col md={0} lg={8}>
            <div>
              <img
                src="https://images.unsplash.com/photo-1470246973918-29a93221c455?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbXB8ZW58MHx8MHx8fDA%3D"
                sizes="(min-width: 1335px) 410.6666666666667px, (min-width: 992px) calc(calc(100vw - 88px) / 3), (min-width: 768px) calc(calc(100vw - 64px) / 2), 100vw"
                className="object-cover"
              ></img>
            </div>
          </Col>
          <Col md={24} lg={16}>
            <div>
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
                  name="name"
                  label="姓名"
                  rules={[
                    {
                      required: true,
                      message: "請輸入最少兩個字",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
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
                  name="birthday"
                  label="出生年月日"
                  rules={[{ required: true, message: "請選擇生日" }]}
                >
                  <DatePicker onChange={dateTimeOnChange} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="手機號碼"
                  rules={[
                    {
                      required: true,
                      message: "請輸入手機號碼",
                    },
                  ]}
                >
                  <Input
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChange}
                    value={phone}
                  />
                </Form.Item>
                <Form.Item label="驗證碼">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
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
                        disabled={countdown > 0}
                      >
                        {countdown > 0
                          ? `${countdown}秒後重新獲取`
                          : "取得驗證碼"}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="電子郵件"
                  rules={[
                    {
                      type: "email",
                      message: "這不是有效的電子郵件",
                    },
                    {
                      required: true,
                      message: "請輸入電子郵件",
                    },
                  ]}
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密碼"
                  rules={[
                    {
                      required: true,
                      message: "請輸入密碼",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="建議混合8個字以上的英文字母、數字和符號" />
                </Form.Item>

                <Form.Item
                  name="password_confirm"
                  label="再次確認密碼"
                  dependencies={["password"]}
                  hasFeedback
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
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Should accept agreement")
                            ),
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
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" size="large">
                    建立帳號
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
}

export default Register;
