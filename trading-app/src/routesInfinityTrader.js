import Profile from "./layouts/profile";

// @mui icons

import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ReorderIcon from '@mui/icons-material/Reorder';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import HelpIcon from '@mui/icons-material/Help';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

//page routes
import Tnc from "./layouts/terms/tnc";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/PaperTrade";
import UserReport from "./layouts/userreports";
import MyReferrals from "./layouts/referrals"
import MyPortfolio from './layouts/UserPortfolio'
import FAQs from "./layouts/FAQs";
import UserWallet from "./layouts/userWallet";

const routes = [

  {
    type: "collapse",
    name: "Position",
    key: "position",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <MilitaryTechIcon/>,
    route: "/position",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "Orders",
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
    key: "Analytics",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <AnalyticsIcon/>,
    route: "/analytics",
    component: <UserReport />,
  },
  {
    type: "collapse",
    name: "Portfolio",
    key: "portfolio",
    icon: <BusinessCenterIcon/>,
    route: "/portfolio",
    component: <MyPortfolio />,
  },
  {
    type: "collapse",
    name: "Wallet",
    key: "Wallet",
    icon: <AccountBalanceWalletIcon/>,
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
    type: "collapse",
    name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <PersonPinIcon/>,
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
