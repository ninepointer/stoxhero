// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ContestTradingView from "./data/tradingWindow";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestTradingView/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
