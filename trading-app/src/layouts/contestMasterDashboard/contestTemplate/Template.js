// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import EditDailyContestForm from "./editTemplete";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <EditDailyContestForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
