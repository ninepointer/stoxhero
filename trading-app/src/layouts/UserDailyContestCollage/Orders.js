// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DailyContestOrders from "./data/viewOrders";

function Tables() {


  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <DailyContestOrders />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
