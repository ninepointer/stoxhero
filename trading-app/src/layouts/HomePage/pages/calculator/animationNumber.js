import "./SubscriberCount.css";
import React from "react";
import { AnimatedCounter } from "react-animated-counter";

export default function Counter({count, user}) {
  return (
    <div className="counter-app">
      <div className="counter-container">
      Assets: ₹ <span><AnimatedCounter value={count?.toFixed(0)} color="#ffffff" fontSize="40px" includeCommas={true} decimalPrecision={0} incrementColor="#000000"/></span> 
      </div>
    </div>
  );
};