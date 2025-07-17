"use client"
import { useState } from "react"
import { Layout, Typography, Table, Button, Input, Select, DatePicker, Space, Modal, Row, Col, Divider } from "antd"

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState("order-list")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // 模擬露營訂單資料
  const mockOrderData = [
    {
      key: "1",
      orderNumber: "T202506020001",
      campsiteName: "Mountain Adventure Camp",
      amount: 3200,
      startDate: "2025-06-06",
      endDate: "2025-06-09",
      paymentStatus: "已付款",
      campsiteDetails: {
        address: "台北市陽明山國家公園內",
        phone: "+886 2 2861-1234",
        email: "info@mountaincamp.com",
        facilities: ["衛浴設備", "烤肉區", "停車場", "便利商店", "WiFi"],
      },
      bookingDetails: {
        guestName: "王小明",
        guestPhone: "+886 912345678",
        guestEmail: "wang@example.com",
        adults: 2,
        children: 1,
        tents: 1,
      },
      priceBredown: {
        basePrice: 2800,
        serviceFee: 200,
        tax: 280,
        discount: 80,
      },
    },
    {
      key: "2",
      orderNumber: "T202505150002",
      campsiteName: "Forest Lake Camping",
      amount: 2800,
      startDate: "2025-05-15",
      endDate: "2025-05-17",
      paymentStatus: "待付款",
      campsiteDetails: {
        address: "新竹縣尖石鄉森林湖畔",
        phone: "+886 3 5841-567",
        email: "contact@forestlake.com",
        facilities: ["湖景營位", "釣魚區", "兒童遊戲區", "餐廳"],
      },
      bookingDetails: {
        guestName: "李美華",
        guestPhone: "+886 987654321",
        guestEmail: "lee@example.com",
        adults: 4,
        children: 2,
        tents: 2,
      },
      priceBredown: {
        basePrice: 2400,
        serviceFee: 150,
        tax: 250,
        discount: 0,
      },
    },
    {
      key: "3",
      orderNumber: "T202504280003",
      campsiteName: "Sunset Valley Camp",
      amount: 4500,
      startDate: "2025-04-28",
      endDate: "2025-05-01",
      paymentStatus: "已付款",
      campsiteDetails: {
        address: "南投縣清境農場附近",
        phone: "+886 49 2803-789",
        email: "hello@sunsetvalley.com",
        facilities: ["高山景觀", "溫泉", "觀星台", "咖啡廳", "導覽服務"],
      },
      bookingDetails: {
        guestName: "陳大偉",
        guestPhone: "+886 956789123",
        guestEmail: "chen@example.com",
        adults: 6,
        children: 0,
        tents: 3,
      },
      priceBredown: {
        basePrice: 4000,
        serviceFee: 300,
        tax: 400,
        discount: 200,
      },
    },
    {
      key: "4",
      orderNumber: "T202504100004",
      campsiteName: "Riverside Camping Ground",
      amount: 1800,
      startDate: "2025-04-10",
      endDate: "2025-04-12",
      paymentStatus: "已取消",
      campsiteDetails: {
        address: "宜蘭縣冬山河親水公園旁",
        phone: "+886 3 9591-456",
        email: "info@riverside.com",
        facilities: ["河景營位", "獨木舟", "腳踏車租借", "烤肉區"],
      },
      bookingDetails: {
        guestName: "張志明",
        guestPhone: "+886 923456789",
        guestEmail: "zhang@example.com",
        adults: 2,
        children: 0,
        tents: 1,
      },
      priceBredown: {
        basePrice: 1600,
        serviceFee: 100,
        tax: 160,
        discount: 60,
      },
    },
    {
      key: "5",
      orderNumber: "T202503220005",
      campsiteName: "Highland Adventure Park",
      amount: 5200,
      startDate: "2025-03-22",
      endDate: "2025-03-25",
      paymentStatus: "已付款",
      campsiteDetails: {
        address: "台中市和平區梨山風景區",
        phone: "+886 4 2598-234",
        email: "service@highland.com",
        facilities: ["高山氣候", "果園體驗", "登山步道", "溫室餐廳", "接駁服務"],
      },
      bookingDetails: {
        guestName: "林雅婷",
        guestPhone: "+886 934567890",
        guestEmail: "lin@example.com",
        adults: 8,
        children: 4,
        tents: 4,
      },
      priceBredown: {
        basePrice: 4600,
        serviceFee: 350,
        tax: 460,
        discount: 210,
      },
    },
  ]

  const menuItems = [
    { key: "home", label: "首頁", icon: "🏠" },
    { key: "profile", label: "個人資料", icon: "👤" },
    { key: "order-list", label: "訂單查詢", icon: "📋" },
    { key: "logout", label: "登出", icon: "🚪" },
  ]

  // 顯示訂單明細
  const showOrderDetail = (order) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  // 關閉彈窗
  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedOrder(null)
  }

  // 表格欄位定義
  const columns = [
    {
      title: "明細",
      key: "detail",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          style={{
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
          onClick={() => showOrderDetail(record)}
        >
          🔍
        </Button>
      ),
    },
    {
      title: "訂單號碼",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 150,
      render: (text) => <Text style={{ color: "#1890ff", cursor: "pointer" }}>{text}</Text>,
    },
    {
      title: "營區名稱",
      dataIndex: "campsiteName",
      key: "campsiteName",
      width: 200,
    },
    {
      title: "金額",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: "#f5222d" }}>
          NT$ {amount.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "開始日期",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "結束日期",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      sorter: (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "付款狀態",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 120,
      render: (status) => {
        let color = "#52c41a" // 綠色 - 已付款
        let bgColor = "#f6ffed"

        if (status === "待付款") {
          color = "#faad14" // 橙色
          bgColor = "#fff7e6"
        } else if (status === "已取消") {
          color = "#f5222d" // 紅色
          bgColor = "#fff2f0"
        }

        return (
          <div
            style={{
              background: bgColor,
              color: color,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              textAlign: "center",
              border: `1px solid ${color}20`,
            }}
          >
            {status}
          </div>
        )
      },
      filters: [
        { text: "已付款", value: "已付款" },
        { text: "待付款", value: "待付款" },
        { text: "已取消", value: "已取消" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 側邊欄 */}
      <Sider width={200} style={{ background: "#1c4ba0" }}>
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            borderBottom: "1px solid #2c5aa0",
            marginBottom: "8px",
          }}
        >
          <Text strong style={{ color: "white", fontSize: "16px" }}>
            Go會員
          </Text>
        </div>

        <div style={{ padding: "8px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: selectedMenu === item.key ? "#2c5aa0" : "transparent",
                color: "white",
                borderLeft: selectedMenu === item.key ? "3px solid #40a9ff" : "3px solid transparent",
              }}
              onClick={() => setSelectedMenu(item.key)}
            >
              <span style={{ marginRight: "8px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Sider>

      <Layout>
        {/* 頂部標題欄 */}
        <Header
          style={{
            background: "#1c4ba0",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title level={3} style={{ color: "white", margin: 0, fontWeight: "bold" }}>
            訂單查詢
          </Title>
        </Header>

        {/* 主要內容區域 */}
        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* 搜尋和篩選區域 */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Space wrap style={{ width: "100%" }}>
                <Search
                  placeholder="搜尋訂單號碼或營區名稱"
                  style={{ width: 250 }}
                  onSearch={(value) => console.log("搜尋:", value)}
                />
                <Select
                  placeholder="付款狀態"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => console.log("篩選狀態:", value)}
                >
                  <Option value="已付款">已付款</Option>
                  <Option value="待付款">待付款</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
                <RangePicker
                  placeholder={["開始日期", "結束日期"]}
                  onChange={(dates) => console.log("日期範圍:", dates)}
                />
                <Button type="primary">搜尋</Button>
                <Button>重置</Button>
              </Space>
            </div>

            {/* 訂單列表表格 */}
            <div
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Table
                columns={columns}
                dataSource={mockOrderData}
                pagination={{
                  total: mockOrderData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
                }}
                scroll={{ x: 900 }}
                size="middle"
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* 訂單明細彈窗 */}
      <Modal
        title={<div style={{ fontSize: "18px", fontWeight: "bold" }}>訂單明細 - {selectedOrder?.orderNumber}</div>}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            關閉
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* 基本訂單資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                📋 基本資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>訂單號碼：</Text>
                  <Text>{selectedOrder.orderNumber}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>營區名稱：</Text>
                  <Text>{selectedOrder.campsiteName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>入住日期：</Text>
                  <Text>{selectedOrder.startDate}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>退房日期：</Text>
                  <Text>{selectedOrder.endDate}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>付款狀態：</Text>
                  <Text
                    style={{
                      color:
                        selectedOrder.paymentStatus === "已付款"
                          ? "#52c41a"
                          : selectedOrder.paymentStatus === "待付款"
                            ? "#faad14"
                            : "#f5222d",
                    }}
                  >
                    {selectedOrder.paymentStatus}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>總金額：</Text>
                  <Text style={{ color: "#f5222d", fontWeight: "bold" }}>
                    NT$ {selectedOrder.amount.toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 營區資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                🏕️ 營區資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Text strong>地址：</Text>
                  <Text>{selectedOrder.campsiteDetails.address}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>電話：</Text>
                  <Text>{selectedOrder.campsiteDetails.phone}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Email：</Text>
                  <Text>{selectedOrder.campsiteDetails.email}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>設施：</Text>
                  <div style={{ marginTop: "8px" }}>
                    {selectedOrder.campsiteDetails.facilities.map((facility, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "#f0f2f5",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          marginRight: "8px",
                          marginBottom: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 預訂者資訊 */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                👤 預訂者資訊
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>姓名：</Text>
                  <Text>{selectedOrder.bookingDetails.guestName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>電話：</Text>
                  <Text>{selectedOrder.bookingDetails.guestPhone}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Email：</Text>
                  <Text>{selectedOrder.bookingDetails.guestEmail}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>成人：</Text>
                  <Text>{selectedOrder.bookingDetails.adults} 人</Text>
                </Col>
                <Col span={8}>
                  <Text strong>兒童：</Text>
                  <Text>{selectedOrder.bookingDetails.children} 人</Text>
                </Col>
                <Col span={8}>
                  <Text strong>帳篷：</Text>
                  <Text>{selectedOrder.bookingDetails.tents} 頂</Text>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 費用明細 */}
            <div>
              <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
                💰 費用明細
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text>基本費用：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.basePrice.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text>服務費：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.serviceFee.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text>稅金：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text>NT$ {selectedOrder.priceBredown.tax.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ color: "#52c41a" }}>折扣：</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text style={{ color: "#52c41a" }}>-NT$ {selectedOrder.priceBredown.discount.toLocaleString()}</Text>
                </Col>
                <Col span={24}>
                  <Divider style={{ margin: "12px 0" }} />
                </Col>
                <Col span={12}>
                  <Text strong style={{ fontSize: "16px" }}>
                    總計：
                  </Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text strong style={{ fontSize: "16px", color: "#f5222d" }}>
                    NT$ {selectedOrder.amount.toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
