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
import VirtualTrading from './layouts/VirtualTrading'
//page routes
import Tnc from "./layouts/terms/tnc";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/PaperTrade/userPosition";
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
import TopContestPerformersList from './layouts/StoxHeroTraderDashboard/topPerformerIndex'
import ContestProfile from './layouts/StoxHeroTraderDashboard/contestProfileIndex'
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
import CompletedContestLeaderboard from './layouts/UserDailyContest/Header/completedContest/completedContestLeaderboard';
import PaymentStatus from "./layouts/paymentTest/paymentStatus";
// import Challenge from './layouts/UserDailyChallenge'
const routes = [

  {
    route: "/completedtestzone",
    component: <CompletedDailyContest />,
  },
  {
    route: "/testzoneprofile/:name",
    component: <ContestProfile />,
  },
  {
    route: "/toptestzoneportfolios",
    component: <TopContestPerformersList />,
  },
  {
    route: "/completedcollegetestzone",
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
    route: "/completedtestzone/:name",
    component: <DailyContestOrder />,
  },
  {
    route: "/completedtestzone/:name/leaderboard",
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
    route: "/completedcollegetestzone/:name",
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
    route: "apply",
    component: <CareerForm />,
  },
  {
    route: "contact",
    component: <Contact />,
  },
  {
    type: "collapse",
    name: "Home",
    key: "home",
    icon: <DashboardIcon/>,
    route: "/home",
    component: <StoxHeroDashboard />,
  },
  {
    type: "collapse",
    name: "Market",
    key: "market",
    icon: <MilitaryTechIcon/>,
    route: "/market",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "TestZone",
    key: "testzone",
    icon: <EmojiEventsIcon/>,
    route: "/testzone",
    component: <UserDailyContest />,
  },
  {
    type: "collapse",
    name: "TenX",
    key: "tenxtrading",
    icon: <CurrencyRupeeIcon/>,
    route: "/tenxtrading",
    component: <TenXTrading />,
  },
  {
    type: "collapse",
    name: "MarginX",
    key: "marginxs",
    icon: <MarginIcon/>,
    route: "/marginxs",
    component: <MarginX />,
  },
  {
    type: "collapse",
    name: "College TestZone",
    key: "collegetestzone",
    icon: <SchoolIcon/>,
    route: "/collegetestzone",
    component: <UserDailyContestCollage />,
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
    route: "/testzone/:name",
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
    route: "/collegetestzone/:name",
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
    route: "testzone/result",
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
    route: "collegetestzone/result",
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
    key: "testzonescoreboard",
    // icon: <EmojiEventsIcon/>,
    route: "/testzonescoreboard",
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
    name: "MarketGuru",
    key: "marketguru",
    icon: <AnalyticsIcon/>,
    route: "/marketguru",
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
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/paymenttest/status",
    component: <PaymentStatus/>,
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
