import axios from "axios";
import offlineData from "../offlineData";
import { SET_QUOTES } from "../redux/types";

export const getQuotes = async (dispatch, count = 50) => {
  const response = await axios.get(
    `https://thesimpsonsquoteapi.glitch.me/quotes?count=${count}`
  );

  if (!response.data.length) {
    console.log("Using offline data");
    response.data = offlineData;
  }

  response.data.map((el, idx) => {
    el.id = idx;
    return el;
  });

  dispatch({ type: SET_QUOTES, payload: response.data });
};
