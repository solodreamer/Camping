import React from "react";
import { Col, Row, } from "antd";
import "./checkDetail.css";

function CheckDetail({result}) {
    return (
      <div>
      {result? (
        <div className="check-detail">
          <div className="check-order">
            <Row>
              <Col xs={24} sm={18} md={24} lg={24} xl={18}><div className="check-title">{result.campName}</div></Col>
              <Col xs={24} sm={6} md={24} lg={24} xl={6}><div className="check-title">{result.areaName}</div></Col>
            </Row>
            <div>
              <div className="checktt-date">
                <span>{result.dateRange[0]}</span>
                <span> 至 </span>
                <span>{result.dateRange[1]}</span>
              </div>
              {result.amountDetail?.map((detail) => {
                return (
                  <div className="check-area-numb">
                    <span>${detail.price}</span>
                    <span class="ml-3 mr-3"> x</span>
                    <span>{detail.count}晚</span>
                </div>
                )          
              })}
            </div>
          </div>
        </div>
      ) 
      : (<div className="check-detail">目前清單沒有任何訂位唷！</div>)}
      </div>
    );
  }


  export default CheckDetail;