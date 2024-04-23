import axios from "axios";
import { useState } from "react";

function Login() {
    const [data, setData] = useState({
        username: '',
        password: ''
    }); //初始化data為空物件

    const handleChange = (e) => {
        const {name, value}  = e.target;
        setData({...data, [name]: value});
        // console.log(name, value);
        // console.log(data);
    }

    const submit = async (e) => {
        const res = await axios.post(`/v2/admin/signin`, data);
        // console.log(res);
        const {token} = res.data;
        axios.defaults.headers.common['Authorization'] = token;
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products/all`);
        // const productRes = await axios.get(`http://172.105.209.194/api/test`);
        console.log(productRes);
    }

  return (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>登入帳號</h2>

        <div className="alert alert-danger" role="alert">
          錯誤訊息
        </div>
        <div className="mb-2">
          <label htmlFor="email" className="form-label w-100">
            Email
            <input id="email" className="form-control" name="username" type="email" placeholder="Email Address"  onChange={handleChange}/>
          </label>
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label w-100">
            密碼
            <input type="password" className="form-control"  name="password" id="password" placeholder="name@example.com"  onChange={handleChange} />
          </label>
        </div>
        <button type="button" className="btn btn-primary" onClick={submit}>登入</button>
      </div>
    </div>
  </div>
  )
}

export default Login;