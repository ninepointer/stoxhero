import userRoute from "./routesUser";
import { FaAffiliatetheme } from "react-icons/fa";
import AffiliateDashboard from "./layouts/myAffiliateDashboard"
const routes = [
  {
    type: "collapse",
    name: "Affiliate Dashboard",
    key: "myaffiliatedashboard",
    icon: <FaAffiliatetheme/>,
    route: "/myaffiliatedashboard",
    component: <AffiliateDashboard />,
  }
];

const affiliateRoute = routes.concat(userRoute);


export default affiliateRoute;
