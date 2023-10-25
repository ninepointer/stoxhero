import React, { useState } from 'react'

export const marketDataContext = React.createContext();

export default function MarketDataContext({children}) {
    const [marketData, setMarketData] = useState([]);
    const [indexLiveData, setIndexLiveData] = useState([]);
    const [contestMarketData, setContestMarketData] = useState([]);
  
  return (
      <marketDataContext.Provider value={{marketData, setMarketData, indexLiveData, setIndexLiveData, contestMarketData, setContestMarketData}}>
        {children}
      </marketDataContext.Provider>
  )
}