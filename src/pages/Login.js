import axios from "axios";
import { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [restostring, setRestostring] = useState("尚未登入");

  const [data, setData] = useState({
    username: "",
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
      console.log('data:',data);
      const res = await axios.post(`/v1/auth/login/using-password`, data);
      console.log(res);
      console.log(restostring);
      const { token } = res.data;
      setRestostring(token);
      // axios.defaults.headers.common['Authorization'] = token;
      // const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products/all`);
    } catch (err) {
      console.log(err);
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
                電子郵件
                <input
                  id="email"
                  className="form-control"
                  name="username"
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label w-100">
                密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
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
