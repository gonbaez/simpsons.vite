import React from "react";

import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";

import styles from "../styles/Controls.module.css";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { FILTER } from "../redux/types";

const Controls = () => {
  const dispatch = useDispatch();

  const searchError = useSelector((state) => state.filter.searchError);
  const searchString = useSelector((state) => state.filter.searchString);
  const filteredQuotes = useSelector((state) => state.filteredQuotes);

  const likes = filteredQuotes.filter((el) => el.like).length;
  const characters = filteredQuotes.length;

  return (
    <>
      <div className={styles.controlsContainer}>
        <div style={{ position: "relative" }}>
          <input
            className={classNames(
              styles.searchInput,
              searchError ? styles.error : ""
            )}
            type="text"
            placeholder="Search character"
            onInput={(e) => dispatch({ type: FILTER, payload: e.target.value })}
            value={searchString}
          />
          <span className={styles.errorMessage}>{searchError}</span>
        </div>
        <div className={styles.counterContainer}>
          <div className={styles.likesContainer}>
            <IoMdHeart /> <span>{likes}</span>
          </div>
          <div className={styles.characterContainer}>
            <FaUser /> <span>{characters}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Controls;
