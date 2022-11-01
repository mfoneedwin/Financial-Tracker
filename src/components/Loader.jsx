import React from "react";

const Loader = ({ size = "" }) => {
  return (
    <div className={`spinner ${size}`}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader;
