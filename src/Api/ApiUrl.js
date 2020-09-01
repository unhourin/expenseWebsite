const url = "expense/site/";
// const url = "http://ayun.work:3001/expense/site/";

var ApiUrl = {
  getExpenseSubmissonSituation: url + "submission_situation",
  getDetailData: url + "detail/",
  pushNotifications: url + "pushNotifications",
  confirmExpense: url + "expenseConfirm/",
};

module.exports = ApiUrl;
