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
import "./ExpenseManagement.css";
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
    let DATA = require("./data/member.json");
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
      return item.member_name.toUpperCase().includes(this.state.searchText);
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
        this.state.printList.push(i.member_cd);
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
      this.state.printList.push(item.member_cd);
    } else {
      this.state.printList.map((x) => {
        if (x === item.member_cd) {
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

    //changeSort変数を初期化する
  
  //申請状況でソートする関数
  changeCheckSort(){

    var checkNumber=0;
    console.log(checkNumber);

  }

  //社員IDでソートする関数
　changeIdSort(){

  var checkNumber=1;
  console.log(checkNumber);

  }

  //社員名でソートする関数
　changeNameSort(){

  var checkNumber=2;
  console.log(checkNumber);

  }
  
  render() {

    //ソート用関数に渡す引数用の変数
    let _self = this;

    return (
      <>
        <div className="body">

          <div>
            <p className="title">社員一覧画面</p>
          </div>

          <div>
            <p className="line"></p>
          </div>

          <div className="inputGroup">
            
            {/* 申請状況でソートするためのもの */}
              <button
                className = "buttonContent"
                variant="outline-secondary"
                //クリックされたら関数呼び出し
                onClick={this.changeCheckSort}
              >
                申請状況
              </button>

              {/* IDでソートするためのボタン */}
              <Button
                className = "buttonContent"
                variant="outline-secondary"
                //クリックされたら関数呼び出し
                onClick={this.changeIdSort}
              >
                ID
              </Button>

              {/* 社員名でソートするためのボタン */}
              <Button
                className = "buttonContent"
                variant="outline-secondary"
                //クリックされたら関数呼び出し
                onClick={this.changeNameSort}
              >
                社員名
              </Button>

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
                className = "buttonContent"
                variant="outline-secondary"
                onClick={this.reportApplicationMsg}
              >
                メッセージ送信
              </Button>
            </OverlayTrigger>

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
                className = "buttonContent"
                variant="outline-secondary"
                onClick={this.runPrint}
              >
                チェック済印刷
              </Button>
            </OverlayTrigger>

            <InputGroup className="inputTextGroup">
              <FormControl
                className="inputText"
                placeholder="search member_name"
                onChange={this.handleSearchText}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={this.runSelect} className="inputButton">
                  検索
                </Button>
              </InputGroup.Append>
            </InputGroup>

            <div className="tableTextArea">
              <Table>
                <thead></thead>
                <tbody>
                  <tr className="trContent">
                    <td>
                      <input
                        className="checkBoxContent"
                        type="checkbox"
                        onChange={_self.isAllCheck.bind(_self)}
                        checked={this.state.isAllCheck || ""}
                      />

                    </td>
                    <td>ID</td>
                    <td>申請状況</td>
                    <td>申請状況</td>
                    <td>更新日</td>
                    <td>駅区間</td>
                    <td>定期期間</td>
                  </tr>

                  
                  {this.state.ALLDATA.length
                    ? this.state.ALLDATA.map(function (item, index) {

                      //申請状況を代入
                      let isColorCheck = item.申請状況;
                      var fontColor = "";
                      if(isColorCheck === "未"){
                        fontColor = 'red';
                      }

                      console.log(fontColor);
                      //未申請の人だけを赤くする
                      return (
                        <tr
                        style = {{ color: fontColor }}
                        key={index}
                        >
                          <td>
                            <input
                              className="checkBoxContent"
                              type="checkbox"
                              onChange={_self.checkThis.bind(_self, item)}
                              checked={item.checked || ""}
                            />
                          </td>
                          <td>{item.id}</td>
                          <td>{item.申請状況}</td>
                          <td>{item.社員名}</td>
                          <td>{item.更新日}</td>
                          <td>{item.駅区間}</td>
                          <td>{item.定期期間}</td>
                        </tr>
                      );
                      })
                    : null}
                </tbody>
              </Table>
            </div>
          </div>
          <Row style={{ backgroundColor: "#FFFFFF" }}>もし区切りあったら</Row>
        </div>
      </>
    );
  }
}
