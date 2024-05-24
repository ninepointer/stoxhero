import React, { useState } from 'react'

export const userContext = React.createContext();

export default function AuthContext({children}) {
    const [userDetails, setUserDetail] = useState({});
    const [tradeSound, setTradeSound] = useState();
  return (
      <userContext.Provider value={{userDetails, setUserDetail, tradeSound, setTradeSound}}>
        {children}
      </userContext.Provider>
  )
}