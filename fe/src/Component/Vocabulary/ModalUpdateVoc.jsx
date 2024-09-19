import React, { useState, useEffect } from "react";
import styles from "./VocabularyManager.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ModalUpdateVoc = ({ isOpen, contentLabel, children }) => {
  const [modalStyle, setModalStyle] = useState({
    display: isOpen ? "block" : "none",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  });

  const [overlayStyle, setOverlayStyle] = useState({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "600px",
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    zIndex: 1001,
    maxHeight: "97vh",
    overflowY: "scroll",
  });

  useEffect(() => {
    if (isOpen) {
      setModalStyle((prevState) => ({ ...prevState, display: "block" }));
      setOverlayStyle((prevState) => ({ ...prevState, display: "block" }));
    } else {
      setModalStyle((prevState) => ({ ...prevState, display: "none" }));
      setOverlayStyle((prevState) => ({ ...prevState, display: "none" }));
    }
  }, [isOpen]);

  return (
    <div className={cx("modal")} style={modalStyle}>
      <div className={cx("overlay")} style={overlayStyle}>
        <h2 className={cx("title")}>{contentLabel}</h2>
        {children}
      </div>
    </div>
  );
};

export default ModalUpdateVoc;
