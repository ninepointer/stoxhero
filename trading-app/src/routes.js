// Material Dashboard 2 React layouts
import CompanyPosition from "./layouts/companyposition";
import CohortPosition from "./layouts/cohortposition";
import AdminDashboard from "./layouts/admindashboard";
import TraderDashboard from "./layouts/traderdashboard";
import Orders from "./layouts/orders";
import Instruments from "./layouts/instruments";
import Contests from "./layouts/contests";
import TradingAccount from "./layouts/trading-account";
import Users from "./layouts/users";
import AlgoBox from "./layouts/algobox";
import Funds from "./layouts/funds";
import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import Setting from "./layouts/settings/Setting";
import Expense from "./layouts/expenses/";
import AlgoPosition from "./layouts/algo position";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/PaperTrade";
import UserReport from "./layouts/userreports";
import TradersReport from "./layouts/tradersReportMock";
import AdminReport from "./layouts/adminreportMock";
import DailyPNLData from "./layouts/dailyPnlDashboard";
import TraderPosition from "./layouts/traderPosition"
import AdminReportLive from "./layouts/adminreportLive"
import TradersReportLive from "./layouts/tradersReportLive"
import TradersMarginAllocation from "./layouts/tradersMarginAllocation"
import AnalyticsRoutes from './analyticsRoutes'
import SignUp from './layouts/authentication/sign-up'
import SignIn from './layouts/authentication/sign-in'
import ResetPassword from './layouts/authentication/reset-password/cover'
import Response from './layouts/authentication/sign-up/responseSubmit'
import MyReferrals from "./layouts/referrals"
import Portfolio from './layouts/portfolio'
import CreatePortfolio from './layouts/portfolio/createPortfolio'
import CarouselDetails from './layouts/carousel/carouselDetails'
import CareerList from './layouts/career'
import CareerDetails from './layouts/career/careerDetails'
import ReferralProgramDetails from './layouts/referral-program/ReferralProgramDetails'
import ContestPage from './layouts/UserContest/contestPage'
import ContestRegisterPage from './layouts/UserContest/contestRegistrationPage'
import ContestTradePage from './layouts/UserContest/ContestTrade'
import Carousel from './layouts/carousel'
// import Home from './layouts/UserHome'
import HomeIcon from '@mui/icons-material/OtherHouses';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import UserSignupDashboard from './layouts/userSignupDashboard'

// import DummyPage from "./layouts/UserContest/dummyContestTradePage";


// @mui icons
import StadiumIcon from '@mui/icons-material/Stadium';
import Shop2Icon from '@mui/icons-material/Shop2';
import ReportIcon from '@mui/icons-material/Assessment';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import BusinessIcon from '@mui/icons-material/Business';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WalletIcon from '@mui/icons-material/Wallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DBEntry from "./layouts/InsertData/DBEntry";
import Referral from "./layouts/referral-program";
import UserContest from "./layouts/UserContest"
import Batch from "./layouts/batch";
import { GiNinjaHeroicStance } from 'react-icons/gi';
import InfinityTrader from "./layouts/InfinityTrading"
import UserAnalytics from "./layouts/userAnalytics";
import UserWallet from "./layouts/userWallet"
import About from './layouts/HomePage/pages/About'
import Careers from './layouts/HomePage/pages/Career'
import Home from './layouts/HomePage/pages/Home'
import JD from './layouts/HomePage/pages/JobDescription'
import CareerForm from './layouts/HomePage/pages/CareerForm'



