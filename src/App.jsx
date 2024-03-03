import React, { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Interface from "./components/Interface";

import styles from "./styles/App.module.css";

import { Route, Routes } from "react-router-dom";
import About from "./pages/About";

import { getQuotes } from "./functions/getQuotes";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getQuotes(dispatch);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <header>
          <Header />
        </header>
        <Routes>
          <Route path="/" element={<Interface />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default App;
