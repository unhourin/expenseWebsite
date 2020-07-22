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
export default class Detailed extends React.Component {
  state = {
    DEFAULTDATA: [],
    ALLDATA: [],
    isAllCheck: false,
    printList: [],
    searchText: "",
  };

  componentDidMount() {
    fetch("http://127.0.0.1:3001/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          item.isCheck = "false";
        });

        this.setState({
          DEFAULTDATA: data,
          ALLDATA: data,
        });
      });
  }

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

  render() {
    let _self = this;
    return (
      <>
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
                  <td>id</td>
                  <td>username</td>
                  <td>password</td>
                  <td>e_mail</td>
                  <td>birth</td>
                  <td>employee_id</td>
                  <td>verification_token</td>
                  <td>createdBy</td>
                  <td>createdAt</td>
                  <td>updatedBy</td>
                  <td>updatedAt</td>
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
                          <td onClick={()=>{this.props.history.push("./Detailed.js")}}>{item.id}</td>
                          <td>{item.username}</td>
                          <td>{item.password}</td>
                          <td>{item.e_mail}</td>
                          <td>{item.birth}</td>
                          <td>{item.employee_id}</td>
                          <td>{item.verification_token}</td>
                          <td>{item.createdBy}</td>
                          <td>{item.createdAt}</td>
                          <td>{item.updatedBy}</td>
                          <td>{item.updatedAt}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
        </Table>
      </>
    );
  }
}
