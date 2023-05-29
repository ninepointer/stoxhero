
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import AuthContext, { userContext } from "./AuthContext";
import {NetPnlProvider} from './PnlContext';
import MarketDataContext from './MarketDataContext';
import RenderContext from "./renderContext";

// equity trader's
// pnl trader wise

ReactDOM.render(
  
  <AuthContext>
    <NetPnlProvider>
      <MarketDataContext>
        <RenderContext >
          <BrowserRouter>
            <MaterialUIControllerProvider>
              <App />
            </MaterialUIControllerProvider>
          </BrowserRouter>
        </RenderContext>
      </MarketDataContext>
    </NetPnlProvider>
  </AuthContext>,
  document.getElementById("root")
);
