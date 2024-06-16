import React, { useState } from "react";
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
  Layout
} from "antd";

const { Header, Content, Footer } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(100% - 8px)',
  maxWidth: 'calc(100% - 8px)',
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

  /**出生日期改變事件 */
  const dateTimeOnChange = (date, dateString) => {
    console.log('生日:', date, dateString);
    // form.setFieldsValue({ birthday: dateString });
  };

  /** 存檔 */
  const onFinish = (values) => {
    const inputValues = {
      ...values,
      'birthday': values['birthday'].format('YYYY-MM-DD')
    }
    console.log("Received values of form: ", inputValues);
    save(inputValues);
  };

  /** 呼叫存檔api */
  const save = async (data) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/signup/using-phone`, data);
      console.log('saveapi:', res);
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
          <Form.Item name="birthday" label="出生年月日" rules={[{ required: true, message: "請選擇生日" }]}>
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
            />
          </Form.Item>
          <Form.Item label="驗證碼">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="verify_code"
                  noStyle
                  rules={[{ required: true, message: '請輸入驗證碼' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button type="primary">取得驗證碼</Button>
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
          {/* <Form.Item
        label="我不是機器人"
        extra="We must make sure that your are a human."
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Please input the captcha you got!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </Form.Item> */}

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              我已詳細閱讀並同意{" "}
              <NavLink to='/privacyPolicy' style={{ color: 'blue', textDecoration: 'underline' }}>
                隱私政策
              </NavLink>
              、
              <NavLink to='/termService' style={{ color: 'blue', textDecoration: 'underline' }}>
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
      </Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>

  );
}

export default Register;
