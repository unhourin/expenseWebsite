import React from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { FETCHDATA, FER } from "../../../store/expenseStore/expenseAction";

class Test extends React.Component {
  UNSAFE_componentWillMount() {
    this.props.fetchdata();
  }
  render() {
    const { num, data, fetchdata } = this.props;
    return (
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
                // onChange={_self.isAllCheck.bind(_self)}
                // checked={this.state.isAllCheck || ""}
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
          {data.length
            ? data.map(function (item, index) {
                console.log(item.family_name);
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
                    className={item.expense_id != null ? "" : "table-danger"}
                    key={index}
                    style={{ cursor: "pointer" }}
                    // onClick={() => {
                    //   _self.props.history.push(
                    //     "/details/" +
                    //       item.employee_id +
                    //       "/" +
                    //       item.employee_name +
                    //       "/" +
                    //       item.expense_id
                    //   );
                    // }}>
                  >
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                      }}>
                      <input
                        type="checkbox"
                        // onChange={_self.checkThis.bind(_self, item)}
                        checked={item.checked || ""}
                      />
                    </td>
                    <td>{item.employee_id}</td>
                    <td>{item.employee_name}</td>
                    <td>{reportMsg}</td>
                    <td>{item.confirmed === 1 ? "承認済み" : "未承認"}</td>

                    <td>{item.expense_sum != null ? item.expense_sum : "-"}</td>
                    <td>{item.total != null ? item.total : "-"}</td>
                    <td>
                      <p>
                        {item.starting_point != null
                          ? item.starting_point
                          : "-"}
                      </p>
                      <p>{item.end_point != null ? item.end_point : "-"}</p>
                    </td>
                    <td>
                      {" "}
                      <p>
                        {item.starting_time != null ? item.starting_time : "-"}
                      </p>
                      <p>{item.end_time != null ? item.end_time : "-"}</p>
                    </td>
                    <td>{item.charge != null ? item.charge : "-"}</td>
                  </tr>

                  // </Link>
                );
              })
            : null}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    num: state.num,
    data: state.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { fetchdata: () => dispatch(FETCHDATA()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
