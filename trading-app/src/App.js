import {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
  Suspense,
  lazy
} from "react";
import axios from "axios";
import ReactGA from "react-ga";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { apiUrl } from "./constants/constants";

// @mui material components
import { CircularProgress, LinearProgress } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsIcon from "@mui/icons-material/Settings";

// Material Dashboard 2 React components
import MDBox from "./components/MDBox";
// import MDAvatar from "./components/MDAvatar";

// Material Dashboard 2 React example components
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "./routes";
// import adminRoutes from "./routes";
import userRoutes from "./routesUser";
import routesSchool from "./routesSchool";
import analyticsRoutes from "./analyticsRoutes";
// import routesAffiliate from "./routesAffiliate";
import routesAffiliate from "./routesAffiliate";
// import routesInfluencerFunc from "./routesInfluencer";
import routesCollegeFunc from "./routesCollege";
// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
  setLayout,
} from "./context";

import ProtectedRoute from "./ProtectedRoute";
import { socketContext } from "./socketContext";
import { Howl } from "howler";
import sound from "./assets/sound/tradeSound.mp3";
import { adminRole } from "./variables";
import { userRole } from "./variables";
import { Affiliate, schoolRole, Influencer } from "./variables";

// Images
import brandWhite from "./assets/images/logo-ct.png";
import Logo from "./assets/images/logos/fullLogo.png";
import brandDark from "./assets/images/logo-ct-dark.png";
import { userContext } from "./AuthContext";
import Cookies from "js-cookie";
import homeRoutes from "./homeRoute";

// import SignUp from "./layouts/authentication/sign-up";
// import Careers from "./layouts/HomePage/pages/Career";
// import Workshops from "./layouts/HomePage/pages/Workshop";
// import JobDescription from "./layouts/HomePage/pages/JobDescription";
// import JobApply from "./layouts/HomePage/pages/EICCareerForm";
// import ContestRegistration from "./layouts/HomePage/pages/ContestRegistration";
// import FeaturedContestRegistration from "./layouts/HomePage/pages/FeaturedContestRegistration";
// import About from "./layouts/HomePage/pages/About";
// import Courses from "./layouts/HomePage/pages/courses/Courses";
// import CoursesDetail from "./layouts/HomePage/pages/courses/CoursesDetails";
// import AboutFinowledge from "./layouts/HomePage/pages/AboutFinowledge";
// import FillSignupDetail from "./layouts/HomePage/pages/courses/signupDetail";
// import ResetPin from "./layouts/authentication/reset-password/cover/resetPin";
// import ResetPassword from "./layouts/authentication/reset-password/cover";
// import Contact from "./layouts/HomePage/pages/Contact";
// import Privacy from "./layouts/HomePage/pages/Privacy";
// import Terms from "./layouts/HomePage/pages/Tnc";
import MessagePopUp from "./MessagePopup";
// import AdminLogin from "./layouts/authentication/sign-in/adminLogin";
// import SchoolLogin from "./layouts/authentication/sign-in/schoolLogin";
// import TradingGuru from "./layouts/authentication/sign-up/tradingguru";
// import Register from "./layouts/authentication/sign-up/register";
// import RegisterInfo from "./layouts/authentication/sign-up/registerationinfo";
// import Lobby from "./layouts/schoolLobby/lobby";
// import BlogCard from "./layouts/HomePage/pages/BlogCards";
// import BlogData from "./layouts/HomePage/pages/BlogData";
// import Calculator from "./layouts/HomePage/pages/Calculator";
// import CollegeSignUp from "./layouts/authentication/sign-up/collegeSignupLogin";
// import ContactFinowledge from "./layouts/HomePage/pages/ContactFinowledge";
// import FinowledgeComingSoon from "./layouts/HomePage/pages/finowledgeComingSoon";
// import MyQuiz from "./layouts/schoolLobby/quizApp/docs/index";
// import Workshop from "./layouts/HomePage/pages/courses/Workshop";


