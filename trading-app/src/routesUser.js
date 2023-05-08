// Material Dashboard 2 React layouts
// import Funds from "./layouts/funds";
import Profile from "./layouts/profile";

// @mui icons

import StadiumIcon from '@mui/icons-material/Stadium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ReorderIcon from '@mui/icons-material/Reorder';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import HelpIcon from '@mui/icons-material/Help';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import { GiNinjaHeroicStance } from 'react-icons/gi';

//page routes
import Tnc from "./layouts/terms/tnc";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/PaperTrade";
// import UserReport from "./layouts/userreports";
import MyReferrals from "./layouts/referrals"
import UserContest from "./layouts/UserContest"
import ContestPage from './layouts/UserContest/contestPage'
import ContestRegisterPage from './layouts/UserContest/contestRegistrationPage'
import ContestTradePage from './layouts/UserContest/ContestTrade'
// import DummyTradePage from './layouts/UserContest/dummyContestTradePage'
// import Dashboard from './layouts/traderHome'
import MyPortfolio from './layouts/UserPortfolio'
// import Home from './layouts/UserHome'
// import HomeIcon from '@mui/icons-material/OtherHouses';
// import ContestResultPage from "./layouts/UserContest/data/contestTrade/ContestResultPage";
import ResultPage from "./layouts/UserContest/ResultPage";
// import MyContestHistoryCard from "./layouts/UserContest/data/MyContestHistoryCard";
import ContestHistory from "./layouts/UserContest/ContestHistory";
import ContestHistoryCard from "./layouts/UserContest/ContestHistoryCard";
import FAQs from "./layouts/FAQs";
import UserWallet from "./layouts/userWallet"
import TenXTrading from "./layouts/tenXTrading"
import UserAnalytics from "./layouts/userAnalytics"
// import logo from "../src/assets/images/logo1.jpeg"

const routes = [

  // {
  //   type: "collapse",
  //   name: "DashBoard",
  //   key: "Dashboard",
  //   icon: <HomeIcon/>,
  //   route: "/Dashboard",
  //   component: <Home />,
  // },
  {
    type: "collapse",
    name: "Virtual Trading",
    key: "virtualtrading",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <MilitaryTechIcon/>,
    route: "/virtualtrading",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "TenX Trading",
    key: "tenxtrading",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <CurrencyRupeeIcon/>,
    route: "/tenxtrading",
    component: <TenXTrading />,
  },
  // {
  //   type: "collapse",
  //   name: "StoxHero Trading",
  //   key: "stoxherotrading",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   icon: <GiNinjaHeroicStance/>,
  //   route: "/stoxherotrading",
  //   component: <StoxHeroTrading />,
  // },
  // {
  //   type: "collapse",
  //   name: "Contests",
  //   key: "Contest",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   icon: <BusinessIcon/>,
  //   route: "/contest",
  //   component: <Contest />,
  // },
  // {
  //   type: "collapse",
  //   name: "Battle Street",
  //   key: "battlestreet",
  //   icon: <StadiumIcon/>,
  //   route: "/battlestreet",
  //   component: <UserContest />,
  // },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/battlestreet/:name",
    component: <ContestPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "battlestreet/:name/register",
    component: <ContestRegisterPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "battlestreet/:name/trade",
    component: <ContestTradePage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "battlestreet/result",
    component: <ResultPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "battlestreet/history",
    component: <ContestHistory />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "battlestreet/history/:name",
    component: <ContestHistoryCard />,
  },
  // {
  //   // type: "collapse",
  //   // name: "Arena", 
  //   // key: "arena",
  //   // icon: <BusinessIcon/>, DummyTradePage
  //   route: "arena/notstarted",
  //   component: <ContestTradePage />,
  // },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <ReorderIcon/>,
    route: "/orders",
    component: <UserOrders />,
  },
  {
    type: "collapse",
    name: "Referrals",
    key: "referrals",
    icon: <Diversity3Icon/>,
    route: "/referrals",
    component: <MyReferrals />,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <AnalyticsIcon/>,
    route: "/analytics",
    component: <UserAnalytics />,
  },
  // {
  //   type: "collapse",
  //   name: "Portfolio",
  //   key: "funds",
  //   icon: <BusinessCenterIcon/>,
  //   route: "/funds",
  //   component: <Funds/>,
  // },
  {
    type: "collapse",
    name: "Portfolio",
    key: "portfolio",
    icon: <BusinessCenterIcon/>,
    route: "/portfolio",
    component: <MyPortfolio />,
  },
  {
    // type: "collapse",
    // name: "Wallet",
    key: "wallet",
    // icon: <AccountBalanceWalletIcon/>,
    route: "/wallet",
    component: <UserWallet />,
  },
  {
    type: "collapse",
    name: "FAQs",
    key: "faqs",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <HelpIcon/>,
    route: "/faqs",
    component: <FAQs />,
  },
  {
    // type: "collapse",
    // name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <PersonPinIcon/>,
    route: "/profile",
    component: <Profile />,
  },
  {
    // type: "collapse",
    // name: "Terms",
    // key: "terms",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <PersonPinIcon/>,
    route: "/terms",
    component: <Tnc />,
  },

];

// console.log(routes)

export default routes;
