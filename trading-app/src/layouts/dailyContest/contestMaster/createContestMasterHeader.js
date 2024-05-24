// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import CreateDailyContestForm from "./createContestMaster";

function CreateContestMasterHeader() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreateDailyContestForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default CreateContestMasterHeader;