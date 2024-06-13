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

    // try {
      console.log('data:',data);
      const res = await axios.post(`/v1/auth/login/using-password`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      }).then(response => {console.log('過程:'+response);})
      .catch(error => {console.error('Error:', error);});
      console.log('結果:'+res);
      // console.log(restostring);
      // const { token } = res.data;
      // setRestostring(token);
      // axios.defaults.headers.common['Authorization'] = token;
    // } catch (err) {
    //   console.log(err);
    // }
    const result = axios.get(`https://jsonplaceholder.typicode.com/posts/1`).then(response => {console.log('過程:'+ response.data);})
    console.log('結果:'+json.toString(result.data));

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
