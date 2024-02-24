// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateCourseForm from "./createCourseForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <CreateCourseForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
