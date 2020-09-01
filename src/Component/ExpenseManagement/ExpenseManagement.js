import React from "react";
import {
  Row,
  Col,
  OverlayTrigger,
  Dropdown,
  Table,
  Button,
  FormControl,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import ApiUrl from "../../Api/ApiUrl";

import "bootstrap/dist/css/bootstrap.css";
import "./css/ExpenseManagement.css";
export default class ExpenseMangament extends React.Component {
  state = {
    DEFAULTDATA: [],
    ALLDATA: [],
    isAllCheck: false,
    printList: [],
    searchText: "",
  };

  handleSearchText = (text) => {
    this.state.ALLDATA = this.state.DEFAULTDATA;
    var temp = this.state.ALLDATA.filter((item) => {
      return item.employee_name.toUpperCase().includes(text.target.value);
    });

    this.setState({
      // 画面更新
      ALLDATA: temp,
    });
    this.setState({
      searchText: text.target.value,
    });
  };

  componentDidMount() {
    axios
      .get(ApiUrl.getExpenseSubmissonSituation)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data);
        data.forEach((item) => {
          let name = item.family_name + item.first_name;
          item.employee_name = name;
          item.isCheck = "false";
          this.timeFormat(item);
        });

        data.sort((a, b) => {
          return a.employee_id - b.employee_id;
        });
        this.setState({
          DEFAULTDATA: data,
          ALLDATA: data,
        });
      });
  }

  timeFormat = (item) => {
    if (item.starting_time != null)
      item.starting_time = moment(item.starting_time).format("YYYY-MM-DD");
    if (item.end_time != null)
      item.end_time = moment(item.end_time).format("YYYY-MM-DD");
    if (item.created_at != null)
      item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
  };

  runSelect = () => {};

  isAllCheck() {
    if (this.state.isAllCheck === false) {
      this.state.printList = [];
      this.state.ALLDATA.forEach((i) => {
        i.checked = true;
        this.state.printList.push(i.employee_id);
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
      this.state.printList.push(item.employee_id);
    } else {
      this.state.printList.map((x) => {
        if (x === item.employee_id) {
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
    console.log(this.state.printList);
    alert(this.state.printList);
  };

  reportApplicationMsg = () => {
    fetch(ApiUrl.pushNotifications, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `employeeIdList=${this.state.printList}`,
    }).then(function (response) {});
  };

  sortEmployeeNameUp = () => {
    //JSONデータを格納するための配列を用意する
    let SyainTmpData = this.state.DEFAULTDATA;
    function sortIdAsc(a, b) {
      if (a.Hurigana > b.Hurigana) {
        return 1;
      } else {
        return -1;
      }
    }
    SyainTmpData.sort(sortIdAsc);
    this.setState({ ALLDATA: SyainTmpData });
  };

  sortEmployeeNameDown = () => {
    //JSONデータを格納するための配列を用意する
    let SyainTmpData = this.state.DEFAULTDATA;

    function sortIdAsc(a, b) {
      if (a.Hurigana < b.Hurigana) {
        return 1;
      } else {
        return -1;
      }
    }
    SyainTmpData.sort(sortIdAsc);
    this.setState({ ALLDATA: SyainTmpData });
  };

  sortConfirmed = () => {
    let tmpData = this.state.DEFAULTDATA;
    tmpData.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
    this.setState({ ALLDATA: tmpData });
  };

  sortNotConfirmed = () => {
    let tmpData = this.state.DEFAULTDATA;
    console.log(tmpData.confirmed);
    tmpData.sort((a, b) => {
      return a.confirmed - b.confirmed;
    });
    this.setState({ ALLDATA: tmpData });
  };

  sortReported = () => {
    let tmpData = this.state.DEFAULTDATA;
    tmpData.sort((a, b) => {
      let x = 0;
      let y = 0;
      if (a.expense_id != null) x = a.expense_id.length;
      if (b.expense_id != null) y = b.expense_id.length;
      return y - x;
    });
    this.setState({ ALLDATA: tmpData });
  };

  sortNotReported = () => {
    let tmpData = this.state.DEFAULTDATA;
    tmpData.sort((a, b) => {
      let x = 0;
      let y = 0;
      if (a.expense_id != null) x = a.expense_id.length;
      if (b.expense_id != null) y = b.expense_id.length;
      return x - y;
    });
    this.setState({ ALLDATA: tmpData });
  };

  render() {
    //ソート用関数に渡す引数用の変数
    let _self = this;
    return (
      <>
        {/* ヘッダーエリア */}
        <header className="expenseHeader">
          <Row>
            <Col lg="2"></Col>
            <Col lg="8">
              <p className="expenseTitle">社員一覧画面</p>
            </Col>
            <Col lg="2"></Col>
          </Row>
        </header>
        {/* メインエリア */}
        <main>
          <Row>
            <Col lg="2"></Col>
            <Col lg="8">
              {/* 入力検索エリア */}
              <Row>
                <FormControl
                  className="inputText"
                  placeholder="社員名検索"
                  onChange={this.handleSearchText}
                />
              </Row>
              <Row>
                <Col lg="2">
                  {/* 並び替えドロップダウンエリア */}
                  <Dropdown>
                    <Dropdown.Toggle
                      className="expenseDropDown"
                      variant="outline-secondary"
                      id="dropdown-basic">
                      絞り込み
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={_self.sortNotReported}>
                        未提出
                      </Dropdown.Item>
                      <Dropdown.Item onClick={_self.sortReported}>
                        提出済み
                      </Dropdown.Item>
                      <Dropdown.Item onClick={_self.sortNotConfirmed}>
                        未承認
                      </Dropdown.Item>
                      <Dropdown.Item onClick={_self.sortConfirmed}>
                        承認済み
                      </Dropdown.Item>
                      <Dropdown.Item onClick={_self.sortEmployeeNameUp}>
                        社員名(昇順)
                      </Dropdown.Item>
                      {/* 社員名で降順で並べ替える */}
                      <Dropdown.Item onClick={_self.sortEmployeeNameDown}>
                        社員名(降順)
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col lg="6"></Col>
                {/* メッセージボタンエリア */}
                <Col lg="2">
                  <OverlayTrigger
                    key={"top"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"top"}`}>
                        未申請の人にメッセージを送信
                      </Tooltip>
                    }>
                    <Button
                      className="messageButton"
                      variant="outline-secondary"
                      onClick={() => this.reportApplicationMsg()}>
                      メッセージ送信
                    </Button>
                  </OverlayTrigger>
                </Col>
                <Col lg="2">
                  {/* チェック済み印刷ボタンエリア */}
                  <OverlayTrigger
                    key={"top"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-${"top"}`}>
                        チェック済の請求書を印刷
                      </Tooltip>
                    }>
                    <Button
                      className="messageButton"
                      variant="outline-secondary"
                      onClick={this.runPrint}>
                      チェック済印刷
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row>
                {/*社員申請情報テーブルエリア*/}
                <Table bordered hover className="employeeTableArea">
                  <thead>
                    <tr>
                      <td>確認</td>
                      <td colSpan="2">社員情報</td>
                      <td colSpan="4">申請情報</td>
                      <td colSpan="3">定期券情報</td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          onChange={_self.isAllCheck.bind(_self)}
                          checked={this.state.isAllCheck || ""}
                        />
                      </td>
                      <td>社員ID</td>
                      <td>社員名</td>
                      <td>今月分申請</td>
                      <td>総務確認</td>
                      <td>申請件数</td>
                      <td>申請総額</td>
                      <td>駅区間</td>
                      <td>定期期間</td>
                      <td>金額</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.ALLDATA.length
                      ? this.state.ALLDATA.map(function (item, index) {
                          let reportMsg = "未提出";
                          if (item.expense_id != null) {
                            reportMsg = "提出済み";
                          }
                          if (item.confirmed === -1) {
                            reportMsg = "差し戻し中";
                          }
                          return (
                            // <Link to='/details'>
                            <tr
                              className={
                                item.expense_id != null ? "" : "table-danger"
                              }
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (item.expense_id !== null)
                                  _self.props.history.push(
                                    "/details/" +
                                      item.employee_id +
                                      "/" +
                                      item.employee_name
                                  );
                              }}>
                              <td
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}>
                                <input
                                  type="checkbox"
                                  onChange={_self.checkThis.bind(_self, item)}
                                  checked={item.checked || ""}
                                />
                              </td>
                              <td>{item.employee_id}</td>
                              <td>{item.employee_name}</td>
                              <td>{reportMsg}</td>
                              <td>
                                {item.confirmed === 1 ? "承認済み" : "未承認"}
                              </td>

                              <td>
                                {item.expense_sum != null
                                  ? item.expense_sum
                                  : "-"}
                              </td>
                              <td>{item.total != null ? item.total : "-"}</td>
                              <td>
                                <p>
                                  {item.starting_point != null
                                    ? item.starting_point
                                    : "-"}
                                </p>
                                <p>
                                  {item.end_point != null
                                    ? item.end_point
                                    : "-"}
                                </p>
                              </td>
                              <td>
                                {" "}
                                <p>
                                  {item.starting_time != null
                                    ? item.starting_time
                                    : "-"}
                                </p>
                                <p>
                                  {item.end_time != null ? item.end_time : "-"}
                                </p>
                              </td>
                              <td>{item.charge != null ? item.charge : "-"}</td>
                            </tr>

                            // </Link>
                          );
                        })
                      : null}
                  </tbody>
                </Table>
              </Row>
            </Col>
            <Col lg="2"></Col>
          </Row>
        </main>
        <footer>
          <Row></Row>
        </footer>
      </>
    );
  }
}
