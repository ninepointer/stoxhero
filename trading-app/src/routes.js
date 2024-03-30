// Material Dashboard 2 React layouts
import {lazy} from 'react';
import { FaRupeeSign } from "react-icons/fa";
import { FaAffiliatetheme } from "react-icons/fa";
import SchoolIcon from '@mui/icons-material/School';
// import BatchIcon from '@mui/icons-material/Diversity3';
// import Shop2Icon from '@mui/icons-material/Shop2';
// import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import ReportIcon from '@mui/icons-material/Assessment';
// import QueryStatsIcon from '@mui/icons-material/QueryStats';
// import InventoryIcon from '@mui/icons-material/Inventory'; 
import PersonIcon from '@mui/icons-material/Person';
// import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WalletIcon from '@mui/icons-material/Wallet';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Forward10Icon from '@mui/icons-material/Forward10';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
// import TryIcon from '@mui/icons-material/Try';
import MenuBookIcon from '@mui/icons-material/MenuBook';
// import HomeIcon from '@mui/icons-material/OtherHouses';
// import AnalyticsIcon from '@mui/icons-material/Analytics';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BookIcon from '@mui/icons-material/Book';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';



// import CompanyPosition from "./layouts/companyposition";
// import CompanyPositionRedis from "./layouts/companypositionRedis";
// import CohortPosition from "./layouts/cohortposition";
// import TenXDashboard from "./layouts/tenxdashboard";
// import TraderDashboard from "./layouts/traderdashboard";
// import Orders from "./layouts/company-orders";
// import Instruments from "./layouts/instruments";
// import TradingAccount from "./layouts/trading-account";
// import Users from "./layouts/users";
// import AlgoBox from "./layouts/algobox";
// import Funds from "./layouts/funds";
// import Profile from "./layouts/profile";
// import Setting from "./layouts/settings/Setting";
// import UserOrders from "./layouts/userorders";
// import UserPosition from "./layouts/PaperTrade";
// import TradersReport from "./layouts/tradersReportMock";
// import AdminReport from "./layouts/adminreportMock";
// import DailyPNLData from "./layouts/dailyPnlDashboard";
// import TraderPosition from "./layouts/traderPosition"
// import InternPosition from "./layouts/internPosition"
// import TradersReportLive from "./layouts/tradersReportLive"
// import TradersMarginAllocation from "./layouts/tradersMarginAllocation"
// import SignUp from './layouts/authentication/sign-up'
// import SignIn from './layouts/authentication/sign-in'
// import ResetPassword from './layouts/authentication/reset-password/cover'
// import Response from './layouts/authentication/sign-up/responseSubmit'
// import MyReferrals from "./layouts/referrals"
// import Portfolio from './layouts/portfolio'
// import CreatePortfolio from './layouts/portfolio/createPortfolio'
// import CarouselDetails from './layouts/carousel/carouselDetails'
// import BrokerReportDetails from './layouts/brokerReport/brokerReportDetails'
// import CareerList from './layouts/career'
// import CareerDetails from './layouts/career/careerDetails'
// import BatchDetails from './layouts/internBatch/batchDetails'
// import DailyContestDetails from './layouts/dailyContest/dailyContestDetails'
// import NotificationDetails from './layouts/notificationGroup/notificationDetails'
// import FullCollegeDetail from './layouts/createCollege/collegeDetails'
// import SendNotificationDetails from './layouts/sendNotification/sendNotificationDetails'
// import CampaignDetails from './layouts/campaign/campaignDetails'
// import ReferralProgramDetails from './layouts/referral-program/ReferralProgramDetails'
// import ContestPage from './layouts/UserContest/contestPage'
// import ContestRegisterPage from './layouts/UserContest/contestRegistrationPage'
// import ContestTradePage from './layouts/UserContest/ContestTrade'
// import Carousel from './layouts/carousel'
// import BrokerReport from './layouts/brokerReport'
// import UserSignupDashboard from './layouts/userSignupDashboard'
// import Campaigns from './layouts/campaign'
// import TutorialVideos from './layouts/tutorialVideos';
// import Internship from './layouts/internshipTrading';
// import InternshipTrade from './layouts/internshipTrading/TradeView/main'
// import CollegeDetails from './layouts/college/collegeDetails'
// import CouponDetails from './layouts/coupons/couponDetails'
// import MyPortfolio from './layouts/UserPortfolio'
// import BackReportXTS from "./layouts/backReportXTS";
// import OverallPnlTrader from "./layouts/overallPnlTrader";
// import StoxHeroDashboard from './layouts/StoxHeroTraderDashboard'
// import RevenueDashboard from './layouts/revenueDashboard'
// import RevenueAnalytics from './layouts/reveneuAnalytics'
// import AdminDashboard from './layouts/AdminDashboard'
// import AffiliateDashboard from './layouts/affiliateDashboard'
// import InfluencerDashboard from './layouts/InfluencerDashboard'
// import ChallengeDashboard from './layouts/challengeDashboard'
// import DailyContestDashboard from './layouts/dailyContestDashboard'
// import BattleDashboard from './layouts/battleDashboard'
// import PaymentTest from './layouts/paymentTest/index'
// import ContestScoreboard from './layouts/contestScoreboard'
// import StoxHeroUserDashboard from './layouts/StoxHeroDashboard'
// import MarginXReport from "./layouts/marginxReport";
// import Coupons from './layouts/coupons'
// import Blogs from './layouts/blog'
// import BlogDetails from './layouts/blog/blogDetails'
// import BlogForm from './layouts/blog/blogDetails'
// import LearningModule from './layouts/learningModule'
// import LearningModuleDetails from './layouts/learningModule/moduleChapterIndex'
// import ModuleChapterDetails from './layouts/learningModule/moduleChapterIndex'
// import AffiliateProgram from './layouts/affiliateProgram'
// import AffiliateProgramDetails from './layouts/affiliateProgram/AffiliateProgramDetails'
// import Referral from "./layouts/referral-program";
// import Batch from "./layouts/batch";
// import InfinityTrader from "./layouts/InfinityTrading"
// import UserAnalytics from "./layouts/userAnalytics";
// import UserWallet from "./layouts/userWallet"
// import About from './layouts/HomePage/pages/About'
// import Blog from './layouts/HomePage/pages/BlogCards'
// import Careers from './layouts/HomePage/pages/Career'
// import JobForm from './layouts/HomePage/pages/EICCareerForm'
// import Workshops from './layouts/HomePage/pages/Workshop'
// import Home from './layouts/HomePage/pages/Home'
// import JD from './layouts/HomePage/pages/JobDescription'
// import CareerForm from './layouts/HomePage/pages/CareerForm'
// import TenXSubscription from './layouts/tenXSubscription'
// import TenXSubscriptionForm from './layouts/tenXSubscription/TenXSubscriptionDetails'
// import TutorialCategoryForm from './layouts/tutorialVideos/tutorialCategoryDetails'
// import TradingHolidaysDetails from './layouts/tradingHolidays'
// import TradingHolidayForm from './layouts/tradingHolidays/data/tradingHolidayDetails'
// import Contact from "./layouts/HomePage/pages/Contact"; 
// import CreatePaymentHeader from "./layouts/Payment/CreatePaymentHeader";
// import College from "./layouts/college";
// import InternBatch from "./layouts/internBatch";
// import DailyContest from "./layouts/dailyContest";
// import NotificationGroup from "./layouts/notificationGroup";
// import FullCollege from "./layouts/createCollege";
// import NotificationSend from "./layouts/sendNotification";
// import Battles from "./layouts/battle";
// import CollegeEdit from './layouts/college/CollegeEdit'
// import TenXTrading from "./layouts/tenXTrading"
// import VirtualPosition from "./layouts/virtualtradePosition";
// import StockPosition from "./layouts/stockTradePosition";
// import TenxPosition from "./layouts/tenxPosition";
// import DailyContestPosition from "./layouts/dailyContestPosition";
// import DailyContestPositionTrader from "./layouts/dailyContestPositionTrader";
// import MarginXPosition from "./layouts/marginxCompanyPosition";
// import MarginXPositionTrader from "./layouts/marginxTraderPosition";
// import KYC from './layouts/KYC/index';
// import MarginDetails from './layouts/margindetails'
// import CareerDashboard from './layouts/careerdashboard'
// import VirtualDashboard from './layouts/virtualdashboard'
// import StockDashboard from './layouts/stockDashboard'
// import InternshipOrders from './layouts/internshipOrders'
// import StockOrders from './layouts/stockOrders';
// import ContactInfo from './layouts/ContactInfo';
// import TenxReport from "./layouts/tenXReport";
// import DailyContestReport from "./layouts/dailyContestReport";
// import InternReport from "./layouts/internReport";
// import InternshipLeaderboard from './layouts/leaderBoard/internshipLeaderboard'
// import AdminMockReport from './layouts/adminSideReportMock'
// import AdminLiveReport from './layouts/adminSideReportLive'
// import WorkShopOrders from './layouts/userorders/workshopOrder';
// import Chart from './layouts/charts/index';
// import Withdrawal from "./layouts/withdrawals";
// import WalletPayment from "./layouts/walletPayment";
// import PaymentStatus from "./layouts/paymentTest/paymentStatus";
// import InfinityContest from "./layouts/dailyContestDashboard/data/infinityContestHeader"
// import DailyContestLiveReport from "./layouts/dailyContestReportLive"
// import ContestMaster from "./layouts/dailyContest/contestMaster/contestMaster"
// import CreateContestMasterHeader from "./layouts/dailyContest/contestMaster/createContestMasterHeader";
// import MarginXDashboard from "./layouts/marginXDashboard"
// import MarginXTemplateDetail from "./layouts/marginXTemplate"
// import ChallengeTemplateDetail from "./layouts/challengeTemplate"
// import ChallengeTemplateForm from "./layouts/challengeTemplate/challengeTemplateIndex"
// import BattleTemplateDetail from "./layouts/battleTemplate"
// import BattleTemplateForm from "./layouts/battleTemplate/battleTemplateIndex"
// import CreateMarginXTemplate from "./layouts/marginXTemplate/createMarginIndex"
// import CreateMarginX from "./layouts/marginX/createMarginIndex"
// import CreateBattle from "./layouts/battle/createBattleIndex"
// import MarginX from "./layouts/marginX"
// import BattlePosition from "./layouts/battleTraderPosition";
// import BattleReport from "./layouts/battleReport";
// import DailyContestAnalytics from "./layouts/dailyContestAnalytics"
// import TenXSubscribers from "./layouts/tenXSubscribers"
// import MarketingFunnel from "./layouts/marketingDashboard"
// import Quiz from './layouts/quiz'
// import City from './layouts/city'
// import QuizDetails from './layouts/quiz/quizDetails'
// import CityDetails from './layouts/city/cityDetails'
// import Register from "./layouts/authentication/sign-up/register"
// import RegisterInfo from "./layouts/authentication/sign-up/registerationinfo"
// import Lobby from "./layouts/schoolLobby/lobby"
// import QuestionBankDetails from './layouts/questionBank/questionBankDetails';
// import QuestionBank from './layouts/questionBank';
// import SchoolDetails from './layouts/schoolOnboarding/schoolDetails';
// import School from './layouts/schoolOnboarding';
// import CourseDetails from './layouts/courses/courseDetails';
// import Course from './layouts/courses';
// import AllTransaction from './layouts/allWalletTransaction';


