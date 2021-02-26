import React from "react";
import "./styles.css";
import { Card, Row, Col, Input, Checkbox, Typography } from "antd";
import "antd/dist/antd.css";
import _default from "antd/lib/checkbox/Group";
import CardList from "./cardList";

const { Title } = Typography;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hdEnabled: false,
      oneWayEnabled: false,
      searchTxt: "",
      list: [],
      popularList: [],
      otherList: [],
      loading: false
    };
  }
  componentDidMount() {
    fetch("https://api.zoomcar.com/v4/cities?platform=web")
      .then((res) => res.json())
      .then((jsonData) => {
        let citiesList = jsonData.cities;
        // let popularCitiesList = [];
        // let otherCitiesList = [];
        // citiesList.map((item) => {
        //   if (item.popular) {
        //     popularCitiesList.push(item);
        //   } else {
        //     otherCitiesList.push(item);
        //   }
        // });
        this.setState(
          {
            list: citiesList,
            loading: true
            // popularList: popularCitiesList,
            // otherList: otherCitiesList
          },
          () => this.dataFilter()
        );
      });
  }

  onChangeCheckBox = (value, fieldName) => {
    console.log("value", value, fieldName);
    this.setState(
      {
        [fieldName]: value,
        loading: true
      },
      () => this.dataFilter()
    );
  };

  dataFilter = () => {
    const { list, hdEnabled, oneWayEnabled } = this.state;
    let popularCitiesList = list.filter(
      (item) =>
        item.popular == true &&
        item.hd_enabled == hdEnabled &&
        item.one_way_enabled == oneWayEnabled
    );
    let otherCitiesList = list.filter(
      (item) =>
        item.popular == false &&
        item.hd_enabled == hdEnabled &&
        item.one_way_enabled == oneWayEnabled
    );
    console.log(
      "hdEnabled",
      hdEnabled,
      "oneWayEnabled",
      oneWayEnabled,
      "checkbox",
      popularCitiesList,
      otherCitiesList
    );
    this.setState({
      popularList: popularCitiesList,
      otherList: otherCitiesList,
      loading: false
    });
  };

  searchFilter = (value, fieldName) => {
    this.setState(
      {
        [fieldName]: value,
        loading: true
      },
      () => {
        const { popularList, otherList } = this.state;
        if (value) {
          let keyword = value.toLowerCase();
          let filtered_popularList = popularList.filter((item, index) => {
            item.name = item.name.toLowerCase();
            return popularList[index]["name"].indexOf(keyword) > -1;
          });
          let filtered_otherList = otherList.filter((item, index) => {
            item.name = item.name.toLowerCase();
            return otherList[index]["name"].indexOf(keyword) > -1;
          });
          this.setState({
            popularList: filtered_popularList,
            otherList: filtered_otherList,
            loading: false
          });
        } else {
          this.dataFilter();
        }
      }
    );
  };

  render() {
    const {
      list,
      popularList,
      otherList,
      hdEnabled,
      oneWayEnabled,
      searchTxt,
      loading
    } = this.state;
    console.log("list", list, popularList, otherList);
    return (
      <div className="App">
        <Row gutter={[16, 16]} justify="center" align="middle" wrap>
          <Title>Cities</Title>
        </Row>
        <Row gutter={[16, 16]} justify="space-between" align="middle" wrap>
          <Col lg={{ span: 6 }} xs={{ span: 24 }}>
            <Input
              placeholder="Search City"
              value={searchTxt}
              onChange={(e) => this.searchFilter(e.target.value, "searchTxt")}
            />
          </Col>
          <Col lg={{ span: 6 }} xs={{ span: 24 }}>
            <Checkbox
              checked={hdEnabled}
              onChange={(e) =>
                this.onChangeCheckBox(e.target.checked, "hdEnabled")
              }
            >
              HD ENABLED
            </Checkbox>
            <Checkbox
              checked={oneWayEnabled}
              onChange={(e) =>
                this.onChangeCheckBox(e.target.checked, "oneWayEnabled")
              }
            >
              ONE WAY ENABLED
            </Checkbox>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          justify="start"
          align="middle"
          style={{ padding: "30px 10px" }}
        >
          <Title level={3}>Popular</Title>
        </Row>
        <CardList dataList={popularList} loading={loading} />
        <Row
          gutter={[16, 16]}
          justify="start"
          align="middle"
          style={{ padding: "30px 10px" }}
        >
          <Title level={3}>Other</Title>
        </Row>
        <CardList dataList={otherList} loading={loading} />
      </div>
    );
  }
}
