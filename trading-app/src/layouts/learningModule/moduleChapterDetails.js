// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateModuleChapterForm from "./createModuleChapterForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <CreateModuleChapterForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