const CompanyPosition = lazy(()=> import("./layouts/companyposition"));
const CompanyPositionRedis = lazy(()=> import("./layouts/companypositionRedis"));
const CohortPosition = lazy(()=> import("./layouts/cohortposition"));
const TenXDashboard = lazy(()=> import("./layouts/tenxdashboard"));
const TraderDashboard = lazy(()=> import("./layouts/traderdashboard"));
const Orders = lazy(()=> import("./layouts/company-orders"));
const Instruments = lazy(()=> import("./layouts/instruments"));
const TradingAccount = lazy(()=> import("./layouts/trading-account"));
const Users = lazy(()=> import("./layouts/users"));
const AlgoBox = lazy(()=> import("./layouts/algobox"));
const Funds = lazy(()=> import("./layouts/funds"));
const Profile = lazy(()=> import("./layouts/profile"));
const Setting = lazy(()=> import("./layouts/settings/Setting"));
const UserOrders = lazy(()=> import("./layouts/userorders"));
const UserPosition = lazy(()=> import("./layouts/PaperTrade"));
const TradersReport = lazy(()=> import("./layouts/tradersReportMock"));
// const AdminReport = lazy(()=> import("./layouts/adminreportMock"));
// const DailyPNLData = lazy(()=> import("./layouts/dailyPnlDashboard"));
const TraderPosition = lazy(()=> import("./layouts/traderPosition"));
const InternPosition = lazy(()=> import("./layouts/internPosition"));
const TradersReportLive = lazy(()=> import("./layouts/tradersReportLive"));
const TradersMarginAllocation = lazy(()=> import("./layouts/tradersMarginAllocation"));
const SignUp = lazy(()=> import('./layouts/authentication/sign-up'));
const SignIn = lazy(()=> import('./layouts/authentication/sign-in'));
const ResetPassword = lazy(()=> import('./layouts/authentication/reset-password/cover'));
const Response = lazy(()=> import('./layouts/authentication/sign-up/responseSubmit'));
const MyReferrals = lazy(()=> import("./layouts/referrals"));
const Portfolio = lazy(()=> import('./layouts/portfolio'));
const CreatePortfolio = lazy(()=> import('./layouts/portfolio/createPortfolio'));
const CarouselDetails = lazy(()=> import('./layouts/carousel/carouselDetails'));
const BrokerReportDetails = lazy(()=> import('./layouts/brokerReport/brokerReportDetails'));
const CareerList = lazy(()=> import('./layouts/career'));
const CareerDetails = lazy(()=> import('./layouts/career/careerDetails'));
const BatchDetails = lazy(()=> import('./layouts/internBatch/batchDetails'));
const DailyContestDetails = lazy(()=> import('./layouts/dailyContest/dailyContestDetails'));
const NotificationDetails = lazy(()=> import('./layouts/notificationGroup/notificationDetails'));
const FullCollegeDetail = lazy(()=> import('./layouts/createCollege/collegeDetails'));
const SendNotificationDetails = lazy(()=> import('./layouts/sendNotification/sendNotificationDetails'));
const CampaignDetails = lazy(()=> import('./layouts/campaign/campaignDetails'));
const ReferralProgramDetails = lazy(()=> import('./layouts/referral-program/ReferralProgramDetails'));
const ContestPage = lazy(()=> import('./layouts/UserContest/contestPage'));
const ContestRegisterPage = lazy(()=> import('./layouts/UserContest/contestRegistrationPage'));
const ContestTradePage = lazy(()=> import('./layouts/UserContest/ContestTrade'));
const Carousel = lazy(()=> import('./layouts/carousel'));
const BrokerReport = lazy(()=> import('./layouts/brokerReport'));
const UserSignupDashboard = lazy(()=> import('./layouts/userSignupDashboard'));
const Campaigns = lazy(()=> import('./layouts/campaign'));
const TutorialVideos = lazy(()=> import('./layouts/tutorialVideos'));
const Internship = lazy(()=> import('./layouts/internshipTrading'));
const InternshipTrade = lazy(()=> import('./layouts/internshipTrading/TradeView/main'));
const CollegeDetails = lazy(()=> import('./layouts/college/collegeDetails'));
const CouponDetails = lazy(()=> import('./layouts/coupons/couponDetails'));
const MyPortfolio = lazy(()=> import('./layouts/UserPortfolio'));
// const BackReportXTS = lazy(()=> import("./layouts/backReportXTS"));
// const OverallPnlTrader = lazy(()=> import("./layouts/overallPnlTrader"));
// const StoxHeroDashboard = lazy(()=> import('./layouts/StoxHeroTraderDashboard'));
const RevenueDashboard = lazy(()=> import('./layouts/revenueDashboard'));
const RevenueAnalytics = lazy(()=> import('./layouts/reveneuAnalytics'));
const AdminDashboard = lazy(()=> import('./layouts/AdminDashboard'));
const AffiliateDashboard = lazy(()=> import('./layouts/affiliateDashboard'));
// const InfluencerDashboard = lazy(()=> import('./layouts/InfluencerDashboard'));
// const ChallengeDashboard = lazy(()=> import('./layouts/challengeDashboard'));
const DailyContestDashboard = lazy(()=> import('./layouts/dailyContestDashboard'));
// const BattleDashboard = lazy(()=> import('./layouts/battleDashboard'));
const PaymentTest = lazy(()=> import('./layouts/paymentTest/index'));
const ContestScoreboard = lazy(()=> import('./layouts/contestScoreboard'));
const StoxHeroUserDashboard = lazy(()=> import('./layouts/StoxHeroDashboard'));
const MarginXReport = lazy(()=> import("./layouts/marginxReport"));
const Coupons = lazy(()=> import('./layouts/coupons'));
const Blogs = lazy(()=> import('./layouts/blog'));
const BlogDetails = lazy(()=> import('./layouts/blog/blogDetails'));
const BlogForm = lazy(()=> import('./layouts/blog/blogDetails'));
const LearningModule = lazy(()=> import('./layouts/learningModule'));
const LearningModuleDetails = lazy(()=> import('./layouts/learningModule/moduleChapterIndex'));
const ModuleChapterDetails = lazy(()=> import('./layouts/learningModule/moduleChapterIndex'));
const AffiliateProgram = lazy(()=> import('./layouts/affiliateProgram'));
const AffiliateProgramDetails = lazy(()=> import('./layouts/affiliateProgram/AffiliateProgramDetails'));
const Referral = lazy(()=> import("./layouts/referral-program"));
// const Batch = lazy(()=> import("./layouts/batch"));
const InfinityTrader = lazy(()=> import("./layouts/InfinityTrading"));
const UserAnalytics = lazy(()=> import("./layouts/userAnalytics"));
const UserWallet = lazy(()=> import("./layouts/userWallet"));
const About = lazy(()=> import('./layouts/HomePage/pages/About'));
// const Blog = lazy(()=> import('./layouts/HomePage/pages/BlogCards'));
const Careers = lazy(()=> import('./layouts/HomePage/pages/Career'));
const JobForm = lazy(()=> import('./layouts/HomePage/pages/EICCareerForm'));
const Workshops = lazy(()=> import('./layouts/HomePage/pages/Workshop'));
// const Home = lazy(()=> import('./layouts/HomePage/pages/Home'));
const JD = lazy(()=> import('./layouts/HomePage/pages/JobDescription'));
const CareerForm = lazy(()=> import('./layouts/HomePage/pages/CareerForm'));
const TenXSubscription = lazy(()=> import('./layouts/tenXSubscription'));
const TenXSubscriptionForm = lazy(()=> import('./layouts/tenXSubscription/TenXSubscriptionDetails'));
const TutorialCategoryForm = lazy(()=> import('./layouts/tutorialVideos/tutorialCategoryDetails'));
const TradingHolidaysDetails = lazy(()=> import('./layouts/tradingHolidays'));
const TradingHolidayForm = lazy(()=> import('./layouts/tradingHolidays/data/tradingHolidayDetails'));
const Contact = lazy(()=> import("./layouts/HomePage/pages/Contact")); 
const CreatePaymentHeader = lazy(()=> import("./layouts/Payment/CreatePaymentHeader"));
const College = lazy(()=> import("./layouts/college"));
const InternBatch = lazy(()=> import("./layouts/internBatch"));
const DailyContest = lazy(()=> import("./layouts/dailyContest"));
const NotificationGroup = lazy(()=> import("./layouts/notificationGroup"));
const FullCollege = lazy(()=> import("./layouts/createCollege"));
const NotificationSend = lazy(()=> import("./layouts/sendNotification"));
const Battles = lazy(()=> import("./layouts/battle"));
const CollegeEdit = lazy(()=> import('./layouts/college/CollegeEdit'));
const TenXTrading = lazy(()=> import("./layouts/tenXTrading"));
const VirtualPosition = lazy(()=> import("./layouts/virtualtradePosition"));
const StockPosition = lazy(()=> import("./layouts/stockTradePosition"));
const TenxPosition = lazy(()=> import("./layouts/tenxPosition"));
const DailyContestPosition = lazy(()=> import("./layouts/dailyContestPosition"));
const DailyContestPositionTrader = lazy(()=> import("./layouts/dailyContestPositionTrader"));
const MarginXPosition = lazy(()=> import("./layouts/marginxCompanyPosition"));
const MarginXPositionTrader = lazy(()=> import("./layouts/marginxTraderPosition"));
const KYC = lazy(()=> import('./layouts/KYC/index'));
// const MarginDetails = lazy(()=> import('./layouts/margindetails'));
const CareerDashboard = lazy(()=> import('./layouts/careerdashboard'));
const VirtualDashboard = lazy(()=> import('./layouts/virtualdashboard'));
const StockDashboard = lazy(()=> import('./layouts/stockDashboard'));
const InternshipOrders = lazy(()=> import('./layouts/internshipOrders'));
const StockOrders = lazy(()=> import('./layouts/stockOrders'));
const ContactInfo = lazy(()=> import('./layouts/ContactInfo'));
const TenxReport = lazy(()=> import("./layouts/tenXReport"));
const DailyContestReport = lazy(()=> import("./layouts/dailyContestReport"));
const InternReport = lazy(()=> import("./layouts/internReport"));
const InternshipLeaderboard = lazy(()=> import('./layouts/leaderBoard/internshipLeaderboard'));
const AdminMockReport = lazy(()=> import('./layouts/adminSideReportMock'));
const AdminLiveReport = lazy(()=> import('./layouts/adminSideReportLive'));
const WorkShopOrders = lazy(()=> import('./layouts/userorders/workshopOrder'));
const Chart = lazy(()=> import('./layouts/charts/index'));
const Withdrawal = lazy(()=> import("./layouts/withdrawals"));
const WalletPayment = lazy(()=> import("./layouts/walletPayment"));
const PaymentStatus = lazy(()=> import("./layouts/paymentTest/paymentStatus"));
const InfinityContest = lazy(()=> import("./layouts/dailyContestDashboard/data/infinityContestHeader"));
const DailyContestLiveReport = lazy(()=> import("./layouts/dailyContestReportLive"));
const ContestMaster = lazy(()=> import("./layouts/dailyContest/contestMaster/contestMaster"));
const CreateContestMasterHeader = lazy(()=> import("./layouts/dailyContest/contestMaster/createContestMasterHeader"));
const MarginXDashboard = lazy(()=> import("./layouts/marginXDashboard"));
const MarginXTemplateDetail = lazy(()=> import("./layouts/marginXTemplate"));
const ChallengeTemplateDetail = lazy(()=> import("./layouts/challengeTemplate"));
const ChallengeTemplateForm = lazy(()=> import("./layouts/challengeTemplate/challengeTemplateIndex"));
const BattleTemplateDetail = lazy(()=> import("./layouts/battleTemplate"));
const BattleTemplateForm = lazy(()=> import("./layouts/battleTemplate/battleTemplateIndex"));
const CreateMarginXTemplate = lazy(()=> import("./layouts/marginXTemplate/createMarginIndex"));
const CreateMarginX = lazy(()=> import("./layouts/marginX/createMarginIndex"));
const CreateBattle = lazy(()=> import("./layouts/battle/createBattleIndex"));
const MarginX = lazy(()=> import("./layouts/marginX"));
const BattlePosition = lazy(()=> import("./layouts/battleTraderPosition"));
const BattleReport = lazy(()=> import("./layouts/battleReport"));
const DailyContestAnalytics = lazy(()=> import("./layouts/dailyContestAnalytics"));
const TenXSubscribers = lazy(()=> import("./layouts/tenXSubscribers"));
const MarketingFunnel = lazy(()=> import("./layouts/marketingDashboard"));
const Quiz = lazy(()=> import('./layouts/quiz'));
const City = lazy(()=> import('./layouts/city'));
const QuizDetails = lazy(()=> import('./layouts/quiz/quizDetails'));
const CityDetails = lazy(()=> import('./layouts/city/cityDetails'));
const Register = lazy(()=> import("./layouts/authentication/sign-up/register"));
const RegisterInfo = lazy(()=> import("./layouts/authentication/sign-up/registerationinfo"));
const Lobby = lazy(()=> import("./layouts/schoolLobby/lobby"));
const QuestionBankDetails = lazy(()=> import('./layouts/questionBank/questionBankDetails'));
const QuestionBank = lazy(()=> import('./layouts/questionBank'));
const SchoolDetails = lazy(()=> import('./layouts/schoolOnboarding/schoolDetails'));
const School = lazy(()=> import('./layouts/schoolOnboarding'));
const CourseDetails = lazy(()=> import('./layouts/courses/courseDetails'));
const Course = lazy(()=> import('./layouts/courses'));
const AllTransaction = lazy(()=> import('./layouts/allWalletTransaction'));

