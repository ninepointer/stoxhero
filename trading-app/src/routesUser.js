// Material Dashboard 2 React layouts
// import Funds from "./layouts/funds";
import React from "react";
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
import MarginIcon from '@mui/icons-material/Margin';
import { FaAffiliatetheme } from "react-icons/fa";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

//page routes
const Tnc = React.lazy(()=> import( "./layouts/terms/tnc"));
const Profile = React.lazy(()=> import( "./layouts/profile"));
const ContestPage = React.lazy(()=> import( './layouts/UserContest/contestPage'));
const ContestRegisterPage = React.lazy(()=> import( './layouts/UserContest/contestRegistrationPage'));
const ContestTradePage = React.lazy(()=> import( './layouts/UserContest/ContestTrade'));
const ResultPage = React.lazy(()=> import( "./layouts/UserContest/ResultPage"));
const ContestHistory = React.lazy(()=> import( "./layouts/UserContest/ContestHistory"));
const ContestHistoryCard = React.lazy(()=> import( "./layouts/UserContest/ContestHistoryCard"));
const About = React.lazy(()=> import( './layouts/HomePage/pages/About'));
const JD = React.lazy(()=> import( './layouts/HomePage/pages/JobDescription'));
const CareerForm = React.lazy(()=> import( './layouts/HomePage/pages/CareerForm'));
const Contact = React.lazy(()=> import( "./layouts/HomePage/pages/Contact"));
const TradeViewTenX = React.lazy(()=> import( "./layouts/tenXTrading/TradeView/main"));
const InfluencerCourseData = React.lazy(()=> import( './layouts/coursesInfluencer/courseDataIndex'));
const WatchCourse = React.lazy(()=> import( './layouts/coursesUser/watchCourseIndex'));
const UserCourseData = React.lazy(()=> import( './layouts/coursesUser/courseDataIndex'));
const CategoryVideos = React.lazy(()=> import( './layouts/tutorials/Header/categoryVideos'));
const InternshipTrade = React.lazy(()=> import( './layouts/internshipTrading/TradeView/main'));
const InternshipAnalytics = React.lazy(()=> import( './layouts/internshipAnalytics/index'));
const WorkShopOrders = React.lazy(()=> import( './layouts/userorders/workshopOrder'));
const TopContestPerformersList = React.lazy(()=> import( './layouts/StoxHeroTraderDashboard/topPerformerIndex'));
const ContestProfile = React.lazy(()=> import( './layouts/StoxHeroTraderDashboard/contestProfileIndex'));
const ContestTradingWindow = React.lazy(()=> import( './layouts/UserDailyContest/ContestTradingView'));
const CollegeContestTradingWindow = React.lazy(()=> import( './layouts/UserDailyContestCollage/ContestTradingView'));
const MarginXTradingWindow = React.lazy(()=> import( "./layouts/UserMarginX/MarginxTradingView"));
const BattleTradingWindow = React.lazy(()=> import( "./layouts/UserBattle/BattleTradingView"));
const Chart = React.lazy(()=> import( './layouts/charts/index'));
const DailyContestOrder = React.lazy(()=> import( "./layouts/UserDailyContest/Orders"));
const MarginXOrder = React.lazy(()=> import( "./layouts/UserMarginX/Orders"));
const BattleOrder = React.lazy(()=> import( "./layouts/UserBattle/Orders"));
const DailyCollegeContestOrder = React.lazy(()=> import( "./layouts/UserDailyContestCollage/Orders"));
const MarginXDetails = React.lazy(()=> import( './layouts/UserMarginX/Header/marginXDetailsHeader'));
const BattleDetails = React.lazy(()=> import( './layouts/UserBattle/Header/battleDetailsHeader'));
const MarginxResultPage = React.lazy(()=> import( "./layouts/UserMarginX/data/result-page/resultIndex"));
const BattleResultPage = React.lazy(()=> import( "./layouts/UserBattle/data/result-page/resultIndex"));
const CompletedDailyContest = React.lazy(()=> import( "./layouts/UserDailyContest/pastContestMain"));
const CompletedDailyCollegeContest = React.lazy(()=> import( "./layouts/UserDailyContestCollage/pastContestMain"));
const DailyContestResultPage = React.lazy(()=> import( "./layouts/UserDailyContest/data/result-page/resultIndex"));
const DailyCollegeContestResultPage = React.lazy(()=> import( "./layouts/UserDailyContestCollage/data/result-page/resultIndex"));
const CompletedContestLeaderboard = React.lazy(()=> import( './layouts/UserDailyContest/Header/completedContest/completedContestLeaderboard'));
const PaymentStatus = React.lazy(()=> import( "./layouts/paymentTest/paymentStatus"));

