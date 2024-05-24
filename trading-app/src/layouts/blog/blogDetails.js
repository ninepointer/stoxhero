// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateBlogForm from "./createBlogForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <CreateBlogForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
