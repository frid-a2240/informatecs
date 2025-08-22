"use client";
import React from "react";
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaTwitter } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <MdEmail className="icon" />
        <span>informatec@ensenada.tecnm.mx</span>
      </div>
      <div className="topbar-right">
        <FaInstagram className="icon" />
        <FaTwitter className="icon" />
      </div>
    </div>
  );
};

export default TopBar;