// import MyPortfolio from './layouts/UserPortfolio'
// import FAQs from "./layouts/FAQs";
// import UserWallet from "./layouts/userWallet"
// import TenXTrading from "./layouts/tenXTrading"
// import UserAnalytics from "./layouts/userAnalytics"
// import Internship from './layouts/internshipTrading';
// import StoxHeroDashboard from './layouts/StoxHeroTraderDashboard'
// import UserDailyContest from './layouts/UserDailyContest'
// import UserDailyContestCollage from './layouts/UserDailyContestCollage';
// import MarginX from './layouts/UserMarginX'
// import ContestScoreboard from './layouts/contestScoreboard'
// import Notifications from './layouts/userNotification';
// import UserPosition from "./layouts/PaperTrade/userPosition";
// import AffiliateDashboard from "./layouts/myAffiliateDashboard"
// import TutorialVideo from './layouts/tutorials';
// import InfluencerCourse from './layouts/coursesInfluencer';
// import InfluencerDashboard from './layouts/myInfluencerDashboard';
// import UserCourse from './layouts/coursesUser';
// import UserOrders from "./layouts/userorders";
// import MyReferrals from "./layouts/referrals"

const UserOrders = React.lazy(() => import("./layouts/userorders"));
const MyReferrals = React.lazy(() => import("./layouts/referrals"));
const MyPortfolio = React.lazy(() => import("./layouts/UserPortfolio"));
const FAQs = React.lazy(() => import("./layouts/FAQs"));
const UserWallet = React.lazy(() => import("./layouts/userWallet"));
const TenXTrading = React.lazy(() => import("./layouts/tenXTrading"));
const UserAnalytics = React.lazy(() => import("./layouts/userAnalytics"));
const Internship = React.lazy(() => import("./layouts/internshipTrading"));
const StoxHeroDashboard = React.lazy(() => import("./layouts/StoxHeroTraderDashboard"));
const UserDailyContest = React.lazy(() => import("./layouts/UserDailyContest"));
const UserDailyContestCollage = React.lazy(() => import("./layouts/UserDailyContestCollage"));
const MarginX = React.lazy(() => import("./layouts/UserMarginX"));
const ContestScoreboard = React.lazy(() => import("./layouts/contestScoreboard"));
const Notifications = React.lazy(() => import("./layouts/userNotification"));
const TutorialVideo = React.lazy(() => import("./layouts/tutorials"));
const InfluencerCourse = React.lazy(() => import("./layouts/coursesInfluencer"));
const InfluencerDashboard = React.lazy(() => import("./layouts/myInfluencerDashboard"));
const UserCourse = React.lazy(() => import("./layouts/coursesUser"));
const AffiliateDashboard = React.lazy(() => import("./layouts/myAffiliateDashboard"));
const UserPosition = React.lazy(() => import("./layouts/PaperTrade/userPosition"));

const routes = [
  {
    type: "collapse",
    name: "Influencer Dashboard",
    key: "myinfluencerdashboard",
    icon: <FaAffiliatetheme/>,
    route: "/myinfluencerdashboard",
    component: <InfluencerDashboard />,
  },
  {
    type: "collapse",
    name: "Affiliate Dashboard",
    key: "myaffiliatedashboard",
    icon: <FaAffiliatetheme/>,
    route: "/myaffiliatedashboard",
    component: <AffiliateDashboard />,
  },
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
    type: "collapse",
    name: "Courses",
    key: "courses",
    icon: <LocalLibraryIcon/>,
    route: "/courses",
    component: <UserCourse />,
  },
  {
    type: "collapse",
    name: "Course",
    key: "course",
    icon: <AutoStoriesIcon/>,
    route: "/course",
    component: <InfluencerCourse />,
  },
  {
    // type: "collapse",
    // name: "Course",
    key: "course",
    // icon: <VideoChatIcon/>,
    route: "/coursedata",
    component: <InfluencerCourseData />,
  },
  {
    // type: "collapse",
    // name: "Course",
    key: "watchcourse",
    // icon: <VideoChatIcon/>,
    route: "/watchcourse",
    component: <WatchCourse />,
  },
  {
    // type: "collapse",
    // name: "Course",
    key: "courses",
    // icon: <VideoChatIcon/>,
    route: "/coursefulldata",
    component: <UserCourseData />,
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
