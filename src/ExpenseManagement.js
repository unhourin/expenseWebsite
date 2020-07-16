import React from "react";
import {
  Row,
  Col,
  OverlayTrigger,
  Dropdown,
  Table,
  Button,
  InputGroup,
  FormControl,
  Tooltip,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
export default class ExpenseMangament extends React.Component {
  state = {
    DEFAULTDATA: [],
    ALLDATA: [],
    isAllCheck: false,
    printList: [],
    searchText: "",
  };

  handleSearchText = (text) => {
    this.setState({
      searchText: text.target.value,
    });
  };

  componentDidMount() {
    let DATA = require("./data/station.json");
    DATA.forEach((item) => {
      item.isCheck = "false";
    });
    this.setState({
      DEFAULTDATA: DATA,
      ALLDATA: DATA,
    });
  }

  runSelect = () => {
    this.state.ALLDATA = this.state.DEFAULTDATA;
    var temp = this.state.ALLDATA.filter((item) => {
      return item.station_name.toUpperCase().includes(this.state.searchText);
    });

    this.setState({
      // 画面更新
      ALLDATA: temp,
    });
  };

  isAllCheck() {
    if (this.state.isAllCheck === false) {
      this.state.printList = [];
      this.state.ALLDATA.forEach((i) => {
        i.checked = true;
        this.state.printList.push(i.station_cd);
      });
      this.state.isAllCheck = true;
    } else {
      this.state.ALLDATA.forEach((i) => {
        i.checked = false;
        this.state.printList.pop();
      });
      this.state.isAllCheck = false;
    }
    this.setState({
      // 画面更新
      ALLDATA: this.state.ALLDATA,
      isAllCheck: this.state.isAllCheck,
    });
  }

  checkThis(item) {
    item.checked = !item.checked;
    if (item.checked == true) {
      this.state.printList.push(item.station_cd);
    } else {
      this.state.printList.map((x) => {
        if (x === item.station_cd) {
          this.state.printList.splice(this.state.printList.indexOf(x), 1);
        }
      });
    }
    let result = this.state.ALLDATA.some((j) => {
      if (!j.checked) {
        return true;
      } else {
        return false;
      }
    });

    if (result) {
      this.state.isAllCheck = false;
    } else {
      this.state.isAllCheck = true;
    }

    this.setState({
      // 画面更新
      printList: this.state.printList,
      ALLDATA: this.state.ALLDATA,
      isAllCheck: this.state.isAllCheck,
    });
  }

  runPrint = () => {
    alert(this.state.printList);
  };

  reportApplicationMsg = () => {
    fetch("http://127.0.0.1:3001/pushMessage", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        alert(data.msg);
      });
  };

  render() {
    let _self = this;
    return (
      <>
        <div style={{ marginLeft: 15 }}>
          <Row style={{ backgroundColor: "#FFFFFF" }}>
            <Col xs="5" style={{ backgroundColor: "##FFFFFF" }}>
              <Row style={{ fontSize: 15 }}>
                <Col xs="4">対象月</Col>
                <Col xs="4">申請状態</Col>
                <Col xs="4">確認状況</Col>
              </Row>

              <Row style={{ fontSize: 5 }}>
                <Col xs="4">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-basic"
                    >
                      2020年7月
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        Another action
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3">
                        Something else
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-basic"
                    >
                      全て
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-2">未申請</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">申請済み</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-basic"
                    >
                      全て
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-2">未確認</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">確認済み</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>

            <Col xs="3" style={{ backgroundColor: "#FFFFFF" }}>
              <Row>
                <Col>
                  <OverlayTrigger
                    key={"top"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"top"}`}>
                        未申請の人にメッセージを送信
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-secondary"
                      style={{ fontSize: 1 }}
                      onClick={this.reportApplicationMsg}
                    >
                      メッセージ送信
                    </Button>
                  </OverlayTrigger>
                </Col>
                <Col>
                  <OverlayTrigger
                    key={"top"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"top"}`}>
                        チェック済の請求書を印刷
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-secondary"
                      style={{ fontSize: 1 }}
                      onClick={this.runPrint}
                    >
                      チェック済印刷
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Col>

            <Col xs="4" style={{ backgroundColor: "#FFFFFF" }}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="search station_name"
                  onChange={this.handleSearchText}
                />
                <InputGroup.Append>
                  <Button variant="outline-secondary" onClick={this.runSelect}>
                    検索
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Table>
              <thead></thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={_self.isAllCheck.bind(_self)}
                      checked={this.state.isAllCheck || ""}
                    />
                  </td>
                  <td>station_cd</td>
                  <td>station_g_cd</td>
                  <td>station_name</td>
                  <td>station_name_k</td>
                  <td>station_name_r</td>
                  <td>line_cd</td>
                  <td>pref_cd</td>
                  <td>post</td>
                  <td>lon</td>
                  <td>lat</td>
                  <td>open_ymd</td>
                  <td>close_ymd</td>
                  <td>e_status</td>
                  <td>e_sort</td>
                </tr>
                {this.state.ALLDATA.length
                  ? this.state.ALLDATA.map(function (item, index) {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              onChange={_self.checkThis.bind(_self, item)}
                              checked={item.checked || ""}
                            />
                          </td>
                          <td>{item.station_cd}</td>
                          <td>{item.station_g_cd}</td>
                          <td>{item.station_name}</td>
                          <td>{item.station_name_k}</td>
                          <td>{item.station_name_r}</td>
                          <td>{item.line_cd}</td>
                          <td>{item.pref_cd}</td>
                          <td>{item.post}</td>
                          <td>{item.lon}</td>
                          <td>{item.lat}</td>
                          <td>{item.open_ymd}</td>
                          <td>{item.close_ymd}</td>
                          <td>{item.e_status}</td>
                          <td>{item.e_sort}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </Row>

          <Row style={{ backgroundColor: "#FFFFFF" }}>もし区切りあったら</Row>
        </div>
      </>
    );
  }
}
