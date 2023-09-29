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
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import MarginIcon from '@mui/icons-material/Margin';
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
import MyPortfolio from './layouts/UserPortfolio'
import ResultPage from "./layouts/UserContest/ResultPage";
import ContestHistory from "./layouts/UserContest/ContestHistory";
import ContestHistoryCard from "./layouts/UserContest/ContestHistoryCard";
import FAQs from "./layouts/FAQs";
import UserWallet from "./layouts/userWallet"
import TenXTrading from "./layouts/tenXTrading"
import UserAnalytics from "./layouts/userAnalytics"
import About from './layouts/HomePage/pages/About'
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
import WorkShopOrders from './layouts/userorders/workshopOrder'
import StoxHeroDashboard from './layouts/StoxHeroTraderDashboard'
import UserDailyContest from './layouts/UserDailyContest'
import UserDailyContestCollage from './layouts/UserDailyContestCollage';
import UserBattle from './layouts/UserBattle'
import SchoolIcon from '@mui/icons-material/School';
// import BattleDetails from './layouts/UserBattle/battleInfo'

import ContestTradingWindow from './layouts/UserDailyContest/ContestTradingView'
import CollegeContestTradingWindow from './layouts/UserDailyContestCollage/ContestTradingView'
import MarginXTradingWindow from "./layouts/UserMarginX/MarginxTradingView";
import BattleTradingWindow from "./layouts/UserBattle/BattleTradingView";

import Chart from './layouts/charts/index';
import DailyContestOrder from "./layouts/UserDailyContest/Orders"
import MarginXOrder from "./layouts/UserMarginX/Orders"
import BattleOrder from "./layouts/UserBattle/Orders"
import DailyCollegeContestOrder from "./layouts/UserDailyContestCollage/Orders"

import MarginX from './layouts/UserMarginX'
import Battle from './layouts/UserBattle'
import MarginXDetails from './layouts/UserMarginX/Header/marginXDetailsHeader'
import BattleDetails from './layouts/UserBattle/Header/battleDetailsHeader'

import MarginxResultPage from "./layouts/UserMarginX/data/result-page/resultIndex"
import BattleResultPage from "./layouts/UserBattle/data/result-page/resultIndex"

import CompletedDailyContest from "./layouts/UserDailyContest/pastContestMain"
import CompletedDailyCollegeContest from "./layouts/UserDailyContestCollage/pastContestMain"
import DailyContestResultPage from "./layouts/UserDailyContest/data/result-page/resultIndex"
import ContestScoreboard from './layouts/contestScoreboard'
import DailyCollegeContestResultPage from "./layouts/UserDailyContestCollage/data/result-page/resultIndex"
import BattleIcon from "./assets/images/swords.png"
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Notifications from './layouts/userNotification';
import CompletedContestLeaderboard from './layouts/UserDailyContest/Header/completedContest/completedContestLeaderboard'
// import Challenge from './layouts/UserDailyChallenge'
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
    route: "/marginxs/:name/:date",
    component: <MarginXDetails />,
  },
  {
    route: "/battles/:name/:date",
    component: <BattleDetails />,
  },
  {
    route: "/completedcontests/:name",
    component: <DailyContestOrder />,
  },
  {
    route: "/completedcontests/:name/leaderboard",
    component: <CompletedContestLeaderboard />,
  },
  {
    route: "/completedmarginxs/:name",
    component: <MarginXOrder />,
  },
  {
    route: "/completedbattles/:name",
    component: <BattleOrder />,
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
  // {
  //   route: "home",
  //   component: <Home />,
  // },
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
    key: "battles",
    icon: <LocalFireDepartmentIcon/>,
    route: "/battles",
    component: <Battle />,
  },
  {
    type: "collapse",
    name: "MarginXs",
    key: "marginxs",
    icon: <MarginIcon/>,
    route: "/marginxs",
    component: <MarginX />,
  },
  {
    type: "collapse",
    name: "Contests",
    key: "contests",
    icon: <EmojiEventsIcon/>,
    route: "/contests",
    component: <UserDailyContest />,
  },
  {
    type: "collapse",
    name: "College Contests",
    key: "collegecontests",
    icon: <SchoolIcon/>,
    route: "/collegecontests",
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
  {
    route: "/workshop",
    component: <Internship />,
  },
  {

    route: "/tenxtrading/:name",
    component: <TradeViewTenX />,
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
    route: "/contests/:name",
    component: <ContestTradingWindow />,
  },
  {
    route: "/marginx/:name",
    component: <MarginXTradingWindow />,
  },
  {
    route: "/battles/:name",
    component: <BattleTradingWindow />,
  },
  {
    route: "/collegecontests/:name",
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
    route: "contests/result",
    component: <DailyContestResultPage />,
  },

  {
    route: "marginx/result",
    component: <MarginxResultPage />,
  },
  {
    route: "battle/result",
    component: <BattleResultPage />,
  },
  {
    route: "collegecontests/result",
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
    key: "notifications",
    route: "/notifications",
    component: <Notifications />,
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
