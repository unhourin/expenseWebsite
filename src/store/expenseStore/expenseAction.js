import {
  FETCH_EXPENSESUBMISION_REQUEST,
  FETCH_EXPENSESUBMISION_SUCCESS,
  FETCH_EXPENSESUBMISION_FAILURE,
} from "./expenseActionType";
const moment = require("moment");
const api = require("../../Api/ApiUrl");

const axios = require("axios");

//FETCH_EXPENSESUBMISION_REQUEST
export const FER = () => {
  return {
    type: FETCH_EXPENSESUBMISION_REQUEST,
  };
};

//FETCH_EXPENSESUBMISION_SUCCESS
export const FES = (data) => {
  console.log("FETCH_EXPENSESUBMISION_SUCCESS");
  return {
    type: FETCH_EXPENSESUBMISION_SUCCESS,
    payload: data,
  };
};

//FETCH_EXPENSESUBMISION_FAILURE
export const FEF = (err) => {
  return {
    type: FETCH_EXPENSESUBMISION_FAILURE,
    payload: err,
  };
};

export const FETCHDATA = () => {
  console.log("FETCH_EXPENSESUBMISION_REQUEST");
  return (dispatch) => {
    axios.get(api.getExpenseSubmissonSituation).then((res) => {
      if (res.status === 200) {
        res.data.map((i) => {
          i.isCheck = "false";
          let name = i.family_name + i.first_name;
          timeFormat(i);
          i.employee_name = name;
        });
        dispatch(FES(res.data));
      } else dispatch(FEF());
    });
  };
};

const timeFormat = (item) => {
  if (item.starting_time != null)
    item.starting_time = moment(item.starting_time).format("YYYY-MM-DD");
  if (item.end_time != null)
    item.end_time = moment(item.end_time).format("YYYY-MM-DD");
  if (item.created_at != null)
    item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
};
