import "../SubscriberCount.css";
import React from "react";
import { AnimatedCounter } from "react-animated-counter";

export default function Counter({count, user}) {
  // Integer state  
  return (
    <div className="counter-app">
      <div className="counter-container">
        <AnimatedCounter value={count?.toFixed(0)} color="#000000" fontSize="40px" includeCommas={true} decimalPrecision={user ? 0 : 2} incrementColor="#000000"/>
      </div>
    </div>
  );
};