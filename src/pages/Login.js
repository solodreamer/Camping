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
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      const res = await axios.post(`http://172.105.209.194/v1/login`, formData);
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

  const clear = (e) => {
    setRestostring("尚未登入");
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
                Email
                <input
                  id="email"
                  className="form-control"
                  name="username"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label w-100">
                密碼
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </label>
            </div>
            <Button onClick={clear}>清空</Button>
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