const SignUp = lazy(() => import("./layouts/authentication/sign-up"));
const Careers = lazy(() => import("./layouts/HomePage/pages/Career"));
const Workshops = lazy(() => import("./layouts/HomePage/pages/Workshop"));
const JobDescription = lazy(() => import("./layouts/HomePage/pages/JobDescription"));
const JobApply = lazy(() => import("./layouts/HomePage/pages/EICCareerForm"));
const ContestRegistration = lazy(() => import("./layouts/HomePage/pages/ContestRegistration"));
const FeaturedContestRegistration = lazy(() => import("./layouts/HomePage/pages/FeaturedContestRegistration"));
const About = lazy(() => import("./layouts/HomePage/pages/About"));
const Courses = lazy(() => import("./layouts/HomePage/pages/courses/Courses"));
const CoursesDetail = lazy(() => import("./layouts/HomePage/pages/courses/CoursesDetails"));
const AboutFinowledge = lazy(() => import("./layouts/HomePage/pages/AboutFinowledge"));
const FillSignupDetail = lazy(() => import("./layouts/HomePage/pages/courses/signupDetail"));
const ResetPin = lazy(() => import("./layouts/authentication/reset-password/cover/resetPin"));
const ResetPassword = lazy(() => import("./layouts/authentication/reset-password/cover"));
const Contact = lazy(() => import("./layouts/HomePage/pages/Contact"));
const Privacy = lazy(() => import("./layouts/HomePage/pages/Privacy"));
const Terms = lazy(() => import("./layouts/HomePage/pages/Tnc"));
// const MessagePopUp = lazy(() => import("./MessagePopup"));
const AdminLogin = lazy(() => import("./layouts/authentication/sign-in/adminLogin"));
const SchoolLogin = lazy(() => import("./layouts/authentication/sign-in/schoolLogin"));
const TradingGuru = lazy(() => import("./layouts/authentication/sign-up/tradingguru"));
const Register = lazy(() => import("./layouts/authentication/sign-up/register"));
const RegisterInfo = lazy(() => import("./layouts/authentication/sign-up/registerationinfo"));
const Lobby = lazy(() => import("./layouts/schoolLobby/lobby"));
const BlogCard = lazy(() => import("./layouts/HomePage/pages/BlogCards"));
const BlogData = lazy(() => import("./layouts/HomePage/pages/BlogData"));
const Calculator = lazy(() => import("./layouts/HomePage/pages/Calculator"));
const CollegeSignUp = lazy(() => import("./layouts/authentication/sign-up/collegeSignupLogin"));
const ContactFinowledge = lazy(() => import("./layouts/HomePage/pages/ContactFinowledge"));
const FinowledgeComingSoon = lazy(() => import("./layouts/HomePage/pages/finowledgeComingSoon"));
const MyQuiz = lazy(() => import("./layouts/schoolLobby/quizApp/docs/index"));
const Workshop = lazy(() => import("./layouts/HomePage/pages/courses/Workshop"));


const TRACKING_ID = "UA-264098426-2";
ReactGA.initialize(TRACKING_ID);

function NotFound() {
  let navigate = useNavigate();
  // Redirecting to home when the component is loaded
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null; // You can also return some "Not Found" text or component here if you prefer
}

