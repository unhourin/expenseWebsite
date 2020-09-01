import {
  FETCH_EXPENSESUBMISION_REQUEST,
  FETCH_EXPENSESUBMISION_SUCCESS,
  FETCH_EXPENSESUBMISION_FAILURE,
} from "./expenseActionType";
const initialState = {
  num: 1000,
  data: [],
  err: "",
};

const expenseReducer = (state = initialState, action) => {
  console.log("action:", action.type);
  switch (action.type) {
    case FETCH_EXPENSESUBMISION_REQUEST:
      return { ...state };
    case FETCH_EXPENSESUBMISION_SUCCESS: {
      console.log("Asdas:", action.payload);
      return { data: action.payload, error: "" };
    }
    case FETCH_EXPENSESUBMISION_FAILURE:
      return { data: [], error: action.payload };
    default:
      return state;
  }
};

export default expenseReducer;
