import userRoute from "./routesUser";
import { FaAffiliatetheme } from "react-icons/fa";
import TutorialVideo from './layouts/tutorials'

const routes = [
  {
    type: "collapse",
    name: "Course",
    key: "course",
    icon: <FaAffiliatetheme/>,
    route: "/course",
    component: <TutorialVideo />,
  }
];

const affiliateRoute = routes.concat(userRoute);


export default affiliateRoute;
