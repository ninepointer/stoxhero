// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProgramForm from "./programForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ProgramForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
