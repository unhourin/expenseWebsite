import React from "react";
import {
    Row,
    Col,
    OverlayTrigger,
    Dropdown,
    Table,
    Button,
    Tooltip,
} from "react-bootstrap";
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom';
import moment from "moment"

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
        axios.get("http://127.0.0.1:3001/expense")
            .then(response => {
                return response.data
            }).then((data) => {
                data.forEach((item) => {
                    let name = item.family_name + item.first_name
                    item.employee_name = name
                    item.isCheck = "false";
                    this.timeFormat(item)
                });

                data.sort((a, b) => {
                    return a.employee_id - b.employee_id
                })
                this.setState({
                    DEFAULTDATA: data,
                    ALLDATA: data,
                });
            })

    }

    timeFormat = (item) => {
        if (item.starting_time != null)
            item.starting_time = moment(item.starting_time).format("YYYY-MM-DD")
        if (item.end_time != null)
            item.end_time = moment(item.end_time).format("YYYY-MM-DD")
        if (item.created_at != null)
            item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")
    }

    runSelect = () => {

    };

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
        console.log(this.state.printList)
        alert(this.state.printList);
    };

    reportApplicationMsg = () => {
        let url = "http://127.0.0.1:3001/expense/pushMessage"
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `employeeIdList=${this.state.printList}`
        }).then(function (response) {
        });

    }

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
    }

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
    }

    sortConfirmed = () => {
        let tmpData = this.state.DEFAULTDATA;
        tmpData.sort((a, b) => {
            return b.confirmed - a.confirmed
        })
        this.setState({ ALLDATA: tmpData });
    }

    sortNotConfirmed = () => {
        let tmpData = this.state.DEFAULTDATA;
        console.log(tmpData.confirmed)
        tmpData.sort((a, b) => {
            return a.confirmed - b.confirmed
        })
        this.setState({ ALLDATA: tmpData });
    }

    sortReported = () => {
        let tmpData = this.state.DEFAULTDATA;
        tmpData.sort((a, b) => {
            let x = 0;
            let y = 0;
            if (a.expense_id != null)
                x = a.expense_id.length
            if (b.expense_id != null)
                y = b.expense_id.length
            return y - x
        })
        this.setState({ ALLDATA: tmpData });
    }

    sortNotReported = () => {
        let tmpData = this.state.DEFAULTDATA;
        tmpData.sort((a, b) => {
            let x = 0;
            let y = 0;
            if (a.expense_id != null)
                x = a.expense_id.length
            if (b.expense_id != null)
                y = b.expense_id.length
            return x - y
        })
        this.setState({ ALLDATA: tmpData });
    }


    render() {
        let _self = this;
        return (
            <>
                <Row style={{ backgroundColor: "black" }}>
                    <label color="green" style={{ padding: 40 }}>TOMATO</label>
                </Row>
                <Row>
                    <Col md="2">
                    </Col>
                    <Col md="8">
                        <Row>
                            <input style={{ width: "100%", padding: 6, marginTop: 20, marginBottom: 5 }} type="text" onChange={this.handleSearchText} ></input>
                        </Row>
                        <Row style={{ backgroundColor: "#FFFFFF", padding: 10 }}>
                            <Col md="2" style={{ backgroundColor: "##FFFFFF" }}>
                                {/* <Row style={{ fontSize: 15 }}>
                                        <Col xs="4">対象月</Col>
                                        <Col xs="4">申請状態</Col>
                                        <Col xs="4">確認状況</Col>
                                    </Row> */}

                                <Row style={{ fontSize: 5 }}>
                                    <Col xs="4">
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant="outline-secondary"
                                                id="dropdown-basic"
                                            >
                                                絞り込み
                                        </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={_self.sortNotReported}>未提出</Dropdown.Item>
                                                <Dropdown.Item onClick={_self.sortReported}> 提出済み</Dropdown.Item>
                                                <Dropdown.Item onClick={_self.sortNotConfirmed}>未承認</Dropdown.Item>
                                                <Dropdown.Item onClick={_self.sortConfirmed}>承認済み</Dropdown.Item>
                                                <Dropdown.Item onClick={_self.sortEmployeeNameUp}>社員名(昇順)</Dropdown.Item>
                                                {/* 社員名で降順で並べ替える */}
                                                <Dropdown.Item onClick={_self.sortEmployeeNameDown}>社員名(降順)</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="8" style={{ backgroundColor: "#FFFFFF" }}>
                            </Col>
                            <Col md="2" style={{ backgroundColor: "#FFFFFF" }}>
                                <Row>
                                    <Col>
                                        <OverlayTrigger
                                            key={"top"}
                                            placement={"top"}
                                            overlay={
                                                <Tooltip id={`tooltip-${"top"}`}>
                                                    チェック済の人にメッセージを送信
                                            </Tooltip>
                                            }
                                        >
                                            <Button
                                                variant="outline-secondary"
                                                style={{ fontSize: 1, padding: 10 }}
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
                                                style={{ fontSize: 1, padding: 10 }}
                                                onClick={this.runPrint}
                                            >
                                                チェック済印刷
                                        </Button>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Table striped bordered hover >
                                <thead>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={_self.isAllCheck.bind(_self)}
                                                checked={this.state.isAllCheck || ""}
                                            />
                                        </td>
                                        <td>社員番号</td>
                                        <td>提出状況</td>
                                        <td>承認状況</td>
                                        <td>社員名</td>
                                        <td>請求件数</td>
                                        <td>請求総額</td>
                                        <td>駅区間</td>
                                        <td>定期期間</td>
                                        <td>更新日</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.ALLDATA.length
                                        ? this.state.ALLDATA.map(function (item, index) {
                                            let bgColor = "#fff"
                                            return (
                                                // <Link to='/details'>
                                                <tr key={index} style={{ Color: bgColor, height: 50 }} onClick={() => {
                                                    console.log("sad")
                                                    // return <Link to="/details" />
                                                    // // return <Redirect push to='/details' />
                                                    _self.props.history.push("/details/" + item.employee_id + "/" + item.employee_name + "/" + item.expense_id)
                                                }}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={_self.checkThis.bind(_self, item)}
                                                            checked={item.checked || ""}
                                                        />
                                                    </td>
                                                    <td>{item.employee_id}</td>
                                                    <td>{item.expense_id != null ? "提出済み" : "未提出"}</td>
                                                    <td>{item.confirmed === 1 ? "承認済み" : "未承認"}</td>
                                                    <td>{item.employee_name}</td>
                                                    <td>{item.expense_sum != null ? item.expense_sum : "-"}</td>
                                                    <td>{item.total != null ? item.total : "-"}</td>
                                                    <td>
                                                        <p>{item.starting_point != null ? item.starting_point : "-"}</p>
                                                        <p>{item.end_point != null ? item.end_point : "-"}</p>
                                                    </td>
                                                    <td> <p>{item.starting_time != null ? item.starting_time : "-"}</p>
                                                        <p>{item.end_time != null ? item.end_time : "-"}</p></td>
                                                    <td>{item.created_at != null ? item.created_at : "-"}</td>

                                                </tr>

                                                // </Link>

                                            );
                                        })
                                        : null}
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                    <Col md="2">
                    </Col>

                </Row>

                <Row style={{ backgroundColor: "#FFFFFF" }}>もし区切りあったら</Row>

            </>
        );
    }
}