// const UserOrders = React.lazy(() => import("./layouts/userorders"));

const routes = [
  {
    key: "alltransactions",
    route: "/alltransactions",
    component: <AllTransaction />,
  },
  {
    key: "school",
    route: "/school",
    component: <School />,
  },
  {
    key: "schooldetails",
    route: "/schooldetails",
    component: <SchoolDetails />,
  },
  {
    key: "questionbank",
    route: "/questionbank",
    component: <QuestionBank />,
  },

  {
    key: "questionbankdetails",
    route: "/questionbankdetails",
    component: <QuestionBankDetails />,
  },
  {
    key: "quiz",
    route: "/quiz",
    component: <Quiz/>,
  },
  {
    key: "city",
    route: "/city",
    component: <City />,
  },

  {
    key: "citydetails",
    route: "/citydetails",
    component: <CityDetails />,
  },
  {
    key: "quizdetails",
    route: "/quizdetails",
    component: <QuizDetails />,
  },
  {
    type: "collapse",
    name: "StoxHero Dashboard",
    key: "stoxherouserdashboard",
    icon: <AllInclusiveIcon/>,
    route: "/stoxherouserdashboard",
    component: <StoxHeroUserDashboard />,
  },
  {
    type: "collapse",
    name: "User Dashboard",
    key: "userdashboard",
    icon: <FaRupeeSign/>,
    route: "/userdashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Revenue Dashboard",
    key: "revenuedashboard",
    icon: <FaRupeeSign/>,
    route: "/revenuedashboard",
    component: <RevenueDashboard />,
  },
  {
    type: "collapse",
    name: "Revenue Analytics",
    key: "revenueanalytics",
    icon: <FaRupeeSign/>,
    route: "/revenueanalytics",
    component: <RevenueAnalytics />,
  },
  {
    type: "collapse",
    name: "Affiliate Dashboard",
    key: "affiliatedashboard",
    icon: <FaAffiliatetheme/>,
    route: "/affiliatedashboard",
    component: <AffiliateDashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "Influencer Dashboard",
  //   key: "influencerdashboard",
  //   icon: <FaAffiliatetheme/>,
  //   route: "/influencerdashboard",
  //   component: <InfluencerDashboard />,
  // },
  {
    type: "collapse",
    name: "Marketing Dashboard",
    key: "marketingdashboard",
    icon: <AllInclusiveIcon/>,
    route: "/marketingdashboard",
    component: <MarketingFunnel />,
  },
  {
    type: "collapse",
    name: "TenX Dashboard",
    key: "tenxdashboard",
    icon: <Forward10Icon/>,
    route: "/tenxdashboard",
    component: <TenXDashboard />,
  },
  {
    type: "collapse",
    name: "Career Dashboard",
    key: "careerdashboard",
    icon: <SchoolIcon/>,
    route: "/careerdashboard",
    component: <CareerDashboard />,
  },
  {
    type: "collapse",
    name: "Virtual Dashboard",
    key: "virtualdashboard",
    icon: <VpnLockIcon/>,
    route: "/virtualdashboard",
    component: <VirtualDashboard />,
  },
  {
    type: "collapse",
    name: "Stock Dashboard",
    key: "stockdashboard",
    icon: <VpnLockIcon/>,
    route: "/stockdashboard",
    component: <StockDashboard />,
  },
  {
    type: "collapse",
    name: "TestZone Dashboard",
    key: "contestdashboard",
    icon: <EmojiEventsIcon/>,
    route: "/contestdashboard",
    component: <DailyContestDashboard />,
  },
  {
    type: "collapse",
    name: "MarginX Dashboard",
    key: "marginxdashboard",
    icon: <EmojiEventsIcon/>,
    route: "/marginxdashboard",
    component: <MarginXDashboard />,
  },
  {
    type: "collapse",
    name: "Courses",
    key: "coursedashboard",
    icon: <LocalLibraryIcon/>,
    route: "/coursedashboard",
    component: <Course />,
  },
  {
    key: "coursedetails",
    route: "/coursedetails",
    component: <CourseDetails />,
  },
    {
    type: "collapse",
    name: "Learning Modules",
    key: "learningmodules",
    icon: <LocalLibraryIcon/>,
    route: "/learningmodules",
    component: <LearningModule />,
  },
  {
    type: "collapse",
    name: "StoxHero Blogs",
    key: "allblogs",
    icon: <BookIcon/>,
    route: "/allblogs",
    component: <Blogs />,
  },
  // {
  //   type: "collapse",
  //   name: "Battle Dashboard",
  //   key: "battledashboard",
  //   icon: <SportsKabaddiIcon/>,
  //   route: "/battledashboard",
  //   component: <BattleDashboard />,
  // },
  {
    type: "collapse",
    name: "TestZone Scoreboard",
    key: "contestscoreboard",
    icon: <EmojiEventsIcon/>,
    route: "/contestscoreboard",
    component: <ContestScoreboard />,
  },
  {
    key: "stockorders",
    route: "/stockorders",
    component: <StockOrders />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "internshiporders",
    // icon: <DashboardIcon/>,
    route: "/internshiporders",
    component: <InternshipOrders />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "internshipleaderboard",
    // icon: <DashboardIcon/>,
    route: "/internshipleaderboard",
    component: <InternshipLeaderboard />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "tenxreport",
    // icon: <DashboardIcon/>,
    route: "/tenxreport",
    component: <TenxReport />,
  },
  {
    key: "dailycontestreport",
    route: "/contestdashboard/dailycontestreport",
    component: <DailyContestReport />,
  },
  {
    key: "dailycontestanalytics",
    route: "/contestdashboard/contestanalytics",
    component: <DailyContestAnalytics />,
  },
  {
    key: "tenxsubscribers",
    route: "/tenxdashboard/tenxsubscribers",
    component: <TenXSubscribers />,
  },
  {
    key: "marginxreport",
    route: "/marginxdashboard/marginxreport",
    component: <MarginXReport />,
  },
  {
    key: "dailycontestreportlive",
    route: "/contestdashboard/dailycontestreportlive",
    component: <DailyContestLiveReport />,
  },
  {
    key: "internreport",
    route: "/internreport",
    component: <InternReport />,
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
    route: "/carouseldetails",
    component: <CarouselDetails />,
  },
  {
    // type: "collapse",
    // name: "Company Dashboard",
    key: "brokerreportdetails",
    // icon: <DashboardIcon/>,
    route: "/brokerreportdetails",
    component: <BrokerReportDetails />,
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
    route: "/arena/:name",
    component: <ContestPage />,
  },
  {
    route: "/about",
    component: <About />,
  },
  {
    route: "/enter-mobile",
    component: <Register />,
  },
  {
    route: "/registrationinfo",
    component: <RegisterInfo />,
  },
  {
    route: "/lobby",
    component: <Lobby />,
  },
  {
    route: "/careerdetails",
    component: <CareerDetails />,
  },
  {
    route: "/collegedetails",
    component: <CollegeDetails />,
  },
  {
    route: "/coupondetails",
    component: <CouponDetails />,
  },
  {
    route: "/blogdetails",
    component: <BlogDetails />,
  },
  {
    route: "/blog/:id",
    component: <BlogForm />,
  },
  {
    route: "/learningmoduledetails/:name",
    component: <LearningModuleDetails />,
  },
  {
    route: "/modulechapterdetails/:name",
    component: <ModuleChapterDetails />,
  },
  {  
    route: "/affiliateprogramdetails",
    component: <AffiliateProgramDetails />,
  },
  {
    route: "/batchdetails",
    component: <BatchDetails />,
  },
  {
    route: "/dailycontestdetails",
    component: <DailyContestDetails />,
  },
  {
    route: "/notificationdetails",
    component: <NotificationDetails />,
  },
  {
    route: "/sendnotificationdetails",
    component: <SendNotificationDetails />,
  },
  {
    route: "/fullcollegedetails",
    component: <FullCollegeDetail />,
  },
  {
    route: "/campaigndetails",
    component: <CampaignDetails />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/careers/:name/jobdescription",
    component: <JD />,
  },
  // {
  //   // type: "collapse",
  //   // name: "Arena",
  //   // key: "arena",
  //   // icon: <BusinessIcon/>,
  //   route: "/home",
  //   component: <Home />,
  // },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "TenX Subscription Details",
    component: <TenXSubscriptionForm />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "tutorialcategory",
    component: <TutorialCategoryForm />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "holidaydetails",
    component: <TradingHolidayForm />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "holidaydetails/:name",
    component: <TradingHolidayForm />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "tradingholiday",
    component: <TradingHolidaysDetails />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",CreatePaymentHeader
    // icon: <BusinessIcon/>,
    route: "Create Payment",
    component: <CreatePaymentHeader />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    key: "careers",
    // icon: <BusinessIcon/>,
    route: "/careers",
    component: <Careers />,
  },
  {
    key: "workshops",
    route: "/workshops",
    component: <Workshops />,
  },
  {
    route: "/apply",
    component: <CareerForm />,
  },
  {
    route: "careers/careerform/:name",
    component: <JobForm />,
  },
  {
    route: "/contact",
    component: <Contact/>,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/arena/:name/register",
    component: <ContestRegisterPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena", DummyPage
    // icon: <BusinessIcon/>,
    route: "/arena/contest/trade",
    component: <ContestTradePage />,
  },
  {
    // type: "collapse",
    // name: "Company Position",
    key: "companyposition",
    // icon: <BusinessIcon/>,
    route: "/companyposition",
    component: <CompanyPosition />,
  },
  {
    // type: "collapse",
    // name: "Company Position",
    key: "companypositionredis",
    // icon: <BusinessIcon/>,
    route: "/companypositionredis",
    component: <CompanyPositionRedis />,
  },
  {
    // type: "collapse",
    // name: "Cohort Position",
    key: "cohortposition",
    // icon: <BusinessIcon/>,
    route: "/cohortposition",
    component: <CohortPosition />,
  },

  {
    // type: "collapse",
    // name: "Trader Position",
    key: "traderposition",
    // icon: <BusinessIcon/>,
    route: "/traderposition",
    component: <TraderPosition />,
  },
  {
    // type: "collapse",
    // name: "Intern Position",
    key: "internposition",
    // icon: <BadgeIcon/>,
    route: "/internposition",
    component: <InternPosition />,
  },
  {
    // type: "collapse",
    // name: "Intern Position",
    key: "infinitycontest",
    // icon: <BadgeIcon/>,
    route: "/contestdashboard/infinitycontest",
    component: <InfinityContest />,
  },
  {
    // type: "collapse",
    // name: "Tenx Position",
    key: "tenxposition",
    // icon: <SupervisorAccountIcon/>,
    route: "/tenxposition",
    component: <TenxPosition />,
  },
  {
    key: "marginxdetails",
    route: "/marginxdashboard/marginxtemplate",
    component: <MarginXTemplateDetail />,
  },
  {
    route: "/challengedashboard/challengetemplate",
    component: <ChallengeTemplateDetail />,
  },
  {
    route: "/battledashboard/battletemplate",
    component: <BattleTemplateDetail />,
  },
  {
    key: "marginxdetails",
    route: "/marginxdashboard/createmarginxtemplate",
    component: <CreateMarginXTemplate />,
  },
  {
    route: "/challengedashboard/challengetemplateform",
    component: <ChallengeTemplateForm/>,
  },
  {
    route: "/battledashboard/battletemplateform",
    component: <BattleTemplateForm/>,
  },
  {
    route: "/battledashboard/:name",
    component: <BattleTemplateForm/>,
  },
  {
    key: "marginx",
    route: "/marginxdashboard/marginx",
    component: <MarginX />,
  },
  {
    key: "marginxdetails",
    route: "/marginxdashboard/createmarginx",
    component: <CreateMarginX />,
  },
  {
    route: "/battledashboard/battles/createbattle",
    component: <CreateBattle />,
  },
  {
    route: "/battledashboard/battles/:name",
    component: <CreateBattle />,
  },
  {
    route: "/battledashboard/battlereport",
    component: <BattleReport />,
  },
  {
    key: "dailycontestposition",
    route: "/contestdashboard/dailycontestposition",
    component: <DailyContestPosition />,
  },

  {
    key: "marginxposition",
    route: "/marginxdashboard/marginxposition",
    component: <MarginXPosition />,
  },
  {
    // type: "collapse",
    // name: "Tenx Position",
    key: "contestmaster",
    // icon: <SupervisorAccountIcon/>,
    route: "/contestdashboard/contestmaster",
    component: <ContestMaster />,
  },

  {
    route: "/createContestMaster",
    component: <CreateContestMasterHeader />,
  },

  {
    key: "dailycontestpositiontrader",
    route: "/contestdashboard/dailycontestpositiontrader",
    component: <DailyContestPositionTrader />,
  },

  {
    key: "marginxtraderposition",
    route: "/marginxdashboard/marginxtraderposition",
    component: <MarginXPositionTrader />,
  },
  {
    key: "battleposition",
    route: "/battledashboard/battleposition",
    component: <BattlePosition />,
  },
  
  {
    key: "virtualposition",
    route: "/virtualposition",
    component: <VirtualPosition />,
  },
  {
    key: "stockposition",
    route: "/stockposition",
    component: <StockPosition />,
  },
  {
    // type: "collapse",
    // name: "Margin Allocation",
    key: "tradersMarginAllocation",
    // icon: <WalletIcon/>,
    route: "/tradersMarginAllocation",
    component: <TradersMarginAllocation />
  },
  {
    type: "collapse",
    name: "Wallet Payment",
    key: "walletpayment",
    icon: <WalletIcon/>,
    route: "/walletpayment",
    component: <WalletPayment />,
  },
  // {
  //   type: "collapse",
  //   name: "Contests",
  //   key: "contests",
  //   icon: <WalletIcon/>,
  //   route: "/contests",
  //   component: <Contests />,
  // },
  {
    type: "collapse",
    name: "Carousel",
    key: "carousel",
    icon: <ViewCarouselIcon/>,
    route: "/carousel",
    component: <Carousel />,
  },
  {

    route: "/brokerreports",
    component: <BrokerReport />,
  },
  {
    // type: "collapse",
    // name: "Careers",
    key: "careerlist",
    // icon: <WorkIcon/>,
    route: "/careerlist",
    component: <CareerList />,
  },
  {
    // type: "collapse",
    // name: "College",
    key: "college",
    // icon: <SchoolIcon/>,
    route: "/college",
    component: <College />,
  },
  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "internshipbatch",
    // icon: <BatchIcon/>,
    route: "/internshipbatch",
    component: <InternBatch />,
  },
  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "notification",
    // icon: <BatchIcon/>,
    route: "/notification",
    component: <NotificationGroup />,
  },
  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "fullcollege",
    // icon: <BatchIcon/>,
    route: "/fullcollege",
    component: <FullCollege />,
  },
  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "sendnotification",
    // icon: <BatchIcon/>,
    route: "/sendnotification",
    component: <NotificationSend />,
  },
  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "dailycontest",
    // icon: <BatchIcon/>,
    route: "/contestdashboard/dailycontest",
    component: <DailyContest />,
  },
  {
    route: "/battledashboard/battles",
    component: <Battles />,
  },
  {
    // icon: <BatchIcon/>,
    route: "/battledashboard/battles",
    component: <Battles />,
  },
  {
    // type: "collapse",
    // name: "Referral Program",
    key: "referralprogram",
    // icon: <FolderSharedIcon/>,
    route: "/referralprogram",
    component: <Referral />,
  },
  {
    // type: "collapse",
    // name: "Campaigns",
    key: "campaigns",
    // icon: <CampaignIcon/>,
    route: "/campaigns",
    component: <Campaigns />,
  },
  {
    // type: "collapse",
    // name: "TenX Subscriptions",
    key: "tenxsubscriptions",
    // icon: <CardMembershipIcon/>,
    route: "/tenxsubscriptions",
    component: <TenXSubscription />,
  },
  {
    // type: "collapse",
    // name: "Tutorial Videos",
    key: "tutorialvideos",
    // icon: <CardMembershipIcon/>,
    route: "/tutorialvideos",
    component: <TutorialVideos />,
  },
  
  {
    // type: "collapse",
    // name: "Admin Reports(M)",
    key: "adminreport",
    // icon: <SummarizeIcon/>,
    route: "/adminreport",
    component: <AdminMockReport/>,
  },
  {
    // type: "collapse",
    // name: "Admin Reports(L)",
    key: "adminreportlive",
    // icon: <SummarizeIcon/>,
    route: "/adminreportlive",
    component: <AdminLiveReport/>,
  },
  {
    // type: "collapse",
    // name: "Trader Reports(M)",
    key: "tradersReport",
    // icon: <ReportIcon/>,
    route: "/tradersReport",
    component: <TradersReport/>,
  },
  {
    // type: "collapse",
    // name: "Trader Reports(L)",
    key: "tradersReportlive",
    // icon: <ReportIcon/>,
    route: "/tradersReportLive",
    component: <TradersReportLive/>,
  },
  {
    // type: "collapse",
    // name: "All Orders",
    key: "orders",
    // icon: <TableViewIcon/>,
    route: "/orders",
    component: <Orders />,
  },
  {
    // type: "collapse",
    // name: "Instruments",
    key: "instruments",
    // icon:<CandlestickChartIcon/>,
    route: "/instruments",
    component: <Instruments />,
  },
  {
    // type: "collapse",
    // name: "Algo Box(s)",
    key: "algobox",
    // icon: <ManageAccountsIcon/>,
    route: "/algobox",
    component: <AlgoBox />,
  },
  {
    route: "/trading-accounts",
    component: <TradingAccount />,
  },
  {
    key: "coupons",
    route: "/coupons",
    component: <Coupons />,
  },
  {
    route: "/affiliateprograms",
    component: <AffiliateProgram />,
  },
  {
    route: "/setting",
    component: <Setting />,
  },
  {
    key: "portfolio",
    route: "/portfolio",
    component: <Portfolio />,
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
  {
    // type: "collapse",
    // name: "Virtual Trading",
    key: "virtualtrading",
    // icon: <BusinessIcon/>,
    route: "/virtualtrading",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "Contact Info",
    key: "contactinfo",
    icon: <CampaignIcon/>,
    route: "/contactinfo",
    component: <ContactInfo />,
  },
  {
    // type: "collapse",
    // name: "Infinity Trading",
    key: "infinitytrading",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <GiNinjaHeroicStance/>,
    route: "/infinitytrading",
    component: <InfinityTrader />,
  },
  {
    // type: "collapse",
    // name: "TenX Trading",
    key: "tenxtrading",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <CurrencyRupeeIcon/>,
    route: "/tenxtrading",
    component: <TenXTrading />,
  },
  {
    type: "collapse",
    name: "Internship",
    key: "internship",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <MenuBookIcon/>,
    route: "/internship",
    component: <Internship />,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/internship/trade",
    component: <InternshipTrade/>,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/workshop/trade",
    component: <InternshipTrade/>,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/workshop/orders",
    component: <WorkShopOrders/>,
  },
  {
    // type: "collapse",
    // name: "Orders",
    key: "userorders",
    // icon: <InventoryIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  {
    // type: "collapse",
    // name: "Referrals",
    key: "myreferrals",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <PersonIcon/>,
    route: "/myreferrals",
    component: <MyReferrals />,
  },
  {
    // type: "collapse",
    // name: "Analytics",
    key: "analytics",
    // icon: <Icon fontSize="small">person</Icon>,
    // icon: <AnalyticsIcon/>,
    route: "/analytics",
    component: <UserAnalytics />,
  },
  {
    // type: "collapse",
    // name: "Funds",
    key: "funds",
    // icon: <CurrencyRupeeIcon/>,
    route: "/funds",
    component: <Funds />,
  },
  {
    // type: "collapse",
    // name: "Profile",
    key: "profile",
    // icon: <AccountBoxIcon/>,
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
  
  {
    // type: "collapse",
    // name: "Wallet",
    key: "collegeEdit",
    // icon: <AccountBalanceWalletIcon/>,
    route: "/collegeEdit",
    component: <CollegeEdit/>,
  },
  {
    // type: "collapse",
    // name: "Portfolio",
    key: "portfolio",
    // icon: <BusinessCenterIcon/>,
    route: "/myportfolio",
    component: <MyPortfolio />,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/chart",
    component: <Chart/>,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/paymenttest",
    component: <PaymentTest/>,
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
    type: "collapse",
    name: "Withdrawals",
    key: "withdrawals",
    icon: <MonetizationOnIcon/>,
    route: "/withdrawals",
    component: <Withdrawal/>,
  },
  {
    type: "collapse",
    name: "KYC",
    key: "kyc",
    icon: <ReportIcon/>,
    route: "/kyc",
    component: <KYC/>,
  },


];

export default routes;
