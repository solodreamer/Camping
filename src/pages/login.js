import React, { useState, useContext } from "react";
import { Button,Input } from "antd";
import { useNavigate } from "react-router-dom";
import { api,setAuthToken} from "../api";
import AuthContext from "../AuthContext";

function Login() {
  const navigate = useNavigate();
  const [restostring, setRestostring] = useState("尚未登入");
  // 取得登入狀態、登入函式
  const { handleLogin } = useContext(AuthContext);
  // 登入參數
  const [data, setData] = useState({
    login_id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  /**
   * 登入事件
   */
  const login = async () => {
    try {
      console.log('[登入param]',data);
      const res = await api.post('/v1/auth/login/using-password',data);
      console.log('[登入res]',res);
      const { token } = res.data;
      setRestostring('登入成功');
      localStorage.setItem('accessToken',token);
      setAuthToken(token);
      handleLogin();
      if (token) {
        navigate('/');
      }
    } catch (err) {
      console.log('[登入Error]',err);
      setRestostring('登入失敗');
    }
  };

  /**
   * 註冊事件
   */
  const register = () => {
    navigate("/register");
  }

  return (
    <div className="App">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>登入帳號</h2>
            <div className="alert alert-danger" role="alert">
              {restostring}
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label w-100">
              手機號碼
                <Input
                  id="login_id"
                  name="login_id"
                  type="login_id"
                  placeholder="請輸入您的手機號碼"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label w-100">
                密碼
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="可使用混合6個字以上的英文字母、數字和符號"
                onChange={handleChange}
              />
            </div>
            <Button onClick={register}>註冊</Button>
            <Button type="primary" onClick={login}>
              登入
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
