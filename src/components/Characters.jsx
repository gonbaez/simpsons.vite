import React, { useRef, useEffect } from "react";

import styles from "../styles/Characters.module.css";

import { IoRefreshCircle } from "react-icons/io5";
import { LuSearchX } from "react-icons/lu";

import Character from "./Character";
import ScrollButtom from "./ScrollButton";
import { useDispatch, useSelector } from "react-redux";

import { getQuotes } from "../functions/getQuotes.js";

const Characters = () => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.filteredQuotes);
  const nonFilteredDataLength = useSelector((state) => state.quotes.length);
  const selectedIndex = useSelector((state) => state.selectedIndex);

  const selectedElement = useRef();

  useEffect(() => {
    if (selectedElement.current) {
      selectedElement.current.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  if (!nonFilteredDataLength) {
    return (
      <>
        <IoRefreshCircle
          onClick={() => {
            dispatch({ type: "RESET" });
            getQuotes(dispatch);
          }}
          className={styles.refreshButton}
        />
      </>
    );
  }

  if (!data.length) {
    return (
      <LuSearchX
        onClick={() => dispatch({ type: "FILTER", payload: "" })}
        style={{ cursor: "pointer" }}
        className={styles.refreshButton}
      />
    );
  }

  // const selectedIndex = data.findIndex((el) => el.selected);

  return (
    <>
      {selectedIndex ? <ScrollButtom direction="left" /> : null}
      <ul className={styles.characterList}>
        <div className={styles.emptyListItem}></div>
        {data.map((element) => {
          return (
            <Character
              {...element}
              selectedElement={selectedElement}
              key={element.id}
            />
          );
        })}
        <div className={styles.emptyListItem}></div>
      </ul>
      {selectedIndex === data.length - 1 ? null : (
        <ScrollButtom direction="right" />
      )}
    </>
  );
};

export default Characters;
