import React from "react";
import suica_img from "./img/suica.png";
import ExpenseMangament from "./ExpenseManagement";

import { Row, Col, Button, Dropdown, Image, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./ExpenseDetails.css";
import axios from "axios";
import qs from "qs";
import moment from "moment";

import Popup from "react-popup";

export default class ExpenseDetails extends React.Component {
  state = {
    DEFAULTEDATA: [],
    ALLDATA: [],
    employee_id: "",
    employee_name: "",
    total: 0,
    expense_id: "",
    thisMonth: moment().month() + 1,
    thisYear: moment().year(),
    isConfirmShow: false,
    isPushBackShow: false,
    pushBackMsg: "",
    pushBy: "総務部",
  };
  getExpenseData = async () => {
    // const expenseId = getUrlToken('token', peops.location.search);
    let { expense_id, employee_id, employee_name } = this.props.match.params;
    this.setState({
      employee_id: employee_id,
      employee_name: employee_name,
      expense_id: expense_id,
    });
    let url = "http://127.0.0.1:3001/expense/" + expense_id;
    await axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        data.forEach((item) => {
          this.state.total += item.charge;
          this.timeFormat(item);
        });
        this.setState({
          DEFAULTEDATA: data,
          ALLDATA: data,
          total: this.state.total,
        });
      });
  };

  timeFormat = (item) => {
    if (item.starting_time != null)
      item.starting_time = moment(item.starting_time).format("YYYY-MM-DD");
    if (item.end_time != null)
      item.end_time = moment(item.end_time).format("YYYY-MM-DD");
    if (item.created_at != null)
      item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
  };

  componentDidMount() {
    this.getExpenseData();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("nextProps:", nextProps)
  //     console.log("nextState:", nextState)
  //     if (nextProps.history.location.length > 9)
  //         return true
  //     else
  //         return false
  //     // if (this.props.num === nextProps.num) {
  //     //     //不做渲染
  //     //     return false
  //     // }
  // }

  showCommuterPassExpense = () => {
    let DATA = this.state.ALLDATA;
    // if (DATA.length != 0) {
    //     DATA.map((item) => {
    //         console.log(item)
    return (
      <Col>
        {DATA.map((item, index) => {
          if (item.expense_type === 1)
            return (
              <Row key={index}>
                <Col md="3">
                  {item.starting_time}--{item.end_time}
                </Col>
                <Col md="3">{item.starting_point}</Col>
                <Col md="3">{item.end_point}</Col>
                <Col md="1">￥{item.charge}</Col>
              </Row>
            );
        })}
      </Col>
    );
  };

  showCommonExpense = () => {
    let DATA = this.state.ALLDATA;
    return (
      <Col>
        {DATA.map((item, index) => {
          // if (item.expense_type === 2)
          //     return (
          //         <Row key={index}>
          //             <Col>{item.bought_time}</Col>
          //             <Col>{item.end_time}</Col>
          //             <Col>{item.starting_point}</Col>
          //             <Col>{item.end_point}</Col>
          //             <Col>{item.charge}</Col>
          //         </Row>
          //     )
          // else if (item.expense_type === 2)
          switch (item.expense_type) {
            case 2: {
              return (
                <Row key={index}>
                  <Col>交通費：</Col>
                  <Col>{item.bought_time}</Col>
                  <Col>{item.end_time}</Col>
                  <Col>{item.starting_point}</Col>
                  <Col>{item.end_point}</Col>
                  <Col>￥{item.charge}</Col>
                </Row>
              );
            }
            case 3: {
              return (
                <Row key={index}>
                  <Col>その他：</Col>
                  <Col>{item.bought_time}</Col>
                  <Col>{item.content}</Col>
                  <Col>￥{item.charge}</Col>
                </Row>
              );
            }
          }
        })}
      </Col>
    );
  };

  showPicture = () => {
    let DATA = this.state.ALLDATA;
    // if (DATA.length != 0) {
    //     DATA.map((item) => {
    //         console.log(item)
    return (
      <Col style={{ padding: 60 }}>
        {DATA.map((item, index) => {
          return (
            <Row key={index} style={{ padding: 20 }}>
              <Row>添付{index + 1}</Row>
              <Row>
                <Image width="100%" src={item.image_base64} />
              </Row>
            </Row>
          );
        })}
      </Col>
    );
  };

  goBackButton = () => {
    this.props.history.push("/expense");
  };

  pushBackButton = () => {
    this.setState({ isPushBackShow: true });
  };
  handlePushBackMsg = (text) => {
    this.setState({ pushBackMsg: text.target.value });
  };
  handlePushBy = (text) => {
    this.setState({ pushBy: text.target.value });
  };

  pushBackAppMsg = () => {
    let _self = this;
    let url = "http://127.0.0.1:3001/expense/pushMessage";
    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: `employeeIdList=${this.state.employee_id}&message=${this.state.pushBackMsg}&pushBy=${this.state.pushBy}&returnData=${this.state.ALLDATA}`,
    // }).then(function (response) {
    //
    // });
    let data = qs.stringify({
      employeeIdList: this.state.employee_id,
      message: this.state.pushBackMsg,
      pushBy: this.state.pushBy,
      expense_id: this.state.expense_id,
    });
    axios({
      method: "post",
      url: "http://127.0.0.1:3001/expense/pushMessage",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    })
      .then(function (response) {
        _self.setState({
          pushBy: "総務部",
          backMsg: "",
          isPushBackShow: false,
        });
        _self.props.history.push("/expense");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  confirmReportExpense = () => {
    let url =
      "http://127.0.0.1:3001/expense/expenseConfirm/" + this.state.expense_id;
    axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        this.props.history.push("/expense");
      });
    this.setState({
      isConfirmShow: false,
    });
  };

  confirmButton = () => {
    this.setState({ isConfirmShow: true });
  };

  show = () => {
    let { ALLDATA } = this.state;
    console.log("ALL:", ALLDATA);
    return (
      <>
        <header className="detailsHeader">
          <div className="detailsTitleArea">
            <p className="detailsTitle">詳細画面</p>
          </div>
        </header>
        <main className="detailsMain">
          <div className="detailsMainArea">
            <dir className="detailsDropDown">
              <div style={{ display: "inline-block" }}>
                <Dropdown>
                  <Dropdown.Toggle
                    className="detailsDropDownContent"
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    {this.state.thisYear}年
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item> {this.state.thisYear - 1}年</Dropdown.Item>
                    <Dropdown.Item> {this.state.thisYear - 2}年</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div style={{ display: "inline-block" }}>
                <Dropdown>
                  <Dropdown.Toggle
                    className="detailsDropDownContent"
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    {this.state.thisMonth}月分
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>7月分</Dropdown.Item>
                    <Dropdown.Item>8月分</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </dir>
            <div className="claimTitleArea">
              <p className="claimTitle">{this.state.thisMonth}月分 請求書</p>
            </div>
            <div className="claimSheetArea">
              <div className="claimEmployeeArea">
                <p className="claimEmployeeID">
                  社員ID:
                  <label style={{ margin: 0, paddingLeft: 20 }}>
                    {this.state.employee_id}
                  </label>
                </p>
                <p className="claimEmployeeName">
                  社員名：{this.state.employee_name}
                </p>
              </div>
              <div className="claimDayArea"></div>

              <div className="detailsLine"></div>

              <div className="detailsPassArea">
                <p className="detailsPassTitle">定期券額の請求</p>
                {this.showCommuterPassExpense()}
              </div>

              <div className="detailsLine"></div>

              <div className="detailsOtherArea">
                <p className="detailsOtherTitle">その他の請求</p>
                {this.showCommonExpense()}
              </div>

              <div className="detailsLine"></div>

              <div className="detailsTotalArea">
                <p className="detailsTotal">合計￥{this.state.total}</p>
              </div>
            </div>

            <div className="evidenceTitleArea">
              <p className="evidenceTitle">エビデンス</p>
            </div>

            <div className="evidenceSheetArea">{this.showPicture()}</div>

            <div className="buttonGroup">
              <Button
                className="buttonReturn"
                onClick={() => this.goBackButton()}
              >
                戻る
              </Button>
              <Button
                className="buttonRemand"
                onClick={() => this.pushBackButton()}
              >
                差し戻し
              </Button>
              <Button
                className="buttonApproval"
                onClick={() => this.confirmButton()}
              >
                承認
              </Button>
            </div>
          </div>
        </main>
        <footer className="detailsFooter"></footer>
        <Alert
          show={this.state.isConfirmShow}
          variant="danger"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-100%)",
          }}
        >
          <Alert.Heading>警告</Alert.Heading>
          <p>この経費を承認しますか？</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => this.setState({ isConfirmShow: false })}
              variant="outline-danger"
            >
              承認しない
            </Button>
            <Button
              onClick={() => this.confirmReportExpense()}
              variant="outline-danger"
            >
              承認する
            </Button>
          </div>
        </Alert>

        <Alert
          show={this.state.isPushBackShow}
          variant="info"
          style={{
            width: 500,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-100%)",
          }}
        >
          <Alert.Heading>差し戻し</Alert.Heading>
          <p>メッセージを入力してください。</p>
          <Row style={{ marginBottom: 10 }}>
            <Col md="3">通知者：</Col>
            <Col>
              <input
                type="text"
                value={this.state.pushBy}
                onChange={(text) => this.handlePushBy(text)}
              />
            </Col>
          </Row>
          <textarea
            rows="6"
            style={{ width: "100%", OVERFLOW: "hidden" }}
            value={this.state.pushBackMsg}
            onChange={(text) => this.handlePushBackMsg(text)}
          />
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => this.setState({ isPushBackShow: false })}
              variant="outline-info"
            >
              発信しない
            </Button>
            <Button
              onClick={() => this.pushBackAppMsg()}
              variant="outline-info"
            >
              発信する
            </Button>
          </div>
        </Alert>
      </>
    );
  };

  render() {
    return this.show();
  }
}
