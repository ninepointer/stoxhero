

import AnalyticsIcon from '@mui/icons-material/Analytics';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PreTrading from "./layouts/PaperTrade/index";
import UserPosition from "./layouts/PaperTrade/userPosition";

import UserAnalytics from "./layouts/userAnalytics";
import { useContext } from "react";
import { userContext } from "./AuthContext";

const MyRoutes = () => {
  const getDetails = useContext(userContext);

  const routes = [
    {
      type: "collapse",
      name: "Market",
      key: "market",
      icon: <MilitaryTechIcon />,
      route: `/college/${getDetails?.userDetails?.collegeDetails?.college?.route}/home`,
      component: <PreTrading />,
    },
    {
      route: `/college/:collegename/market`,
      component: <UserPosition />,
    },
    {
      type: "collapse",
      name: "MarketGuru",
      key: "marketguru",
      icon: <AnalyticsIcon />,
      route: `/college/${getDetails?.userDetails?.collegeDetails?.college?.route}/marketguru`,
      component: <UserAnalytics />,
    },
  ];

  return routes;
};

export default MyRoutes;

