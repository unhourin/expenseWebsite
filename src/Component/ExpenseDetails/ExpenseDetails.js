import React from "react";
// import suica_img from "./img/suica.png";

import { Row, Col, Button, Image, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./css/ExpenseDetails.css";
import axios from "axios";
import qs from "qs";
import moment from "moment";

import ApiUrl from "../../Api/ApiUrl";

export default class ExpenseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      confirmed: 0,
    };
  }

  getExpenseData = () => {
    // const expenseId = getUrlToken('token', peops.location.search);
    let { employee_id, employee_name } = this.props.match.params;
    this.setState({
      employee_id: employee_id,
      employee_name: employee_name,
    });
    axios
      .get(
        ApiUrl.getDetailData +
          employee_id +
          "/" +
          this.state.thisYear +
          "/" +
          this.state.thisMonth
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (data.length !== 0) {
          data.forEach((item) => {
            this.state.total += Number(item.charge);
            this.timeFormat(item);
          });
          this.setState({
            DEFAULTEDATA: data,
            ALLDATA: data,
            total: this.state.total,
            confirmed: data[0].confirmed,
            expense_id: data[0].expense_id,
          });
        }
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

  UNSAFE_componentWillMount() {
    console.log("被生成");
  }
  componentDidMount() {
    this.getExpenseData();
  }

  showCommuterPassExpense = () => {
    let DATA = this.state.ALLDATA;
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
    let data = qs.stringify({
      employeeIdList: this.state.employee_id,
      message: this.state.pushBackMsg,
      pushBy: this.state.pushBy,
      expense_id: this.state.expense_id,
      year: this.state.thisYear,
      month: this.state.thisMonth,
    });
    axios({
      method: "post",
      url: ApiUrl.pushNotifications,
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
    axios
      .get(ApiUrl.confirmExpense + this.state.expense_id)
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
    return (
      <>
        <header className="detailsHeader">
          <Row>
            <Col lg="2"></Col>
            <Col lg="8" style={{ padding: 0 }}>
              <h1 className="expenseTitle">詳細画面</h1>
            </Col>
            <Col lg="2"></Col>
          </Row>
        </header>
        <main>
          <Row>
            <Col lg="3"></Col>
            <Col lg="6" style={{ textAlign: "right" }}>
              <Button className="buttonHistory">履歴</Button>
            </Col>
            <Col lg="3"></Col>
          </Row>
          <Row>
            <Col lg="3"></Col>
            <Col lg="6" className="expenseDetailsArea">
              <Row>
                <Col lg className="detailsExpenseTitle">
                  {this.state.thisMonth}月分 請求書
                </Col>
              </Row>
              <Row>
                <Col lg className="detailsBoderCol"></Col>
              </Row>
              <Row>
                <Col lg className="detailsExpenseEmployeeLeft">
                  社員ID
                </Col>
                <Col lg className="detailsExpenseEmployee">
                  {this.state.employee_id}
                </Col>
                <Col lg></Col>
                <Col lg></Col>
                <Col lg className="detailsExpenseDay">
                  申請日付
                </Col>
              </Row>
              <Row>
                <Col lg className="detailsExpenseEmployeeLeft">
                  社員名
                </Col>
                <Col lg className="detailsExpenseEmployee">
                  {this.state.employee_name}
                </Col>
                <Col lg></Col>
                <Col lg></Col>
                <Col lg className="detailsExpenseDay">
                  2020-{this.state.thisMonth}-17
                </Col>
              </Row>
              <Row>
                <Col lg className="detailsBoderCol"></Col>
              </Row>
              <Row>
                <Col lg className="seesonPassTitle">
                  定期券額の請求
                </Col>
              </Row>
              <Row>
                <Col lg className="detailsExpenseContentTitleLeft">
                  開始日
                </Col>
                <Col lg className="detailsExpenseContentTitle">
                  終了日
                </Col>
                <Col lg className="detailsExpenseContentTitle">
                  出発駅
                </Col>
                <Col lg className="detailsExpenseContentTitle">
                  到着駅
                </Col>
                <Col lg className="detailsExpenseStatementTitle">
                  金額
                </Col>
              </Row>
              {ALLDATA.map((item, index) => {
                if (item.expense_type === 1) {
                  return (
                    <Row key={index}>
                      <Col lg className="detailsExpenseContentLeft">
                        {item.starting_time}
                      </Col>
                      <Col lg className="detailsExpenseContent">
                        {item.end_time}
                      </Col>
                      <Col lg className="detailsExpenseContent">
                        {item.starting_point}
                      </Col>
                      <Col lg className="detailsExpenseContent">
                        {item.end_point}
                      </Col>
                      <Col lg className="detailsExpenseStatement">
                        ￥{item.charge}
                      </Col>
                    </Row>
                  );
                }
              })}

              <Row>
                <Col lg className="detailsBoderCol"></Col>
              </Row>
              <Row>
                <Col lg className="seesonPassTitle">
                  その他の請求
                </Col>
              </Row>
              <Row>
                <Col lg className="detailsExpenseContentTitleLeft">
                  項目
                </Col>
                <Col lg className="detailsExpenseContentTitle">
                  購入日
                </Col>
                <Col lg className="detailsExpenseContentTitle">
                  内容
                </Col>
                <Col lg className="detailsExpenseContentTitle"></Col>
                <Col lg className="detailsExpenseStatementTitle">
                  金額
                </Col>
              </Row>
              {ALLDATA.map((item, index) => {
                if (item.expense_type !== 1)
                  return (
                    <Row key={index}>
                      <Col lg className="detailsExpenseContentLeft">
                        {item.content}
                      </Col>
                      <Col lg className="detailsExpenseContent">
                        {item.bought_time}
                      </Col>
                      <Col lg className="detailsExpenseContent">
                        SF:{item.starting_point}~{item.end_point}
                      </Col>
                      <Col lg className="detailsExpenseContent"></Col>
                      <Col lg className="detailsExpenseStatement">
                        ￥{item.charge}
                      </Col>
                    </Row>
                  );
              })}
              <Row>
                <Col lg className="detailsBoderCol"></Col>
              </Row>
              <Row>
                <Col lg className="seesonPassTitle">
                  合計
                </Col>
                <Col lg></Col>
                <Col lg></Col>
                <Col lg className="detailsExpenseStatement">
                  ￥{this.state.total}
                </Col>
              </Row>
            </Col>
            <Col lg="3"></Col>
          </Row>
          <Row>
            <Col lg="3"></Col>
            <Col lg="6" className="expenseEvidenceArea">
              <Row>
                <Col className="detailsExpenseTitle">エビデンス</Col>
              </Row>
              {ALLDATA.map((item, index) => {
                return (
                  <>
                    <Row key={index}>
                      <Col lg className="detailsEvidenceContent">
                        添付1
                      </Col>
                      <Col lg></Col>
                      <Col lg></Col>
                      <Col lg></Col>
                    </Row>
                    <Row>
                      <Col className="evideceImg">
                        <img
                          className="imgSize"
                          src={item.image_base64}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </Col>
                    </Row>
                  </>
                );
              })}
            </Col>
            <Col lg="3"></Col>
          </Row>
          <Row className="detailsButtonGroup">
            <Col></Col>
            <Col></Col>
            <Col className="buttonReturnCol">
              <Button
                className="buttonReturn"
                onClick={() => this.goBackButton()}>
                戻る
              </Button>
            </Col>
            <Col className="buttonRemandCol">
              <Button
                disabled={
                  this.state.confirmed === -1 || this.state.confirmed === 1
                }
                className="buttonRemand"
                onClick={() => this.pushBackButton()}>
                差し戻し
              </Button>
            </Col>
            <Col className="buttonApprovalCol">
              <Button
                disabled={
                  this.state.confirmed === -1 || this.state.confirmed === 1
                }
                className="buttonApproval"
                onClick={() => this.confirmButton()}>
                承認
              </Button>
            </Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </main>
        <footer>
          <Row></Row>
        </footer>
        <Alert
          show={this.state.isConfirmShow}
          variant="danger"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-100%)",
          }}>
          <Alert.Heading>警告</Alert.Heading>
          <p>この経費を承認しますか？</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => this.setState({ isConfirmShow: false })}
              variant="outline-danger">
              承認しない
            </Button>
            <Button
              onClick={() => this.confirmReportExpense()}
              variant="outline-danger">
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
          }}>
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
              variant="outline-info">
              発信しない
            </Button>
            <Button
              onClick={() => this.pushBackAppMsg()}
              variant="outline-info">
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
