import React from "react";

export default class EP extends React.Component {
  state = {
    ALLDATA: {},
    img: "",
    family_name: "",
  };

  componentDidMount() {
    fetch("http://127.0.0.1:3001/user/employee_list", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          ALLDATA: data,
        });
        console.log(data)
      });
  }

  getImage = (e) => {
    let _self = this;
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      let buffer = Buffer.from(reader.result, "utf-8");
      _self.setState({ img: reader.result });
      console.log(reader.result)
    };
  };

  postEmployee = () => {
    fetch("http://127.0.0.1:3001/user/addEmployee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `family_name=${this.state.family_name}&id_photo=${this.state.img}`,
    }).then(function (response) {});
  };

  handleEmployee = (text) => {
    this.setState({
      family_name: text.target.value,
    });
  };

  render() {
    let _self = this;
    return (
      <>
        <input type="file" onChange={this.getImage} accept="image/*" />
        <input type="text" onChange={this.handleEmployee}></input>
        <button onClick={this.postEmployee}>提交</button>
        <table>
          <thead></thead>
          <tbody>
            <tr>
              <td>社員番号</td>
              <td>写真</td>
            </tr>
            {this.state.ALLDATA.length
              ? this.state.ALLDATA.map(function (item, index) {
                  let buffer11 = item.id_photo;
                  let buffer = Buffer.from(buffer11, 'utf-8')
                  let imgBase64=buffer.toString('base64')
                  console.log(Buffer.isEncoding(buffer))
                  // reader.readAsDataURL(item.employee_id);
                  return (
                    <tr key={index}>
                      <td>{item.employee_id}</td>
                      <td>
                        <img src={imgBase64}></img>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </>
    );
  }
}
