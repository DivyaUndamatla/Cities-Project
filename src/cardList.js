import React from "react";
import { Card, Row, Col, Typography, Spin } from "antd";
import "antd/dist/antd.css";

const { Title } = Typography;
const { Meta } = Card;

export default function CardList(props) {
  const { dataList, loading } = props;
  console.log("dataList", dataList);
  return (
    <Row gutter={[16, 16]} justify="space-between" align="middle" wrap>
      {loading ? (
        <Col span={24}>
          <Spin style={{ textAlign: "center" }} />
        </Col>
      ) : dataList.length > 0 ? (
        dataList.map((item) => (
          <Col lg={{ span: 6 }} xs={{ span: 12 }}>
            <Card hoverable style={{ boxShadow: "1px 2px 7px -3px" }}>
              <img src={item.icon} alt="City" width="70px" height="70px" />
              <Meta title={item.name} style={{ paddingTop: "30px" }} />
            </Card>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <p style={{ textAlign: "center" }}>No Data</p>
        </Col>
      )}
    </Row>
  );
}
