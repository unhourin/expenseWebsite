import React, { useReducer } from "react";
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
  BreadcrumbItem,
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

        //検索するデータを用意
        let DATA = this.state.DEFAULTDATA

        var temp = DATA.filter((item) => {
          return item.社員名.includes(text.target.value);
        });
    
        this.setState({ALLDATA:temp})
    // //検索するデータを用意
    // let DATA = this.state.DEFAULTDATA
    // //検索後必要なデータを入れる配列を用意
    // let newData = []
    // DATA.map(v=>{
    //   //バリューの中に必要なものがった場合
    //   if(v.社員名.includes(text.target.value)){
    //     newData.push(v)
    //   }
    // })
    // this.setState({ALLDATA:newData})
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

  // runSelect = () => {
  //   this.state.ALLDATA = this.state.DEFAULTDATA;
  //   var temp = this.state.ALLDATA.filter((item) => {
  //     return item.社員名.toUpperCase().includes(this.state.searchText);
  //   });

  //   this.setState({
  //     // 画面更新
  //     ALLDATA: temp,
  //   });
  // };

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
    if (item.checked === true) {
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
  
  render() {

    //ソート用関数に渡す引数用の変数
    let _self = this;
    console.log(Item);
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

          <Dropdown>
            <Dropdown.Toggle className = "dropDownContent">
              申請状況
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* 未申請の人をうえに並べる */}
              <Dropdown.Item herg="#/action-2" onClick={() =>{
                
                //新しい配列を用意する
                let Uline_cd = []
                //マップを使ってALLDATAを読み込む(vが項目ごとでiがデータごと)
                this.state.ALLDATA.map((v, i) => {
                  if(v.申請状況 === "未"){
                    Uline_cd.push(v)
                  }
                });
                //setStateでALLDATAの中身を書き換える
                this.setState({ ALLDATA: Uline_cd })
                  this.state.ALLDATA.map((v, i) => {
                  if(v.申請状況 === "済"){
                    Uline_cd.push(v)
                  }
                  });
                  this.setState({ ALLDATA: Uline_cd })
                
              }}>未申請</Dropdown.Item>

              {/* 　 申請済の人を上に並べる */}
　　　　　　　　　<Dropdown.Item herg="#/action-2" onClick={() =>{
                
                //新しい配列を用意する
                let Dline_cd = []
                //マップを使ってALLDATAを読み込む(vが項目ごとでiがデータごと)
                this.state.ALLDATA.map((v, i) => {
                  if(v.申請状況 === "済"){
                    Dline_cd.push(v)
                  }
                });
                //setStateでALLDATAの中身を書き換える
                this.setState({ ALLDATA: Dline_cd })

                  this.state.ALLDATA.map((v, i) => {
                  if(v.申請状況 === "未"){
                    Dline_cd.push(v)

                  }
                  });
                  this.setState({ ALLDATA: Dline_cd })
                
              }}>申請済</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
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
                onChange={this.handleSearchText}
              >
                チェック済印刷
              </Button>
            </OverlayTrigger>

            <InputGroup className="inputTextGroup">
              <FormControl
                className="inputText"
                placeholder="search 社員名"
                onChange={this.handleSearchText}
              />
              {/* <InputGroup.Append>
                <Button variant="outline-secondary" onClick={this.runSelect} className="inputButton">
                  検索
                </Button>
              </InputGroup.Append> */}
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
                     {
                      } 
                    }
                  )
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