export default function App() {
  const routesCollege = routesCollegeFunc();
  // const routesInfluencer = routesInfluencerFunc()
  const cookieValue = Cookies.get("jwtoken");
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  // const [routes1, setRoutes] = useState();
  const [detailUser, setDetailUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();
  const location = useLocation();
  let myLocation = useRef(location);
  const socket = useContext(socketContext);

  //get userdetail who is loggedin
  const setDetails = useContext(userContext);
  const getDetails = useContext(userContext);
  const navigate = useNavigate();
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/loginDetail`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then((res) => {
        setDetails.setUserDetail(res.data);
        setDetailUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        fetchSchoolInfo();
        setIsLoading(false);
      });

    setDetails.setTradeSound(
      new Howl({
        src: [sound],
        html5: true,
      })
    );
  }, []);

  async function fetchSchoolInfo() {
    const data = await axios.get(`${apiUrl}schooldetails`, {
      withCredentials: true,
    });
    setDetails.setUserDetail(data?.data?.data);
    setDetailUser(data?.data?.data);
  }

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction, getDetails]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, getDetails]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.route !== "/") {
          return (
              <Route
                exact
                path={route.route}
                element={
                  // <SchoolDetailsProtectedRoute>
                  <ProtectedRoute>{route.component}</ProtectedRoute>
                  // </SchoolDetailsProtectedRoute>
                }
                key={route.key}
              />
          );
        } else {
          return (
            <Route
              exact
              path={route.route}
              element={route.component}
              key={route.key}
            />
          );
        }
      }
      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <SettingsIcon />
    </MDBox>
  );

  if (isLoading) {
    return <div></div>;
  }

  const isCollegeRoute = pathname.includes(
    getDetails?.userDetails?.collegeDetails?.college?.route
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "stoxherouserdashboard" && (
          <>
            {
              (getDetails?.userDetails?.role?.roleName == adminRole ||
                getDetails?.userDetails?.role?.roleName == userRole ||
                getDetails?.userDetails?.role?.roleName == Affiliate ||
                getDetails?.userDetails?.role?.roleName === Influencer) && (
                <Sidenav
                  color={sidenavColor}
                  brand={
                    (transparentSidenav && !darkMode) || whiteSidenav
                      ? brandDark
                      : brandWhite
                  }
                  // brandName="StoxHero"
                  routes={
                    detailUser.role?.roleName === adminRole ||
                    getDetails?.userDetails?.role?.roleName === adminRole
                      ? routes
                      : detailUser.role?.roleName === Affiliate ||
                        getDetails?.userDetails?.role?.roleName === Affiliate
                      ? routesAffiliate
                      : detailUser.role?.roleName === userRole ||
                        detailUser.role?.roleName === Influencer ||
                        getDetails?.userDetails?.role?.roleName === userRole ||
                        getDetails?.userDetails?.role?.roleName === Influencer
                      ? isCollegeRoute
                        ? routesCollege
                        : userRoutes
                      : detailUser.role?.roleName === "data" ||
                        getDetails?.userDetails?.role?.roleName === "data"
                      ? analyticsRoutes
                      : detailUser.role?.roleName === schoolRole ||
                        getDetails?.userDetails?.role?.roleName === schoolRole
                      ? routesSchool
                      : homeRoutes
                  }
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
              )
              // <NewSidenav/>
            }

            <Configurator />
            {configsButton}
          </>
        )}
      </ThemeProvider>
      <MessagePopUp socket={socket} />
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          {
            (getDetails?.userDetails?.role?.roleName === schoolRole ||
              getDetails?.userDetails?.role?.roleName === Affiliate ||
              getDetails?.userDetails?.role?.roleName === adminRole ||
              getDetails?.userDetails?.role?.roleName === userRole ||
              getDetails?.userDetails?.role?.roleName === Influencer) && (
              <Sidenav
                color={sidenavColor}
                brand={Logo}
                // brandName="StoxHero"
                routes={
                  detailUser.role?.roleName === adminRole ||
                  getDetails?.userDetails?.role?.roleName === adminRole
                    ? routes
                    : detailUser.role?.roleName === userRole ||
                      detailUser.role?.roleName === Influencer ||
                      getDetails?.userDetails?.role?.roleName === userRole ||
                      getDetails?.userDetails?.role?.roleName === Influencer
                    ? isCollegeRoute
                      ? routesCollege
                      : userRoutes
                    : detailUser.role?.roleName === Affiliate ||
                      getDetails?.userDetails?.role?.roleName === Affiliate
                    ? routesAffiliate
                    : detailUser.role?.roleName === "data" ||
                      getDetails?.userDetails?.role?.roleName === "data"
                    ? analyticsRoutes
                    : detailUser.role?.roleName === schoolRole ||
                      getDetails?.userDetails?.role?.roleName === schoolRole
                    ? routesSchool
                    : homeRoutes
                }
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            )
            // <NewSidenav/>
          }

          <Configurator />
          {/* {configsButton} */}
        </>
      )}
      {layout === "infinitydashboard" && <Configurator />}
      {/* {layout === "analytics" && <Configurator />} */}
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginLeft: '50px' }}><CircularProgress color='info' /></div>}>
      <Routes>
        {detailUser.role?.roleName === adminRole ||
        getDetails?.userDetails?.role?.roleName === adminRole
          ? getRoutes(routes)
          : detailUser.role?.roleName === Affiliate ||
            getDetails?.userDetails?.role?.roleName === Affiliate
          ? getRoutes(routesAffiliate)
          : detailUser.role?.roleName === userRole ||
            detailUser.role?.roleName === Influencer ||
            getDetails?.userDetails?.role?.roleName === userRole ||
            getDetails?.userDetails?.role?.roleName === Influencer
          ? isCollegeRoute
            ? getRoutes(routesCollege)
            : getRoutes(userRoutes)
          : detailUser.role?.roleName === "data" ||
            getDetails?.userDetails?.role?.roleName === "data"
          ? getRoutes(analyticsRoutes)
          : detailUser.role?.roleName === schoolRole ||
            getDetails?.userDetails?.role?.roleName === schoolRole
          ? getRoutes(routesSchool)
          : getRoutes(homeRoutes)}

        {
          !cookieValue ? (
            // pathname == "/login" ?
            // <Route path="/login" element={<SignIn />} />
            // :
            pathname == "/" ? (
              <Route
                path="/"
                element={<SignUp location={myLocation.current} />}
              />
            ) : pathname == "/resetpassword" ? (
              <Route path="/resetpassword" element={<ResetPassword />} />
            ) : (
              <Route path="/" element={<SignUp />} />
            )
          ) : pathname == "/" || !pathname ? (
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    getDetails?.userDetails.role?.roleName === adminRole
                      ? "/tenxdashboard"
                      : getDetails.userDetails?.designation == "Equity Trader"
                      ? "/infinitytrading"
                      : getDetails?.userDetails.role?.roleName === schoolRole
                      ? "/schooldashboard"
                      : "/home"
                  }
                />
              }
            />
          ) : pathname == "/:collegename" ? (
            <Route
              path="/:collegename"
              element={<CollegeSignUp location={myLocation.current} />}
            />
          ) : (
            <Route path="*" element={<NotFound />} />
          )
          // <Route path="/" element={<Navigate to={pathname} />} />
          // <Route path="/" element={<Navigate to="/virtualtrading" />} />
        }

        <Route path="/resetpin" element={<ResetPin />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/careers"
          element={<Careers location={myLocation.current} />}
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/careers/:name/jobdescription"
          element={<JobDescription />}
        />
        <Route path="/careers/careerform/:name" element={<JobApply />} />
        <Route path="/blogs" element={<BlogCard />} />
        <Route path="/calculators" element={<Calculator />} />
        <Route
          path="/"
          element={
            <Navigate
              to={
                getDetails?.userDetails?.role
                  ? getDetails?.userDetails.role?.roleName === adminRole
                    ? "/tenxdashboard"
                    : getDetails.userDetails?.designation == "Equity Trader"
                    ? "/infinitytrading"
                    : "/home"
                  : "/"
              }
            />
          }
        />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/school" element={<SchoolLogin />} />
        <Route path="/tradingguru" element={<TradingGuru />} />
        <Route path="/about" element={<About />} />
        <Route path="/aboutus" element={<AboutFinowledge />} />
        <Route path="/challenge" element={<FinowledgeComingSoon />} />
        <Route path="/tryquiz" element={<FinowledgeComingSoon />} />

        <Route path="/enter-mobile" element={<Register />} />
        <Route path="/registrationinfo" element={<RegisterInfo />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/myquiz" element={<MyQuiz />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/contactus" element={<ContactFinowledge />} />
        {/* <Route path="/watchcourse" element={<WatchCourse />} /> */}

        <Route
          path="/workshops"
          element={<Workshops location={myLocation.current} />}
        />
        <Route path="/blogs/:id" element={<BlogData />} />
        <Route
          path="/collegetestzone/:id/:date"
          element={<ContestRegistration />}
        />
        <Route
          path="/competitions/:id"
          element={<FeaturedContestRegistration />}
        />
        <Route path="/workshop/:id" element={<Workshop />} />

        <Route path="/influencers/:slug" element={<Courses />} />
        <Route path="/influencers/:slug/details" element={<CoursesDetail />} />
        <Route
          path="/influencers/:slug/fill+details"
          element={<FillSignupDetail />}
        />
        <Route
          path="/:collegename"
          element={<CollegeSignUp location={myLocation.current} />}
        />

        <Route path="*" element={<NotFound />} />
        
      </Routes>
      </Suspense>
      <MessagePopUp socket={socket} userId={detailUser?._id} />
    </ThemeProvider>
  );
}

