/**
 * 通过传入集合和表格的标题的数组生成表格
 */
import React from "react";
// import Checkboxtest from "./checkbox";

/**
 *  表头的插件
 *  title   表格标题的数组
 *  tableBody 表格数据的集合
 */
class TableHead extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.title) {
      return this.props.title.map((val) => {
        return <td>{val}</td>;
      });
    } else {
      return <td></td>;
    }
  }
}

/**
 * 遍历json文件数组中存的对象，将对象村进数组
 */
class Body extends React.Component {
  render() {
    //map只能遍历数组，如果是集合需要转换成数组然后遍历
    let result = []; //定义数组
    let idx = 0; //定义自增变量，用于数组存储数据
    //循环遍历对象，将数据存进数组
    let list = this.props.body;
    for (let key in this.props.body) {
      result[idx] = <td>{this.props.body[key]}</td>;
      idx++;
    }
    return result;
  }
}

/**
 *  解析表格身体部分的组件
 */
class TableBody extends React.Component {
  render() {
    //axios是异步获取数据，需要先判断从json获取的数据是否为空
    //如果为空则返回空行防止抛出错误
    if (this.props.bodys) {
      return this.props.bodys.map((body) => {
        return (
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <Body body={body} />
          </tr>
        );
      });
    } else {
      return <tr></tr>;
    }
  }
}

export default class TableDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodys: [],
      isChecked: false,
    };
  }

  render() {
    return (
      <table className="table table-striped table-hover table-bordered text-center">
        <thead>
          <tr>
            {/*title是表格的标题*/}
            <td>
              <input
                type="checkbox"
                // onChange={_self.checkThis.bind(_self, item)}
                // checked={item.checked}
              />
            </td>
            <TableHead title={this.props.title} />
          </tr>
        </thead>
        <tbody>
          <TableBody
            bodys={this.props.tableBody}
            isChecked={this.state.isChecked}
          />
        </tbody>
      </table>
    );
  }
}
