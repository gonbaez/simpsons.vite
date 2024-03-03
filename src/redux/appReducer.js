import Joi from "joi";
import { searchSchema } from "../functions/validationSchemas.js";
import {
  DELETE,
  DELETE_CONFIRM,
  FILTER,
  LIKE,
  SCROLL,
  SET_QUOTES,
} from "./types.js";

import { initialState } from "./initialState.js";

export function reducer(state, action) {
  switch (action.type) {
    case SET_QUOTES: {
      const quotes = action.payload;

      quotes[0].selected = true;

      return {
        ...state,
        quotes,
        selectedIndex: 0,
        filteredQuotes: quotes,
      };
    }

    case FILTER: {
      const { quotes } = state;
      let { selectedIndex, filteredQuotes } = state;

      const searchValue = action.payload;

      const valObj = Joi.object(searchSchema).validate({
        "Search string": searchValue,
      });

      if (valObj.error) {
        return {
          ...state,
          filter: {
            searchString: searchValue,
            searchError: valObj.error.details[0].message,
          },
        };
      }

      if (!quotes) return;

      filteredQuotes = quotes;

      filteredQuotes = quotes.filter((el) => {
        const name = el.character.toLowerCase();
        return name.includes(searchValue.toLowerCase());
      });

      if (filteredQuotes.length > 0) {
        switch (filteredQuotes.filter((el) => el.selected).length) {
          case 0:
            selectedIndex = quotes.findIndex((el) => el === filteredQuotes[0]);
            filteredQuotes[0].selected = true;

            break;
          case 1:
            break;
          default:
            filteredQuotes = filteredQuotes.map((el) => {
              el.selected = false;
              return el;
            });

            filteredQuotes[selectedIndex].selected = true;
        }
      }

      return {
        ...state,
        filteredQuotes,
        filter: {
          searchString: searchValue,
          searchError: "",
        },
        selectedIndex,
      };
    }
    case LIKE: {
      const { filteredQuotes } = state;
      const idToLike = action.payload;
      const index = filteredQuotes.findIndex((el) => el.id === idToLike);

      filteredQuotes[index].like = !filteredQuotes[index].like;

      return { ...state, filteredQuotes };
    }

    case SCROLL: {
      const { filteredQuotes } = state;
      const scrollOffset = action.payload;

      const index = filteredQuotes.findIndex((el) => el.selected);

      if (
        index + scrollOffset < 0 ||
        index + scrollOffset >= filteredQuotes.length
      ) {
        // No changes.
        return state;
      }

      filteredQuotes.forEach((el) => {
        el.selected = false;
      });

      filteredQuotes[index + scrollOffset].selected = true;

      return { ...state, selectedIndex: index + scrollOffset, filteredQuotes };
    }
    case DELETE: {
      const idToDelete = action.payload;

      const { filteredQuotes } = state;
      const index = filteredQuotes.findIndex((el) => el.id === idToDelete);

      if (index < 0) {
        // Item has been deleted already
        return state;
      }

      filteredQuotes[index].deleteConfirm =
        !filteredQuotes[index].deleteConfirm;

      return { ...state, filteredQuotes };
    }

    case DELETE_CONFIRM:
      const idToDeleteConfirm = action.payload;

      const { filteredQuotes, quotes } = state;

      const indexInQuotes = quotes.findIndex(
        (el) => el.id === idToDeleteConfirm
      );
      const indexInFilteredQuotes = filteredQuotes.findIndex(
        (el) => el.id === idToDeleteConfirm
      );

      quotes.splice(indexInQuotes, 1);
      filteredQuotes.splice(indexInFilteredQuotes, 1);

      if (filteredQuotes.length) {
        if (indexInFilteredQuotes === filteredQuotes.length) {
          filteredQuotes[indexInFilteredQuotes - 1].selected = true;
        } else {
          filteredQuotes[indexInFilteredQuotes].selected = true;
        }
      }

      return { ...state, quotes, filteredQuotes };

    default:
      return initialState;
  }
}
