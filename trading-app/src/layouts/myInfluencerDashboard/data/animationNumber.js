import "../SubscriberCount.css";
import React from "react";
import { AnimatedCounter } from "react-animated-counter";

export default function Counter({count}) {
  // Integer state

  console.log('count', count)
  
  return (
    <div className="counter-app">
      <div className="counter-container">
        <AnimatedCounter value={count} color="#000000" fontSize="40px" includeCommas={true} decimalPrecision={2} incrementColor="#000000"/>
      </div>
    </div>
  );
};