import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

import {
  Layout,
  Menu,
  Col,
  Row,
  Divider,
  Typography,
  Image,
  Empty,
  Tag,
  Spin,
  Button,
  Calendar,
  Select,
  List,
  InputNumber,
} from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { QueryFilter, ProFormDateRangePicker } from '@ant-design/pro-components';

import "./campDetail.css";
import axios from "axios";
import dayjs from "dayjs";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

function CampDetail() {
  //選單項目
  const menuItems = [
    { key: "1", label: "會員登入", icon: <LoginOutlined />, path: "/login" },
    { key: "2", label: "註冊", icon: <UserAddOutlined />, path: "/register" },
    { key: "3", label: "首頁", icon: <HomeOutlined />, path: "/" },
  ];

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [campPhotosIndex, setCampPhotosIndex] = useState(0);
  const [campsitePhotosIndex, setCampsitePhotosIndex] = useState({});
  const [availableCampsite, setAvailableCampsite] = useState([]);
  const [campsiteCountInfo, setCampsiteCountInfo] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  // 定義狀態來存儲日期範圍
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1,'day')]);
  // 定義狀態來存儲訂位數量
  const [quantities, setQuantities] = useState({});

  /**
   * 取得營地資訊
   * @param {*} id 營地ID
   */
  const getCampDetail = async (id) => {
    const productRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1/camps/${id}`
    );
    if (productRes && productRes.data.success === true) {
      setProduct(productRes.data.data);
    }
  };

  /**
   * 營地照片上一張
   */
  const handleCampPhotoPrevClick = () => {
    setCampPhotosIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.campPhotos.length) % product.campPhotos.length
    );
  };

  /**
   * 營地照片下一張
   */
  const handleCampPhotoNextClick = () => {
    setCampPhotosIndex(
      (prevIndex) => (prevIndex + 1) % product.campPhotos.length
    );
  };

  /**
   * 營區照片上一張
   * @param {*} areaName //營區名稱
   */
  const handleCampsitePhotoPrevClick = (areaName) => {
    setCampsitePhotosIndex((prevState) => {
      const currentIndex = prevState[areaName] || 0;
      console.log(`Current prevState:`, prevState); // 輸出目前的照片索引
      console.log(`Current index for ${areaName}:`, currentIndex); // 輸出目前的照片索引
      const campsite = product.campsite.find((c) => c.areaName === areaName);
      const newIndex = (currentIndex - 1 + campsite.campsitePhotos.length) % campsite.campsitePhotos.length;
      console.log(`newIndex:`, newIndex); // 輸出目前的照片索引
      return { ...prevState, [areaName]: newIndex };
    });
  };

  /**
   * 營區照片下一張
   * @param {*} areaName //營區名稱
   */
  const handleCampsitePhotoNextClick = (areaName) => {
    setCampsitePhotosIndex((prevState) => {
      const currentIndex = prevState[areaName] || 0;
      console.log(`Current index for ${areaName}:`, currentIndex); // 輸出目前的照片索引
      const campsite = product.campsite.find((c) => c.areaName === areaName);
      const newIndex = (currentIndex + 1) % campsite.campsitePhotos.length;
      return { ...prevState, [areaName]: newIndex };
    });
  };

  /**
   * 取得單一營位可訂位日期
   * @param {*} param 
   */
  const getAvailableCampsite = async (param) => {
    const availableRes = await axios.post(`${process.env.REACT_APP_API_URL}/v1/camps/available`, param);
    if (availableRes.data.success === true && availableRes.data.data.length > 0) {
      console.log("[availableRes]", availableRes.data);
      setAvailableCampsite(availableRes.data.data);
    }
    return [];
  }

  /**
   * 日曆切換月份變更事件
   * @param {*} value 
   * @param {*} mode 
   */
  const onPanelChange = (value, mode) => {
    const year = value.format('YYYY');
    const month = value.format('MM');
    getAvailableCampsite({ camp_id: id, year: year, month: month });
  };

  /**
   * 自訂義日曆格內容
   * @param {*} current 
   * @param {*} info 
   * @returns 
   */
  const cellRender = (current, info) => {
    if (availableCampsite.length > 0) {
      return dateCellRender(current);
    }
    return '未取得';
    // return dateCellRender(current);
  };

  /**
   * 自訂義日曆格html
   * @param {*} value 
   * @returns 
   */
  const dateCellRender = (value) => {
    const available = availableCampsite.find((item) => item.date === dayjs(value).format('YYYY-MM-DD').toString());
    return (
      <ul className="events">
        <div>{available ? available.available : 0}</div>
      </ul>
    );
  };

  /**
   * 日期選擇事件
   * @param {*} date 
   */
  const onSelect = (date) => {
    console.log("[日期選擇]", dayjs(date));
    setSelectedDate(date);
    setDateRange([date, date.add(1,'day')]);
    onFilterSearch();
  }

  /**
   * 取得單一營位可訂位數量
   * @param {*} param 
   */
  const getCampsite_available = async (param) => {
    const campsiteCountInfo = await axios.post(`${process.env.REACT_APP_API_URL}/v1/camps/campsite_available`, param);

    if (campsiteCountInfo.data.success === true) {
      setCampsiteCountInfo(campsiteCountInfo.data.data);
    }
  };

  /**
   * 特定條件查詢單一營位可訂位數量
   */
  const onFilterSearch = async () => {
    await waitTime(1000);
    getCampsite_available({ camp_id: id, date: dayjs(dateRange[0]).format('YYYY-MM-DD').toString() });
  };

  /** 等待時間 */
  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  /**
   * 是否禁用日期
   * @param {*} current 
   * @returns 
   */
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  /**
   * 日期範圍變更事件
   * @param {*} dates 
   */
  const onDateChange = (dates) => {
    setDateRange(dates);
  };

  /**
   * 初始化取得營地資訊
   */
  useEffect(() => {
    getCampDetail(id);
    console.log("[id]", id);
  }, [id]);

  /**
   * 初始化取得當月可預約營區
   */
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    getAvailableCampsite({ camp_id: id, year: year.toString(), month: month.toString() });
  }, []);

  useEffect(() => {
    console.log("[營地資訊]", product);
  }, [product]);

  useEffect(() => {
    console.log("[可訂位日期]", availableCampsite);
  }, [availableCampsite]);

  useEffect(() => {
    console.log("[可預約營區數量]", campsiteCountInfo);
  }, [campsiteCountInfo]);

  useEffect(() => {
    console.log("[選擇入住時間]", dateRange[0].format('YYYY-MM-DD'),"-", dateRange[1].format('YYYY-MM-DD'));
  }, [dateRange]);

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };


  return (
    <Layout>
      <Sider className="siderStyle" breakpoint="md" collapsedWidth="0">
        <Menu mode="inline" theme="dark">
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="headerStyle">Go露營</Header>
        <Content className="contentStyle">
          {product ? (
            <Typography>
              <Divider />
              <Row >
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  {product.campPhotos?.length > 0 ? (
                    <Image.PreviewGroup
                      items={product.campPhotos.map((item) => {
                        return { src: item.img };
                      })}
                    >
                      <Button
                        className="campPhoto-prevButton"
                        onClick={handleCampPhotoPrevClick}
                        shape="circle"
                        icon={<CaretLeftOutlined />}
                      />
                      <Image
                        style={{ width: "400px" }}
                        src={product.campPhotos[campPhotosIndex].img}
                        fallback={Empty.PRESENTED_IMAGE_DEFAULT}
                      />
                      <Button
                        className="campPhoto-nextButton"
                        onClick={handleCampPhotoNextClick}
                        shape="circle"
                        icon={<CaretRightOutlined />}
                      />
                    </Image.PreviewGroup>
                  ) : (
                    <p>
                      無營地照片 <Empty />
                    </p>
                  )}
                  <br />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Title>{product.name}</Title>
                  <Paragraph>{product.desc}</Paragraph>
                  <Paragraph>
                    <Text strong underline>
                      <NavLink to="https://www.google.com/maps">
                        {product.fullAddress}
                      </NavLink>
                    </Text>
                  </Paragraph>
                </Col>
              </Row>
              <Divider />
              <Divider orientation="left">
                <Title level={2}>選擇入住時間</Title>
              </Divider>
              <Row>
                <Col  className="queryFilterStyle">
                  <QueryFilter defaultCollapsed submitter onFinish={onFilterSearch}>
                    <ProFormDateRangePicker name="dateRange" label="日期" value={dateRange}
                      fieldProps={{ disabledDate, inputReadOnly: true }} onChange={onDateChange}/>
                  </QueryFilter>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="calendr-outer-frame">
                  <Calendar
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                      const start = 0;
                      const end = 12;
                      const monthOptions = [];
                      let current = value.clone();
                      const localeData = value.localeData();
                      const months = [];
                      for (let i = 0; i < 12; i++) {
                        current = current.month(i);
                        months.push(localeData.monthsShort(current));
                      }
                      for (let i = start; i < end; i++) {
                        monthOptions.push(
                          <Select.Option key={i} value={i} className="month-item">
                            {months[i]}
                          </Select.Option>,
                        );
                      }
                      const year = value.year();
                      const month = value.month();
                      const options = [];
                      for (let i = year - 10; i < year + 10; i += 1) {
                        options.push(
                          <Select.Option key={i} value={i} className="year-item">
                            {i}
                          </Select.Option>,
                        );
                      }
                      return (
                        <div
                          style={{
                            padding: 8,
                          }}
                        >
                          <Typography.Title level={2}>{`${selectedDate?.format('YYYY')}年${selectedDate?.format('MM')}月`}</Typography.Title>
                          <Row gutter={8} className="calendr-select-row">
                            <Col>
                              <Select
                                size="small"
                                popupMatchSelectWidth={false}
                                className="my-year-select"
                                value={year}
                                onChange={(newYear) => {
                                  const now = value.clone().year(newYear);
                                  onChange(now);
                                }}
                              >
                                {options}
                              </Select>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                popupMatchSelectWidth={false}
                                value={month}
                                onChange={(newMonth) => {
                                  const now = value.clone().month(newMonth);
                                  onChange(now);
                                }}
                              >
                                {monthOptions}
                              </Select>
                            </Col>
                          </Row>
                        </div>
                      );
                    }}
                    cellRender={cellRender}
                    onPanelChange={onPanelChange}
                    onSelect={onSelect}
                    //disabledDate={disabledDate}
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="tableStyle">
                  <Title level={2}>{`${selectedDate?.format('YYYY-MM-DD')} 空位狀況`}</Title>
                  <List itemLayout="horizontal" dataSource={campsiteCountInfo}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <InputNumber min={0} defaultValue={0} max={item.availableCount}  onChange={value => handleQuantityChange(item.id, value)}/>,
                        ]}
                      >
                        <List.Item.Meta title={item.areaName} >
                        </List.Item.Meta>
                        <div>剩餘幾{item.availableCount}間</div>
                      </List.Item>
                    )}/>
                </Col>
              </Row>
              <Divider orientation="left">
                <Title level={2}>營區選擇</Title>
              </Divider>
              <Row
                className="campsite-row"
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                {product.campsite?.length > 0 ? (
                  product.campsite.map((campsite) => {
                    const currentIndex = campsitePhotosIndex[campsite.areaName] || 0;
                    return (
                      <Col
                        key={campsite.areaName}
                        xs={24}
                        sm={12}
                        md={12}
                        lg={8}
                        xl={6}
                      >
                        <div key={campsite.areaName}>
                          <div className="campsite-carousel">
                            <Button
                              className="campsite-prevButton"
                              onClick={() => handleCampsitePhotoPrevClick(campsite.areaName)}
                              shape="circle"
                              icon={<CaretLeftOutlined />}
                            />
                            <img
                              src={
                                campsite.campsitePhotos[currentIndex].img
                              }
                              alt="營區圖片"
                              className="card-img-top rounded-0 object-cover"
                              height={300}
                            />
                            <Button
                              className="campsite-nextButton"
                              onClick={() => handleCampsitePhotoNextClick(campsite.areaName)}
                              shape="circle"
                              icon={<CaretRightOutlined />}
                            />
                          </div>
                          <h2 className="mb-0 mt-2">{campsite.areaName}</h2>
                          <p className="price-font">
                            平日價格: ${campsite.weekdayPrice}
                          </p>
                          <p className="price-font">
                            假日價格: ${campsite.holidayPrice}
                          </p>
                          <Tag color="magenta">
                            surfaceType: {campsite.surfaceType}
                          </Tag>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <p>
                    無營地資料 <Empty />
                  </p>
                )}
              </Row>
            </Typography>
          ) : (
            <Spin tip="Loading" size="large" />
          )}
        </Content>
        <Footer className="footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CampDetail;
