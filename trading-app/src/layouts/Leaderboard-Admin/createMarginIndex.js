// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateMarginForm from "./createMarginForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreateMarginForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