const routes = [
  {
    type: "collapse",
    name: "Company Dashboard",
    key: "admindashboard",
    icon: <DashboardIcon/>,
    route: "/admindashboard",
    component: <AdminDashboard />,
  },

  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "signup",
    // icon: <DashboardIcon/>,
    route: "/signup",
    component: <SignUp />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "login",
    // icon: <DashboardIcon/>,
    route: "/login",
    component: <SignIn />,
  },
  
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "resetpassword",
    // icon: <DashboardIcon/>,
    route: "/resetpassword",
    component: <ResetPassword />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "response",
    // icon: <DashboardIcon/>,
    route: "/response",
    component: <Response />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "createportfolio",
    // icon: <DashboardIcon/>,
    route: "/createportfolio",
    component: <CreatePortfolio />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "carouselDetails",
    // icon: <DashboardIcon/>,
    route: "/Carousel Details",
    component: <CarouselDetails />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "referralprogramdetails",
    // icon: <DashboardIcon/>,
    route: "/referralprogramdetails",
    component: <ReferralProgramDetails />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/arena/:name",
    component: <ContestPage />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "about",
    component: <About />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "jobdescription",
    component: <JD />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "home",
    component: <Home />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "careers",
    component: <Careers />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "apply",
    component: <CareerForm />,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "arena/:name/register",
    component: <ContestRegisterPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena", DummyPage
    // icon: <BusinessIcon/>,
    route: "arena/contest/trade",
    component: <ContestTradePage />,
  },
  // {
  //   // type: "collapse",
  //   // name: "Arena", 
  //   // key: "arena", DummyPage
  //   // icon: <BusinessIcon/>,
  //   route: "arena/contest/notstarted",
  //   component: <DummyPage />,
  // },
  {
    type: "collapse",
    name: "Company Position",
    key: "companyposition",
    icon: <BusinessIcon/>,
    route: "/companyposition",
    component: <CompanyPosition />,
  },
  {
    type: "collapse",
    name: "Cohort Position",
    key: "cohortposition",
    icon: <BusinessIcon/>,
    route: "/cohortposition",
    component: <CohortPosition />,
  },

  {
    type: "collapse",
    name: "Trader Position",
    key: "traderposition",
    icon: <BusinessIcon/>,
    route: "/traderposition",
    component: <TraderPosition />,
  },
  {
    type: "collapse",
    name: "Batch",
    key: "batch",
    icon: <BusinessIcon/>,
    route: "/batch",
    component: < Batch />,
  },
  {
    type: "collapse",
    name: "Margin Allocation",
    key: "tradersMarginAllocation",
    icon: <WalletIcon/>,
    route: "/tradersMarginAllocation",
    component: <TradersMarginAllocation />,
  },
  {
    type: "collapse",
    name: "Contests",
    key: "contests",
    icon: <WalletIcon/>,
    route: "/contests",
    component: <Contests />,
  },
  {
    type: "collapse",
    name: "Carousel",
    key: "carousel",
    icon: <HomeIcon/>,
    route: "/carousel",
    component: <Carousel />,
  },
  {
    type: "collapse",
    name: "Careers",
    key: "Career List",
    icon: <HomeIcon/>,
    route: "/Career List",
    component: <CareerList />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "careerDetails",
    // icon: <DashboardIcon/>,
    route: "/Career Details",
    component: <CareerDetails />,
  },

  {
    type: "collapse",
    name: "Algo Position(s)",
    key: "algoposition",
    icon: <EngineeringIcon/>,
    route: "/algoposition",
    component: <AlgoPosition />,
  },

  {
    type: "collapse",
    name: "Referral Programme",
    key: "referralProgramme",
    icon: <DashboardIcon/>,
    route: "/referralProgramme",
    component: <Referral />,
  },
  
  {
    type: "collapse",
    name: "Admin Reports(M)",
    key: "adminreport",
    icon: <SummarizeIcon/>,
    route: "/adminreport",
    component: <AdminReport/>,
  },
  {
    type: "collapse",
    name: "Admin Reports(L)",
    key: "adminreportlive",
    icon: <SummarizeIcon/>,
    route: "/adminreportlive",
    component: <AdminReportLive/>,
  },
  {
    type: "collapse",
    name: "Trader Reports(M)",
    key: "tradersReport",
    icon: <ReportIcon/>,
    route: "/tradersReport",
    component: <TradersReport/>,
  },
  {
    type: "collapse",
    name: "Trader Reports(L)",
    key: "tradersReportlive",
    icon: <ReportIcon/>,
    route: "/tradersReportLive",
    component: <TradersReportLive/>,
  },
  {
    type: "collapse",
    name: "All Orders",
    key: "orders",
    icon: <TableViewIcon/>,
    route: "/orders",
    component: <Orders />,
  },
  {
    type: "collapse",
    name: "Instruments",
    key: "instruments",
    icon:<CandlestickChartIcon/>,
    route: "/instruments",
    component: <Instruments />,
  },
  {
    type: "collapse",
    name: "Algo Box(s)",
    key: "algobox",
    icon: <ManageAccountsIcon/>,
    route: "/algobox",
    component: <AlgoBox />,
  },
  {
    type: "collapse",
    name: "Trading Accounts",
    key: "trading-accounts",
    icon: <AccountBalanceIcon/>,
    route: "/trading-accounts",
    component: <TradingAccount />,
  },
  {
    type: "collapse",
    name: "App Settings",
    key: "setting",
    icon: <SettingsIcon/>,
    route: "/setting",
    component: <Setting />,
  },
  {
    type: "collapse",
    name: "Portfolio",
    key: "portfolio",
    icon: <Shop2Icon/>,
    route: "/portfolio",
    component: <Portfolio />,
  },
  {
    type: "collapse",
    name: "Daily P&L Chart",
    key: "DailyPnlData",
    icon: <QueryStatsIcon/>,
    route: "/DailyPnlData",
    component: <DailyPNLData />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <PersonIcon/>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "New Users Analytics",
    key: "signupanalytics",
    icon: <PersonIcon/>,
    route: "/signupanalytics",
    component: <UserSignupDashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <NotificationsActiveIcon/>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Position",
  //   key: "position",
  //   icon: <BusinessIcon/>,
  //   route: "/position",
  //   component: <UserPosition />,
  // },
  // {
  //   type: "collapse",
  //   name: "User DashBoard",
  //   key: "home",
  //   icon: <HomeIcon/>,
  //   route: "/home",
  //   component: <Home />,
  // },
  {
    type: "collapse",
    name: "Paper Trade",
    key: "papertrade",
    icon: <BusinessIcon/>,
    route: "/papertrade",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "Infinity Trading",
    key: "infinitytrading",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <GiNinjaHeroicStance/>,
    route: "/infinitytrading",
    component: <InfinityTrader />,
  },
  {
    type: "collapse",
    name: "Battle Ground",
    key: "battlestreet",
    icon: <StadiumIcon/>,
    route: "/battlestreet",
    component: <UserContest />,
  },
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
    type: "collapse",
    name: "Orders",
    key: "userorders",
    icon: <InventoryIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  {
    type: "collapse",
    name: "Referrals",
    key: "myreferrals",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <PersonIcon/>,
    route: "/myreferrals",
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
  {
    type: "collapse",
    name: "Funds",
    key: "funds",
    icon: <CurrencyRupeeIcon/>,
    route: "/funds",
    component: <Funds />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <AccountBoxIcon/>,
    route: "/profile",
    component: <Profile />,
  },
  {
    // type: "collapse",
    // name: "Wallet",
    key: "wallet",
    // icon: <AccountBalanceWalletIcon/>,
    route: "/wallet",
    component: <UserWallet />,
  },

];

export default routes;
