// import logo from './logo.svg';
// import './App.css';
import { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
// import { Button, ButtonGroup } from '@chakra-ui/react';
// import React from 'react';
import { Button } from "antd";

function App() {
  // useEffect(() => {
  //     console.log(process.env.REACT_APP_API_URL, process.env.REACT_APP_API_PATH);
  //     (async () => {
  //         const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
  //         console.log('我是axios', res);
  //       })()
  //     }, [])

  // useEffect(() => {
  //   // fetch("https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc")
  //   // fetch("https://ec-course-api.hexschool.io/v2/api/john-test/products/all")
  //   fetch("http://172.105.209.194/api/test", { method: "GET" })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log('我是fetch', data);
  //     })
  //     .catch((err) => {
  //       console.log('我是fetch', err);
  //     })
  // }, [])

  // const submit = async(e) => {
  //   try {
  //     const res = await axios.get(`http://172.105.209.194/api/test`);
  //     console.log('我是fetch', res);
  //   } catch (err) {

  //   }
  // }

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

  const submit = async (e) => {
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

  return (
    <ChakraProvider>
      <div className="App">
        {/* <Routes>
        <Route path='/login' element={<Login/>}></Route>
      </Routes> */}
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
              <Button colorScheme="teal" mr="5px" onClick={submit}>
                登入
              </Button>
              <Button onClick={clear}>清空</Button>
            </div>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
