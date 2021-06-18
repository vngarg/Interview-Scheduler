import React from "react";
import "./styles.css";

const Touchable = (props) => (
  <span onClick={props.onTouch} className="touchAble">
    {props.text}
  </span>
);

export default Touchable;
