
import React from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import AuthContext, { userContext } from "./AuthContext";
import { NetPnlProvider } from './PnlContext';
import MarketDataContext from './MarketDataContext';
import RenderContext from "./renderContext";
import SocketContext from "./socketContext";
import SettingContext from "./settingContext"
// import FeaturedContestRegistration from "./layouts/HomePage/pages/FeaturedContestRegistration"


ReactDOM.render(
  // const root = ReactDOM.createRoot(document.getElementById("root"));
  // root.render(

  <AuthContext>

    <NetPnlProvider>
      <MarketDataContext>
        <RenderContext >
          <SocketContext>
            <SettingContext>
            <BrowserRouter>
              <MaterialUIControllerProvider>
                <App />
              </MaterialUIControllerProvider>
            </BrowserRouter>

            </SettingContext>
          </SocketContext>
        </RenderContext>
      </MarketDataContext>
    </NetPnlProvider>

  </AuthContext>,
  document.getElementById("root")
);
