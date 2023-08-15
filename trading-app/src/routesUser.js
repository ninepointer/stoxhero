// Material Dashboard 2 React layouts
// import Funds from "./layouts/funds";
import Profile from "./layouts/profile";

// @mui icons

// import StadiumIcon from '@mui/icons-material/Stadium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ReorderIcon from '@mui/icons-material/Reorder';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import HelpIcon from '@mui/icons-material/Help';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import { GiNinjaHeroicStance } from 'react-icons/gi';

//page routes
import Tnc from "./layouts/terms/tnc";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/PaperTrade/index";
// import UserReport from "./layouts/userreports";
import MyReferrals from "./layouts/referrals"
// import UserContest from "./layouts/UserContest"
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
import About from './layouts/HomePage/pages/About'
// import Careers from './layouts/HomePage/pages/Career'
// import WorkShops from './layouts/HomePage/pages/Workshop'
import Home from './layouts/HomePage/pages/Home'
import JD from './layouts/HomePage/pages/JobDescription'
import CareerForm from './layouts/HomePage/pages/CareerForm'
import Contact from "./layouts/HomePage/pages/Contact";
import TradeViewTenX from "./layouts/tenXTrading/TradeView/main";
import TutorialVideo from './layouts/tutorials'
import CategoryVideos from './layouts/tutorials/Header/categoryVideos';
import Internship from './layouts/internshipTrading';
import InternshipTrade from './layouts/internshipTrading/TradeView/main'
import InternshipAnalytics from './layouts/internshipAnalytics/index';
// import logo from "../src/assets/images/logo1.jpeg"
import WorkShopOrders from './layouts/userorders/workshopOrder'
import StoxHeroDashboard from './layouts/StoxHeroTraderDashboard'
import UserDailyContest from './layouts/UserDailyContest'
import UserDailyContestCollage from './layouts/UserDailyContestCollage';
import UserBattle from './layouts/UserBattle'
import SchoolIcon from '@mui/icons-material/School';
import BattleDetails from './layouts/UserBattle/battleInfo'

import ContestTradingWindow from './layouts/UserDailyContest/ContestTradingView'
import CollegeContestTradingWindow from './layouts/UserDailyContestCollage/ContestTradingView'

import Chart from './layouts/charts/index';
import DailyContestOrder from "./layouts/UserDailyContest/Orders"
import DailyCollegeContestOrder from "./layouts/UserDailyContestCollage/Orders"

import CompletedDailyContest from "./layouts/UserDailyContest/pastContestMain"
import CompletedDailyCollegeContest from "./layouts/UserDailyContestCollage/pastContestMain"
import DailyContestResultPage from "./layouts/UserDailyContest/data/result-page/resultIndex"
import ContestScoreboard from './layouts/contestScoreboard'
import DailyCollegeContestResultPage from "./layouts/UserDailyContestCollage/data/result-page/resultIndex"
import BattleIcon from "./assets/images/swords.png"

