import React, { useState } from 'react'

export const renderContext = React.createContext();

export default function RenderContext({children}) {
    const [render, setRender] = useState(true);
  
  return (
      <renderContext.Provider value={{render, setRender}}>
        {children}
      </renderContext.Provider>
  )
}