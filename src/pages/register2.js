import { useState } from 'react';
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
  Divider
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './register2.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    birthday: null,
    phone: '',
    verify_code: '',
    email: '',
    password: '',
    password_confirm: '',
    agreement: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // 清除對應欄位的錯誤
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 驗證姓名
    if (!formData.name) {
      newErrors.name = '請輸入您的姓名';
    }
    
    // 驗證性別
    if (!formData.gender) {
      newErrors.gender = '請選擇您的性別';
    }
    
    // 驗證出生日期
    if (!formData.birthDate) {
      newErrors.birthDate = '請選擇您的出生日期';
    }
    
    // 驗證手機號碼
    if (!formData.phone) {
      newErrors.phone = '請輸入您的手機號碼';
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '請輸入有效的手機號碼格式';
    }
    
    // 驗證驗證碼
    if (!formData.verificationCode) {
      newErrors.verificationCode = '請輸入驗證碼';
    }
    
    // 驗證電子郵件
    if (!formData.email) {
      newErrors.email = '請輸入您的電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    
    // 驗證密碼
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼長度不能少於8個字符';
    }
    
    // 驗證確認密碼
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認您的密碼';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '兩次輸入的密碼不一致';
    }
    
    // 驗證同意條款
    if (!formData.agreement) {
      newErrors.agreement = '請閱讀並同意條款';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // 模擬 API 提交
      setTimeout(() => {
        console.log('註冊資料:', formData);
        message.success('註冊成功！');
        // 重置表單
        setFormData({
          name: '',
          gender: '',
          birthDate: null,
          phone: '',
          verificationCode: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreement: false
        });
        setLoading(false);
      }, 1500);
    }
  };

  const sendVerificationCode = () => {
    if (!formData.phone || formData.phone.length < 10 || formData.phone.length > 10) {
      setErrors({
        ...errors,
        phone: '請先輸入手機號碼'
      });
      return;
    }
    
    setVerificationSent(true);
    message.success(`驗證碼已發送至 ${formData.phone}`);
    
    // 60秒後重置
    setTimeout(() => {
      setVerificationSent(false);
    }, 60000);
  };

  // 表單項組件
  const FormItem = ({ label, children, error }) => (
    <div className="input-group">
      <label className="form-label">{label}</label>
      {children}
      {error && <div className="error-message">{error}</div>}
    </div>
  );

  return (
    <div className="registration-container">
      <Card className="registration-card">
        <div className="form-header">
          <Title level={2}>會員註冊</Title>
          <Text className="form-subtitle">請填寫以下資料完成註冊</Text>
        </div>
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem label="姓名" error={errors.name}>
              <Input 
                prefix={<UserOutlined />} 
                placeholder="請輸入姓名" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </FormItem>
            
            <FormItem label="性別" error={errors.sex}>
              <Select 
                placeholder="請選擇性別" 
                style={{ width: '100%' }}
                value={formData.sex}
                onChange={(value) => handleInputChange('sex', value)}
              >
                <Option value="male">男</Option>
                <Option value="female">女</Option>
                <Option value="other">其他</Option>
              </Select>
            </FormItem>
          </div>
          
          <FormItem label="出生年月日" error={errors.birthday}>
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="請選擇日期"
              format="YYYY-MM-DD"
              value={formData.birthday}
              onChange={(date) => handleInputChange('birthday', date)}
            />
          </FormItem>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 md:col-span-2">
              <FormItem label="手機號碼" error={errors.phone}>
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="請輸入手機號碼"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </FormItem>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <FormItem label="驗證碼" error={errors.verify_code}>
                <div className="flex verification-input-group">
                  <Input 
                    placeholder="請輸入驗證碼" 
                    className="flex-1"
                    value={formData.verify_code}
                    onChange={(e) => handleInputChange('verify_code', e.target.value)}
                  />
                  <Button 
                    type="primary" 
                    className="verification-button"
                    onClick={sendVerificationCode}
                    disabled={verificationSent}
                  >
                    {verificationSent ? '已發送' : '獲取驗證碼'}
                  </Button>
                </div>
              </FormItem>
            </div>
          </div>
          
          <FormItem label="電子郵件" error={errors.email}>
            <Input
              prefix={<MailOutlined />}
              placeholder="請輸入電子郵件"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </FormItem>
          
          <FormItem label="密碼" error={errors.password}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入密碼"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </FormItem>
          
          <FormItem label="確認密碼" error={errors.password_confirm}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請再次輸入密碼"
              value={formData.password_confirm}
              onChange={(e) => handleInputChange('password_confirm', e.target.value)}
            />
          </FormItem>
          
          <FormItem error={errors.agreement}>
            <div className="agreement-option">
              <Checkbox 
                checked={formData.agreement} 
                onChange={(e) => handleInputChange('agreement', e.target.checked)}
              >
                我已詳細閱讀並同意 <a href="#privacyPolicy">隱私政策</a> 及 <a href="#termService">服務條款</a>
              </Checkbox>
            </div>
          </FormItem>
          
          <div className="submit-button">
            <Button 
              type="primary" 
              size="large" 
              block
              loading={loading}
              onClick={handleSubmit}
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
        </div>
      </Card>
    </div>
  );
};

export default RegistrationForm;