import Challenge from './layouts/UserDailyChallenge'
const routes = [

  {
    route: "/completedcontests",
    component: <CompletedDailyContest />,
  },
  {
    route: "/completedcollegecontests",
    component: <CompletedDailyCollegeContest />,
  },
  {
    route: "/completedcontests/:name",
    component: <DailyContestOrder />,
  },
  {
    route: "/completedcollegecontests/:name",
    component: <DailyCollegeContestOrder />,
  },
  {

    route: "about",
    component: <About />,
  },
  
  {

    route: "jobdescription",
    component: <JD />,
  },
  {

    route: "home",
    component: <Home />,
  },
  {

    route: "apply",
    component: <CareerForm />,
  },
  {
    route: "contact",
    component: <Contact />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "stoxherodashboard",
    icon: <DashboardIcon/>,
    route: "/stoxherodashboard",
    component: <StoxHeroDashboard />,
  },
  {
    type: "collapse",
    name: "Virtual Trading",
    key: "virtualtrading",
    icon: <MilitaryTechIcon/>,
    route: "/virtualtrading",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "Battle Ground",
    key: "battleground",
    icon: <img src={BattleIcon} width={15}></img>,
    route: "/battleground",
    component: <UserBattle />,
  },
  {
    type: "collapse",
    name: "Contests",
    key: "contest",
    icon: <EmojiEventsIcon/>,
    route: "/contest",
    component: <UserDailyContest />,
  },
  {
    // type: "collapse",
    // name: "College Contest",
    key: "collegecontest",
    // 
    // icon: <SchoolIcon/>,
    route: "/collegecontest",
    component: <UserDailyContestCollage />,
  },
  {
    type: "collapse",
    name: "TenX Trading",
    key: "tenxtrading",
    icon: <CurrencyRupeeIcon/>,
    route: "/tenxtrading",
    component: <TenXTrading />,
  },
  {
    type: "collapse",
    name: "Internship/WorkShop",
    key: "internship",
    icon: <MenuBookIcon/>,
    route: "/internship",
    component: <Internship />,
  },
  // {
  //   type: "collapse",
  //   name: "Challenges",
  //   key: "challenges",
  //   icon: <MilitaryTechIcon/>,
  //   route: "/challenges",
  //   component: <Challenge />,
  // },
  {
    route: "/workshop",
    component: <Internship />,
  },
  {

    route: "/tenxtrading/:name",
    component: <TradeViewTenX />,
  },
  {

    route: "/battleground/BattleOfTeens",
    component: <BattleDetails />,
  },
  {

    route: "/tutorials/:category",
    component: <CategoryVideos />,
  },
  {

    route: "/battlestreet/:name",
    component: <ContestPage />,
  },
  {

    route: "/contest/:name",
    component: <ContestTradingWindow />,
  },
  {

    route: "/collegecontest/:name",
    component: <CollegeContestTradingWindow />,
  },
  {

    route: "battlestreet/:name/register",
    component: <ContestRegisterPage />,
  },
  {

    route: "battlestreet/:name/trade",
    component: <ContestTradePage />,
  },
  {

    route: "battlestreet/result",
    component: <ResultPage />,
  },
  {
    route: "contest/result",
    component: <DailyContestResultPage />,
  },
  {
    route: "collegecontest/result",
    component: <DailyCollegeContestResultPage />,
  },
  {

    route: "battlestreet/history",
    component: <ContestHistory />,
  },
  {

    route: "battlestreet/history/:name",
    component: <ContestHistoryCard />,
  },
  {
    // type: "collapse",
    // name: "Contest Scoreboard",
    key: "contestscoreboard",
    // icon: <EmojiEventsIcon/>,
    route: "/contestscoreboard",
    component: <ContestScoreboard />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
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
    icon: <AnalyticsIcon/>,
    route: "/analytics",
    component: <UserAnalytics />,
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
    key: "wallet",
    route: "/wallet",
    component: <UserWallet />,
  },
  {
    type: "collapse",
    name: "FAQs",
    key: "faqs",
    icon: <HelpIcon/>,
    route: "/faqs",
    component: <FAQs />,
  },
  {
    type: "collapse",
    name: "Tutorials",
    key: "tutorials",
    icon: <VideoChatIcon/>,
    route: "/tutorials",
    component: <TutorialVideo />,
  },
  {
    key: "profile",
    route: "/profile",
    component: <Profile />,
  },
  {
    icon: <PersonPinIcon/>,
    route: "/terms",
    component: <Tnc />,
  },
  {
    icon: <PersonPinIcon/>,
    route: "/terms",
    component: <Tnc />,
  },
  {
    route: "/internship/trade",
    component: <InternshipTrade/>,
  },
  {

    route: "/workshop/trade",
    component: <InternshipTrade/>,
  },
  {

    route: "/workshop/orders",
    component: <WorkShopOrders/>,
  },
  {

    route: "/internship/analytics",
    component: <InternshipAnalytics/>,
  },
  {

    route: "/chart",
    component: <Chart/>,
  },
];


export default routes;
