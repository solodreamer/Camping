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
  Card,
} from "antd";

import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  EditFilled,
} from "@ant-design/icons";

import { QueryFilter, ProFormDateRangePicker } from '@ant-design/pro-components';

import "./campDetail.css";
import { api, setAuthToken } from "../api";
import dayjs from "dayjs";

//Antd元件屬性設定
const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

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
  //定義狀態來儲存日期範圍
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1,'day')]);
  //定義狀態來儲存已選取的campsite
  const [selectedCampsites, setSelectedCampsites] = useState([]);
  //定義狀態儲存campsiteId清單是否載入中
  const [isLoading, setLoading] = useState(false);
  //定義狀態儲存總訂位數量
  const [count, setCount] = useState(0);
  //定義狀態儲存是否禁用預定button
  const [isbookDisable, setBookDisable] = useState(true);

  /**
   * 取得營地資訊
   * @param {*} id 營地ID
   */
  const getCampDetail = async (id) => {
    const productRes = await api.get(`/v1/camps/${id}`);
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
   * @param {*} name //營區名稱
   */
  const handleCampsitePhotoPrevClick = (name) => {
    setCampsitePhotosIndex((prevState) => {
      const currentIndex = prevState[name] || 0;
      console.log(`Current prevState:`, prevState); // 輸出目前的照片索引
      console.log(`Current index for ${name}:`, currentIndex); // 輸出目前的照片索引
      const campsite = product.area.find((c) => c.name === name);
      const newIndex = (currentIndex - 1 + campsite.areaImage.length) % campsite.areaImage.length;
      console.log(`newIndex:`, newIndex); // 輸出目前的照片索引
      return { ...prevState, [name]: newIndex };
    });
  };

  /**
   * 營區照片下一張
   * @param {*} name //營區名稱
   */
  const handleCampsitePhotoNextClick = (name) => {
    setCampsitePhotosIndex((prevState) => {
      const currentIndex = prevState[name] || 0;
      console.log(`Current index for ${name}:`, currentIndex); // 輸出目前的照片索引
      const campsite = product.area.find((c) => c.name === name);
      const newIndex = (currentIndex + 1) % campsite.areaImage.length;
      return { ...prevState, [name]: newIndex };
    });
  };

  /**
   * 取得單一營位可訂位日期
   * @param {*} param 
   */
  const getAvailableCampsite = async (param) => {
    const availableRes = await api.post('/v1/camps/available', param);
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
    setSelectedCampsites([]);
    onFilterSearch();
  }

  /**
   * 取得單一營位可訂位數量
   * @param {*} param 
   */
  const getCampsite_available = async (param) => {
    const campsiteCountInfo = await api.post('/v1/camps/campsite_available', param);

    if (campsiteCountInfo.data.success === true) {
      setCampsiteCountInfo(campsiteCountInfo.data.data);
      setLoading(false);
    }
  };

  /**
   * 特定條件查詢單一營位可訂位數量
   */
  const onFilterSearch = async () => {
    await waitTime(1000);
    setLoading(true);
    getCampsite_available({ 
      camp_id: id, 
      start_date: dayjs(dateRange[0]).format('YYYY-MM-DD').toString(),
      end_date: dayjs(dateRange[1]).format('YYYY-MM-DD').toString() 
    });
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
   * 計算總訂位數量
   * @param {*} id 
   * @param {*} value 
   */
  const handleQuantityChange = (id, value) => {
    setSelectedCampsites((prevSelectedCampsites) => {
      const updatedQuantites = prevSelectedCampsites.filter(item => item.camp_id !== id);
      if(value > 0) {
        updatedQuantites.push({ camp_id: id, count: value });
      }
      return updatedQuantites;
    });
  };

  /**
   * 呼叫存檔訂位api
   * @param {*} param 
   */
  const booking_camp_confirm = async(params,token)=> {
    try {
      if (token) {
        setAuthToken(token);
      } else {
        return;
      };
      const res = await api.post('/v1/booking_camp/confirm',params);
      if (res.data.success === true) {
        console.log("訂位成功", res);
      } else {
        console.log("訂位失敗", res.data.success);
      }
    }catch(error) {
      console.error('Error booking camp failed:', error);
    }
  };

 /**
  * 刷新token-api
  */
  const refreshToken = async (token) => {
    try {
      if (token) {
        setAuthToken(token);
      } else {
        return;
      };
      const res = await api.post('/v1/auth/login/refresh-token');
      token = res.data;
      console.log("[refreshToken]", token);
      localStorage.setItem('accessToken', token);
      if (token) {
        setAuthToken(token);
      };
    } catch(error) {
      console.error('Error refreshing token:', error);
    }
  }

  /**
   * 儲存訂位事件
   */
  const onSaveBooking = async() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log("未取得token，請重新登入");
      return;
    }
    const params = {
      start_date: dayjs(dateRange[0]).format('YYYY-MM-DD').toString(),
      end_date: dayjs(dateRange[1]).format('YYYY-MM-DD').toString(),
      booking_item: selectedCampsites
    };
    console.log("[儲存訂位參數]", params);
    await refreshToken(token);
    booking_camp_confirm(params,token);
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

  /**
   *  初始化查詢單一營位可訂位數量
   */
  useEffect(() => {
    onFilterSearch();
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

  useEffect(() => {
    console.log("[已選擇數量]", selectedCampsites);
    if(selectedCampsites.length > 0) {
      const total = selectedCampsites.reduce((sum, item) => sum + item.count,0);
      setCount(total);
    } else {
      setCount(0);
    }
  }, [selectedCampsites]);

  useEffect(() => {
    console.log("[總訂位數量]", count);
    if(count > 0) {
      setBookDisable(false);
    } else {
      setBookDisable(true);
    }
  }, [count]);


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
        <Header className="campdetail-headerStyle">Go露營</Header>
        <Content className="campdetail-contentStyle">
          {product ? (
            <Typography>
              <Divider />
              <Row >
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="campPhoto-carousel">
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
                        className="card-img-top rounded-0 object-cover"
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
              <Row gutter={[16,{ xs: 16, sm: 16}]}>
                <div  className="queryFilterStyle">
                  <QueryFilter defaultCollapsed submitter onFinish={onFilterSearch}>
                    <ProFormDateRangePicker name="dateRange" label="日期" value={dateRange}
                      fieldProps={{ disabledDate, inputReadOnly: true }} onChange={onDateChange}/>
                  </QueryFilter>
                </div>
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
                    // disabledDate={disabledDate}
                    fullscreen={true}
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="list-style">
                  <Spin tip="Loading..." spinning={isLoading}>
                  <List 
                    itemLayout="vertical" 
                    dataSource={campsiteCountInfo} 
                    bordered={true}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <InputNumber
                            size="large"
                            min={0} 
                            defaultValue={0} 
                            max={item.availableCount}
                            value={selectedCampsites.find(c => item.campsiteId === c.camp_id)?.count || 0}
                            onChange={value => handleQuantityChange(item.campsiteId, value)}/>,
                          <EditFilled />,
                        ]}
                      >
                        <List.Item.Meta title={item.areaName} ></List.Item.Meta>
                        {item.availableCount > 0 ? 
                        (<div className="available-count">剩餘 {item.availableCount} 間 !</div>) : 
                        (<div className="non-available-count"> 目前無空房 </div>)}
                      </List.Item>
                    )}/>
                    </Spin>
                    <div className="room-book-status">
                      <Row className="row-total-price">
                        <Col xs={12} sm={10} md={10} lg={10} xl={10}>總帳數:{count}</Col>
                        <Col xs={0} sm={2} md={2} lg={2} xl={2}>
                          <Divider type="vertical" orientation="left" style={{ borderColor:'#3b444f' }}/>
                        </Col>
                        <Col xs={12} sm={10} md={10} lg={10} xl={10} className="book-button">
                          <Button type="primary" disabled={isbookDisable} onClick={onSaveBooking}>現在預定</Button>
                        </Col>
                      </Row>
                    </div>
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
                {product.area?.length > 0 ? (
                  product.area.map((area) => {
                    const currentIndex = campsitePhotosIndex[area.name] || 0;
                    return (
                      <Col
                        key={area.name}
                        xs={24}
                        sm={12}
                        md={12}
                        lg={8}
                        xl={6}
                      >
                        <div key={area.name}>
                          <div className="campsite-carousel">
                            <Button
                              className="campsite-prevButton"
                              onClick={() => handleCampsitePhotoPrevClick(area.name)}
                              shape="circle"
                              icon={<CaretLeftOutlined />}
                            />
                            <img
                              src={
                                area.areaImage[currentIndex].url
                              }
                              alt="營區圖片"
                              className="card-img-top rounded-0 object-cover"
                              height={300}
                            />
                            <Button
                              className="campsite-nextButton"
                              onClick={() => handleCampsitePhotoNextClick(area.name)}
                              shape="circle"
                              icon={<CaretRightOutlined />}
                            />
                          </div>
                          <h2 className="mb-0 mt-2">{area.name}</h2>
                          <p className="price-font">
                            平日價格: ${area.price}
                          </p>
                          <p className="price-font">
                            假日價格: ${area.priceHoliday}
                          </p>
                          <Tag color="magenta">
                            surfaceType: {area.surfaceType}
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
        <Footer className="campdetail-footerStyle">
          Copyright ©{new Date().getFullYear()} Created by Go露營
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CampDetail;
