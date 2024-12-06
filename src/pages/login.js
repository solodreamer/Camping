import axios from "axios";
import { useState } from "react";
import { Button,Input } from "antd";
import { json, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [restostring, setRestostring] = useState("尚未登入");

  const [data, setData] = useState({
    login_id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // console.log(name, value);
    // console.log(data);
  };

  const login = async (e) => {

    try {
      console.log('[登入param]',data);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/auth/login/using-password`,
         data
      );
      console.log('[登入res]',res);
      const { token } = res.data;
      setRestostring('登入成功');
      localStorage.setItem('accessToken',token);
      axios.defaults.headers.common['Authorization'] = token;
      if (token) {
        window.location.href = '/build';
      }
    } catch (err) {
      console.log('[登入Error]',err);
    }

  };

  const register = (e) => {
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
                placeholder=""
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
