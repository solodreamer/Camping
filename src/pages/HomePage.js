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
    Modal
} from "antd";
import Login from "./login.js"
import Register from "./register.js"


function HomePage() {
    const [login, showLogin] = Modal.useModal();
    const [register, showRegister] = Modal.useModal();

    return (
        <div className="home">
            <div className="header">
                <h2>首頁</h2>
                <div>
                    <Button onClick={() => login.info({
                        title: '登入',
                        content: <Login />,
                        closable: true,
                        footer: null
                    })}>登入
                    </Button>
                    {showLogin}
                    <Button onClick={() => register.info({
                        title: '註冊',
                        content: <Register />,
                        closable: true,
                        footer: null
                    })}>註冊
                    </Button>
                    {showRegister}
                </div>
            </div>
            <div className="body"></div>
            <div className="footer"></div>
        </div>
    )

}

export default HomePage;
