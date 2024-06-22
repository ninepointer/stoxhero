// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import { io } from "socket.io-client";
import ReactGA from "react-ga";
import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// import Header from "./Header";
import { userContext } from "../../../AuthContext";
import TenXTrading from "./tradePart";
import { socketContext } from "../../../socketContext";

function TradeViewTenX() {
  const getDetails = useContext(userContext);
  const location = useLocation();
  const subscriptionId = location?.state?.subscriptionId;
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const [tradingDayData, setTradingDayData] = useState([]);
  const socket = useContext(socketContext);

  useEffect(() => {
    let abortController;
    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;

      // the signal is passed into the request(s) we want to abort using this controller
      const { data } = await axios.get(
        `${baseUrl}api/v1/tenX/${subscriptionId}/trade/countTradingDays`,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          signal: signal,
        }
      );

      let filtered = (data?.data).filter((elem) => {
        return elem.subscriptionId == subscriptionId;
      });

      setTradingDayData(filtered);
    })();

    return () => abortController.abort();
  }, []);

  // let socket;
  // try {
  //   socket = io.connect(`${baseUrl1}`)
  // } catch (err) {
  //   throw new Error(err);
  // }

  useEffect(() => {
    socket.emit("userId", getDetails.userDetails._id);
    socket.emit("user-ticks", getDetails.userDetails._id);

    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <TenXTrading
          tradingDayData={tradingDayData}
          socket={socket}
          subscriptionId={subscriptionId}
        />
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default TradeViewTenX;
