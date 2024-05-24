// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateLearningModuleForm from "./createLearningModuleForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <CreateLearningModuleForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
