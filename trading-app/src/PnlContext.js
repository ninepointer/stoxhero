import React, { createContext, useState } from 'react';

export const NetPnlContext = createContext();

export const NetPnlProvider = ({ children }) => {
  const [netPnl, setNetPnl] = useState(0);
  const [totalRunningLots, setTotalRunningLots] = useState(0);
  const [grossPnlAndBrokerage, setGrossPnlAndBrokerage] = useState({
    grossPnl: 0,
    brokerage: 0,
    trades: 0
  });
  const [contestNetPnl, setContestNetPnl] = useState(0);
  const [contestTotalRunningLots, setContestTotalRunningLots] = useState(0);
  const [pnlData, setPnlData] = useState([]);
  // const [infinityNetPnl, setInfinityNetPnl] = useState(0);
  // const [contestTotalRunningLots, setContestTotalRunningLots] = useState(0);
  const [pendingOrderQuantity, setPendingOrderQuantity] = useState([]);

  const updateNetPnl = (value,runninglots, grossPnl, brokerage, trades) => {
    setNetPnl(value);
    setTotalRunningLots(runninglots);
    grossPnlAndBrokerage.grossPnl = grossPnl;
    grossPnlAndBrokerage.brokerage = brokerage;
    grossPnlAndBrokerage.trades = trades;
    setGrossPnlAndBrokerage(grossPnlAndBrokerage);
  };

  const updateContestNetPnl = (contestValue, contestRunningLot) => {
    setContestNetPnl(contestValue);
    setContestTotalRunningLots(contestRunningLot);
  };

  return (
    <NetPnlContext.Provider
     value={{ 
      pnlData, 
      setPnlData, 
      netPnl,
      totalRunningLots, 
      updateNetPnl, 
      updateContestNetPnl, 
      contestNetPnl, 
      contestTotalRunningLots, 
      grossPnlAndBrokerage, 
      setPendingOrderQuantity,
      pendingOrderQuantity
      }}
    >
      {children}
    </NetPnlContext.Provider>
  );
};
