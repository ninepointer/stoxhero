import React, { createContext, useState } from 'react';

export const NetPnlContext = createContext();

export const NetPnlProvider = ({ children }) => {
  const [netPnl, setNetPnl] = useState(0);
  const [totalRunningLots, setTotalRunningLots] = useState(0);
  const [contestNetPnl, setContestNetPnl] = useState(0);
  const [contestTotalRunningLots, setContestTotalRunningLots] = useState(0);


  const updateNetPnl = (value,runninglots) => {
    setNetPnl(value);
    setTotalRunningLots(runninglots);
  };

  const updateContestNetPnl = (contestValue, contestRunningLot) => {
    setContestNetPnl(contestValue);
    setContestTotalRunningLots(contestRunningLot);
  };

  return (
    <NetPnlContext.Provider value={{ netPnl,totalRunningLots, updateNetPnl, updateContestNetPnl, contestNetPnl, contestTotalRunningLots }}>
      {children}
    </NetPnlContext.Provider>
  );
};
