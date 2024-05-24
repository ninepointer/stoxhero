// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ChallengeTemplateIndex from "./challengeTemplateForm";
// import TabContext from '@material-ui/lab/TabContext';

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ChallengeTemplateIndex/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
