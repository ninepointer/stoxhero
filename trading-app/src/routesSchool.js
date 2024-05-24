import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SchoolDashboard from "./layouts/schoolDashboard";

  const routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "schooldashboard",
      icon: <MilitaryTechIcon />,
      route: `/schooldashboard`,
      component: <SchoolDashboard />,
    },
  ];

  export default routes;


