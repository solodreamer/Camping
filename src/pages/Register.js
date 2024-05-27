import React, { useState } from "react";
import axios from "axios";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  DatePicker,
  Space,
} from "antd";

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
    console.log(date, dateString);
  };

  const [data, setData] = useState({
    name: "",
    password: "",
    password_confirm: "",
    sex: "",
    birthday: "",
    verify_code: "",
    phone: "",
  });

  /** 存檔 */
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    save(values);
  };

  /** 呼叫存檔api */
  const save = async (data) => {
    try {
      console.log('data:', data);
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
            message: "請輸入姓名",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="性別"
        rules={[
          {
            required: true,
            message: "請選擇性別",
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">男性</Option>
          <Option value="female">女性</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>
      <Form.Item name="birthday" label="出生年月日" rules={[{ required: true }]}>
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
          // addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="電子郵件"
        rules={[
          {
            type: "email",
            message: "這不是有效的 E-mail",
          },
          {
            required: true,
            message: "請輸入 E-mail",
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
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
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
          我已詳細閱讀並同意隱私政策與服務條款{" "}
          <a href="https://www.google.com.tw/search?sca_esv=2f61a0c390a4d1ff&hl=zh_TW&sxsrf=ACQVn0_Wd4cIsEjMvsZNRz2ZJ9THshCwig:1714557213328&q=%E6%88%90%E4%B9%8B%E5%85%A7&uds=AMwkrPsKdw6NKXr7dpE0DWrb0bVbvaFz8JK9bHkN7Gvo-32EhkV6M2t3sTxDwGjowy9_-7s2aVmfcKeWEeLc__srOhq8o-5Lo3tLH2QLtUGYU17pfNceOWbRkVI1ITevICUwBfTCxd6Zq-BhgpaJ-BdSW4FdxIu1QsgEYr3ftZa8lVSt0mC0S2Q1HKu6NByOW4ca8Itf8cIov6HbV99k98luZ9_MN9x3OlDKQ-vP4GAftju67ollEXKGgbEQhHkELKKRvcUSO2OJ&udm=2&prmd=ivsnbmtz&sa=X&ved=2ahUKEwiY15atl-yFAxUnQPUHHSZxBsYQtKgLegQIHRAB&biw=1920&bih=919&dpr=1#vhid=1LI9w5ut_vaNKM&vssid=mosaic">
            agreement
          </a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" size="large">
          建立帳號
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Register;
