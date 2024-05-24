// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ActivationHomePage from "./programHomePage";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ActivationHomePage/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
