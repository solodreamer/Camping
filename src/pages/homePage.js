import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    Button, Modal, Layout, Menu, theme, Flex, Col, Row
} from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined } from "@ant-design/icons"

import Login from "./login.js"
import Register from "./register.js"
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
    top: 0,
    position: 'sticky',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    backgroundColor: '#0958d9',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};
const item2 = {
    backgroundcolor: '#0e1680'
}

const items = [
    { key: '1', label: '會員登入', icon: <LoginOutlined />, path: '/login' },
    { key: '2', label: '註冊', icon: <UserAddOutlined />, path: '/register' },
    { key: '3', label: '首頁', icon: <HomeOutlined />, path: '/build' }
]

function HomePage() {

    const [camps, setCamps] = useState([]);
    const getCampList = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/camps`);
            if (res.data.sucess === true) {
                setCamps(res.data.data);
            }
            console.log("getCampList取得成功:", res);
        } catch (err) {
            console.log("getCampList取得異常:", err);
        }
    };

    useEffect(() => {
        getCampList();
    }, [])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout >
            <Sider
                style={siderStyle}
                breakpoint="md"
                collapsedWidth="0"
            >
                <Menu mode="inline" theme="dark">
                    {items.map(item => (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.path}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={headerStyle}>
                    頂部
                </Header>
                <Content style={contentStyle}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {/* 內容
                        {
                            // indicates very long content
                            Array.from(
                                {
                                    length: 10,
                                },
                                (_, index) => (
                                    <React.Fragment key={index}>
                                        {index % 20 === 0 && index ? 'more' : '...'}
                                        <br />
                                    </React.Fragment>
                                ),
                            )
                        } */}
                        <Row >
                            {camps?.map((camp) => {
                                return (
                                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <img
                                            src={camp.CoverImage}
                                            className='card-img-top rounded-0 object-cover'
                                            height={300}
                                        />
                                        <h4 className='mb-0 mt-2'>{camp.Name}</h4>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Content>
                <Footer style={footerStyle}>
                    Copyright ©{new Date().getFullYear()} Created by Go露營
                </Footer>
            </Layout>
        </Layout>
    )

}

export default HomePage;
