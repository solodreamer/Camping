import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    Button, Modal, Layout, Menu, theme
} from "antd";
import { LoginOutlined, UserAddOutlined, HomeOutlined } from "@ant-design/icons"

import Login from "./login.js"
import Register from "./register.js"

const { Header, Content, Footer, Sider } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
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
const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)',
};

const items = [
    { key: '1', label: '會員登入', icon: <LoginOutlined />, path: '/login' },
    { key: '2', label: '註冊', icon: <UserAddOutlined />, path: '/register' },
    { key: '3', label: '首頁', icon: <HomeOutlined />, path: '/' }
]

function HomePage() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout >
            <Sider
                style={siderStyle}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
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
                        內容
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
                        }
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
